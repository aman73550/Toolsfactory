<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1c7d40e1-375d-4ef8-bd95-79c4e310d14d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy on Vercel

This project is now configured for Vercel with:

1. Static Vite output from `dist`
2. Serverless API handler at `api/[...route].ts` for all `/api/*` routes
3. SPA fallback routing via `vercel.json`

### Steps

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Set Environment Variable: `GEMINI_API_KEY`
4. Deploy.

Notes:

- The `/api/generate-tool` endpoint writes files into the repo and is disabled on Vercel (read-only runtime filesystem).
- All other existing `/api/*` endpoints are available through the serverless function.
