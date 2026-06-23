# URL Shortener

A scalable URL shortening service with support for custom aliases, redirect management, and analytics.

Features
- Create short URLs and custom aliases
- Fast redirects with optimized lookup
- Basic analytics: click counts, referrers, timestamps
- Input validation and error handling
- Tech: Node.js, Express, MongoDB

Getting started
1. Clone the repo
2. Copy `.env.example` to `.env` and set MONGODB_URI and other variables
3. Install dependencies:
   npm install
4. Start in development:
   npm run dev
5. Build and run (production):
   npm run start

API (examples)
- POST /api/urls
  - Create a short URL. Body: { "longUrl": "...", "customAlias": "optional" }
- GET /:shortId
  - Redirects to the original URL and increments analytics
- GET /api/urls/:id
  - Retrieve metadata and analytics for a short URL

Suggested project structure
- package.json
- src/
  - server.js
  - routes/url.js
  - controllers/urlController.js
  - models/url.js
  - utils/validation.js
- config/
  - db.js
- tests/
- Dockerfile
- .github/workflows/ci.yml
- .env.example

Notes and next steps
- I can scaffold the Express app, Mongoose model, and sample routes with validation and basic tests.
- I can also add a Dockerfile and a GitHub Actions workflow that runs lint and tests.
- Let me know which files to create and whether to commit them on the default branch or a new branch (provide branch name).
