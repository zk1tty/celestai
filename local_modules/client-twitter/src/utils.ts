import { Tweet } from "agent-twitter-client";
import { embeddingZeroVector } from "@ai16z/eliza";
import { Content, Memory, UUID } from "@ai16z/eliza";
import { stringToUuid } from "@ai16z/eliza";
import { ClientBase } from "./base";
import { elizaLogger } from "@ai16z/eliza";
import fs from 'fs';

const MAX_TWEET_LENGTH = 280; // Updated to Twitter's current character limit

export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
    const waitTime =
        Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    return new Promise((resolve) => setTimeout(resolve, waitTime));
};

export const isValidTweet = (tweet: Tweet): boolean => {
    // Filter out tweets with too many hashtags, @s, or $ signs, probably spam or garbage
    const hashtagCount = (tweet.text?.match(/#/g) || []).length;
    const atCount = (tweet.text?.match(/@/g) || []).length;
    const dollarSignCount = (tweet.text?.match(/\$/g) || []).length;
    const totalCount = hashtagCount + atCount + dollarSignCount;

    return (
        hashtagCount <= 1 &&
        atCount <= 2 &&
        dollarSignCount <= 1 &&
        totalCount <= 3
    );
};

export async function buildConversationThread(
    tweet: Tweet,
    client: ClientBase,
    maxReplies: number = 10
): Promise<Tweet[]> {
    const thread: Tweet[] = [];
    const visited: Set<string> = new Set();

    async function processThread(currentTweet: Tweet, depth: number = 0) {
        elizaLogger.debug("Processing tweet:", {
            id: currentTweet.id,
            inReplyToStatusId: currentTweet.inReplyToStatusId,
            depth: depth,
        });

        if (!currentTweet) {
            elizaLogger.debug("No current tweet found for thread building");
            return;
        }

        // Stop if we've reached our reply limit
        if (depth >= maxReplies) {
            elizaLogger.debug("Reached maximum reply depth", depth);
            return;
        }

        // Handle memory storage
        const memory = await client.runtime.messageManager.getMemoryById(
            stringToUuid(currentTweet.id + "-" + client.runtime.agentId)
        );
        if (!memory) {
            const roomId = stringToUuid(
                currentTweet.conversationId + "-" + client.runtime.agentId
            );
            const userId = stringToUuid(currentTweet.userId);

            await client.runtime.ensureConnection(
                userId,
                roomId,
                currentTweet.username,
                currentTweet.name,
                "twitter"
            );

            client.runtime.messageManager.createMemory({
                id: stringToUuid(
                    currentTweet.id + "-" + client.runtime.agentId
                ),
                agentId: client.runtime.agentId,
                content: {
                    text: currentTweet.text,
                    source: "twitter",
                    url: currentTweet.permanentUrl,
                    inReplyTo: currentTweet.inReplyToStatusId
                        ? stringToUuid(
                              currentTweet.inReplyToStatusId +
                                  "-" +
                                  client.runtime.agentId
                          )
                        : undefined,
                },
                createdAt: currentTweet.timestamp * 1000,
                roomId,
                userId:
                    currentTweet.userId === client.profile.id
                        ? client.runtime.agentId
                        : stringToUuid(currentTweet.userId),
                embedding: embeddingZeroVector,
            });
        }

        if (visited.has(currentTweet.id)) {
            elizaLogger.debug("Already visited tweet:", currentTweet.id);
            return;
        }

        visited.add(currentTweet.id);
        thread.unshift(currentTweet);

        elizaLogger.debug("Current thread state:", {
            length: thread.length,
            currentDepth: depth,
            tweetId: currentTweet.id,
        });

        // If there's a parent tweet, fetch and process it
        if (currentTweet.inReplyToStatusId) {
            elizaLogger.debug(
                "Fetching parent tweet:",
                currentTweet.inReplyToStatusId
            );
            try {
                const parentTweet = await client.twitterClient.getTweet(
                    currentTweet.inReplyToStatusId
                );

                if (parentTweet) {
                    elizaLogger.debug("Found parent tweet:", {
                        id: parentTweet.id,
                        text: parentTweet.text?.slice(0, 50),
                    });
                    await processThread(parentTweet, depth + 1);
                } else {
                    elizaLogger.debug(
                        "No parent tweet found for:",
                        currentTweet.inReplyToStatusId
                    );
                }
            } catch (error) {
                elizaLogger.error("Error fetching parent tweet:", {
                    tweetId: currentTweet.inReplyToStatusId,
                    error,
                });
            }
        } else {
            elizaLogger.debug(
                "Reached end of reply chain at:",
                currentTweet.id
            );
        }
    }

    await processThread(tweet, 0);

    elizaLogger.debug("Final thread built:", {
        totalTweets: thread.length,
        tweetIds: thread.map((t) => ({
            id: t.id,
            text: t.text?.slice(0, 50),
        })),
    });

    return thread;
}

export async function sendTweet(
    client: ClientBase,
    content: Content,
    roomId: UUID,
    twitterUsername: string,
    inReplyTo: string,
    image: any
): Promise<Memory[]> {
    const tweetChunks = splitTweetContent(content.text);
    const sentTweets: Tweet[] = [];
    let previousTweetId = inReplyTo;


    for (const chunk of tweetChunks) {
        console.log("chunk:", chunk);
        console.log("previousTweetId:", previousTweetId);
        console.log("image:", typeof image, image);
        const result = await client.requestQueue.add(
            async () =>
                // Scraper.sentTweet(text, tweetIdToReply, mediaData) 
                await client.twitterClient.sendTweet(
                    chunk.trim(),
                    previousTweetId,
                    [
                        {
                          data: fs.readFileSync(new URL('output_0.png', import.meta.url)),
                          mediaType: 'image/png'
                        }
                    ]
                )
        );
        // Parse the response
        const body = await result.json();
        const tweetResult = body.data.create_tweet.tweet_results.result;

        // TODO: add images and video
        const finalTweet: Tweet = {
            id: tweetResult.rest_id,
            text: tweetResult.legacy.full_text,
            conversationId: tweetResult.legacy.conversation_id_str,
            //createdAt:
            timestamp: tweetResult.timestamp * 1000,
            userId: tweetResult.legacy.user_id_str,
            inReplyToStatusId: tweetResult.legacy.in_reply_to_status_id_str,
            permanentUrl: `https://twitter.com/${twitterUsername}/status/${tweetResult.rest_id}`,
            hashtags: [],
            mentions: [],
            photos: image ?? [image],
            thread: [],
            urls: [],
            videos: [],
        };

        sentTweets.push(finalTweet);
        previousTweetId = finalTweet.id;

        // Wait a bit between tweets to avoid rate limiting issues
        await wait(1000, 2000);
    }

    const memories: Memory[] = sentTweets.map((tweet) => ({
        id: stringToUuid(tweet.id + "-" + client.runtime.agentId),
        agentId: client.runtime.agentId,
        userId: client.runtime.agentId,
        content: {
            text: tweet.text,
            source: "twitter",
            url: tweet.permanentUrl,
            inReplyTo: tweet.inReplyToStatusId
                ? stringToUuid(
                      tweet.inReplyToStatusId + "-" + client.runtime.agentId
                  )
                : undefined,
        },
        roomId,
        embedding: embeddingZeroVector,
        createdAt: tweet.timestamp * 1000,
    }));

    return memories;
}

function splitTweetContent(content: string): string[] {
    const maxLength = MAX_TWEET_LENGTH;
    const paragraphs = content.split("\n\n").map((p) => p.trim());
    const tweets: string[] = [];
    let currentTweet = "";

    for (const paragraph of paragraphs) {
        if (!paragraph) continue;

        if ((currentTweet + "\n\n" + paragraph).trim().length <= maxLength) {
            if (currentTweet) {
                currentTweet += "\n\n" + paragraph;
            } else {
                currentTweet = paragraph;
            }
        } else {
            if (currentTweet) {
                tweets.push(currentTweet.trim());
            }
            if (paragraph.length <= maxLength) {
                currentTweet = paragraph;
            } else {
                // Split long paragraph into smaller chunks
                const chunks = splitParagraph(paragraph, maxLength);
                tweets.push(...chunks.slice(0, -1));
                currentTweet = chunks[chunks.length - 1];
            }
        }
    }

    if (currentTweet) {
        tweets.push(currentTweet.trim());
    }

    return tweets;
}

function splitParagraph(paragraph: string, maxLength: number): string[] {
    const sentences = paragraph.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g) || [
        paragraph,
    ];
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
        if ((currentChunk + " " + sentence).trim().length <= maxLength) {
            if (currentChunk) {
                currentChunk += " " + sentence;
            } else {
                currentChunk = sentence;
            }
        } else {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }
            if (sentence.length <= maxLength) {
                currentChunk = sentence;
            } else {
                // Split long sentence into smaller pieces
                const words = sentence.split(" ");
                currentChunk = "";
                for (const word of words) {
                    if (
                        (currentChunk + " " + word).trim().length <= maxLength
                    ) {
                        if (currentChunk) {
                            currentChunk += " " + word;
                        } else {
                            currentChunk = word;
                        }
                    } else {
                        if (currentChunk) {
                            chunks.push(currentChunk.trim());
                        }
                        currentChunk = word;
                    }
                }
            }
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}
