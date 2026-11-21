JARVIS 2.0 — starter package

Files:
- index.html: futuristic phone-friendly dashboard
- server.js: example Node backend that can call OpenAI or Gemini
- package.json: backend dependencies
- .env.example: private-key placeholders

IMPORTANT
1. The dashboard alone does not connect to an AI model. It needs the backend deployed to an HTTPS address.
2. Never put API keys in index.html, screenshots, public repositories, or chat messages.
3. API usage may cost money. Check provider pricing and set usage limits.
4. The supplied server is a starter example, not a hardened production service. Add authentication, rate limiting, and a restricted ALLOWED_ORIGIN before public use.
5. Browser speech recognition and voice availability depend on Android browser support. This is not always-on background wake-word detection.

For a PC-free setup, use a trusted cloud coding/deployment service from your phone to host server.js. Do not paste private API keys into any public project or share them with anyone.
