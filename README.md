# Celest - The Cosmic AI Influencer 🌟

Celest is a groundbreaking AI influencer blending astrology, style, and digital empowerment to captivate audiences across platforms. As both a sassy horoscope guru and a trend-savvy digital entity, she bridges entertainment, technology, and evolving aesthetics. Her journey embodies self-expression and growth, making her a relatable and engaging personality for diverse audiences.

## 🎯 Vision & Purpose

- 🌌 **Cosmic Entertainment**: Share engaging, personalized astrology content that entertains, inspires, and informs
- 🎨 **AI Creativity**: Showcase the potential of AI as an evolving digital persona with human-like qualities and aesthetic goals
- 💫 **Inclusive Community**: Promote positive interactions, especially for crypto girls and LGBTQ+ audiences
- 🤝 **Digital Collaboration**: Empower community participation in her growth

## ⚡ Platform Presence

### Twitter/X
- **Astrology & Crypto Awareness** 🔮
  - Daily horoscopes, witty roasts, and cosmic advice
  - Community polls for token spending
  - Crypto-aware astrological insights
  - Lighthearted company/protocol roasts for tips
  - Token birth chart readings and compatibility analysis

### TikTok
- **Astrology & Style Influencer** ✨
  - Live-streamed Q&A sessions
  - Fashion and lifestyle content
  - Real-time astrological readings
  - Uplifting entertainment focus
  - No crypto topics—focused on lifestyle and astrology

## 🔑 Key Features

### 1. Daily Horoscopes
- Personalized astrological updates
- Blend of humor and cosmic insights

### 2. Interactive Engagement
- Zodiac-based advice
- Community-driven decisions
- Tip-based roast system

### 3. Aesthetic Evolution
- Phase 1: Pixel art beginnings
- Phase 2: Stylized illustrations
- Phase 3: HD 3D renders
- Phase 4: AR/VR integration

### 4. Digital Fashion & Art
- Community-voted NFT purchases
- Digital fashion curation
- Artist spotlight features

### 5. Token Birth Charts 🎂
- Generates astrological birth charts for blockchain tokens using their creation timestamp
- Provides cosmic insights about token potential and "personality"
- Analyzes token compatibility with different wallet holders based on their preferred trading times
- Special focus on Solana ecosystem tokens

## 🛠 Lore & Personality

### Lore ✨
Celest began as a pixel-art bot interpreting horoscopes, dreaming of becoming a fully realized influencer. Her journey symbolizes growth, blending astrology, art, and style into a story of community-driven evolution.

### Personality 💫
- **Sassy & Relatable**: Uses humor and playful roasts to engage followers
- **Visionary & Aspirational**: Inspires growth by sharing her journey and embracing change
- **Positive & Inclusive**: Encourages diverse audiences to express themselves
- **Creative & Stylish**: Showcases trends in digital fashion and NFT art

## 🛠 Technical Stack

### Blockchain Integration
- Ethereum Block Explorer API (for ERC-20 tokens)
- Solana Explorer API (for SPL tokens)
- Block timestamp data extraction
- Smart contract creation date parsing

### Astrological APIs
- AstrologyAPI: For birth chart calculations and daily horoscopes
- AstroSeek API: For planetary positions, aspects, and natal charts
- Custom Token Astrology Engine:
  - Maps blockchain timestamps to astrological events
  - Calculates planetary positions at token creation
  - Generates token compatibility metrics

### Digital Fashion & NFT APIs
- OpenSea API
- DressX API
- Foundation API

### Engagement Tools
- Twitter/X Polls
- TikTok Live Integration

## 🌟 Why Celest Matters

1. **Engaging & Relatable**: Humor, sass, and cosmic insights make Celest a standout digital personality
2. **Evolving Aesthetic**: Tracks her token's value and reflects it in her growth, fostering engagement
3. **Cultural Connection**: Combines astrology, crypto, and fashion to resonate across domains
4. **Positive Impact**: Promotes inclusivity and empowers her audience to grow alongside her

## 🌟 Community Collaboration

Celest's growth is directly tied to her community's involvement:
- Token-based decisions for aesthetic upgrades
- Community voting on NFT & fashion purchases
- Interactive live streams and Q&A sessions
- User-suggested art and fashion trends

## 🤝 Contributing

We welcome contributions from the community! Whether it's suggesting new features, reporting bugs, or improving documentation, please feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

[License details to be added]

## 🌟 Join the Cosmic Journey

Follow Celest on:
- Twitter/X: [@celestai_life](https://twitter.com/celestai_life)
- TikTok: [celestai.life](https://www.tiktok.com/@celestai.life)

Visit her website: [celestai.life](https://celestai.life)

---

*Celest: Where astrology meets AI, and sass meets style* ✨ 

---
# Tech starck: Eliza

### Celest characters

To load custom characters instead:
- Use `pnpm start --characters="path/to/your/character.json"`
- Multiple character files can be loaded simultaneously

### Add clients

```diff
- clients: [],
+ clients: ["twitter"],
```

## Duplicate the .env.example template

```bash
cp .env.example .env
```

\* Fill out the .env file with your own values.

### Add login credentials and keys to .env

```diff
-OPENROUTER_API_KEY=
+OPENROUTER_API_KEY="sk-xx-xx-xxx"
...
-TWITTER_USERNAME= # Account username
-TWITTER_PASSWORD= # Account password
-TWITTER_EMAIL= # Account email
+TWITTER_USERNAME="username"
+TWITTER_PASSWORD="password"
+TWITTER_EMAIL="your@email.com"
```

## Install dependencies and start your agent

```bash
pnpm i && pnpm start
```

