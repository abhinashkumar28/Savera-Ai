# Savera AI backend and voice assistant

The existing Express API also serves the Savera AI conversational assistant at `POST /api/chat`. The API key is read only by the backend from `backend/.env`; never add it to frontend environment variables or commit it.

## Requirements

- Node.js 20 or newer
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Setup

From the project root, install the existing frontend and backend dependencies:

```powershell
npm install
npm --prefix backend install
Copy-Item backend\.env.example backend\.env
npm --prefix backend run db:generate
```

Open `backend/.env` and replace the example `GEMINI_API_KEY` value with your key. Keep that file private; it is ignored by Git. The default model is `gemini-3.8-flash`, listed as a stable Flash model in the [official model catalog](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash). Change `GEMINI_MODEL` in `backend/.env` if you want to select another currently available model.

Run the frontend and backend in separate terminals from the project root:

```powershell
npm run dev
```

```powershell
npm run backend
```

The frontend is at `http://localhost:5173`; the backend is at `http://localhost:3001`. Vite proxies `/api` requests to the backend. The backend health endpoint is `http://localhost:3001/api/health`.

To run the backend without file watching, use `npm run backend:start` from the root (or `npm start` in `backend`).

## Chat endpoint

`POST /api/chat` accepts JSON in this shape:

```json
{
  "message": "Can you explain that in simple Hinglish?",
  "history": [
    { "role": "user", "content": "What is energy efficiency?" },
    { "role": "assistant", "content": "It means using less energy to do the same work." }
  ]
}
```

The `history` field is optional. Messages are limited to 4,000 characters, history to 12 messages, and the request body to 64 KB for this endpoint. Chat requests are limited to 20 per 15 minutes per client IP in addition to the API-wide limit. Replies are returned as `{ "reply": "..." }`. The backend uses the official Gemini Interactions API, sends the supplied history with each request, and sets `store: false` so conversation content is not persisted by the API. Each upstream call has a 30-second timeout and no automatic retries. If the configured model returns HTTP 503 due to temporary high demand, the backend makes one bounded attempt using `gemini-3.5-flash-lite`.

The browser assistant uses Web Speech API / SpeechRecognition when the browser supports it, and browser speech synthesis for spoken replies. Microphone permission, speech-recognition availability, and voices vary by browser, operating system, and configured system voices. Typing remains available if speech recognition is unavailable or denied.

## Checking Gemini quotas

Gemini API quotas are project- and model-specific and can change. Google does not guarantee a fixed free-tier quota for every project/model. Check the project's active limits in [Google AI Studio rate limits](https://aistudio.google.com/rate-limit?timeRange=last-28-days), and review [Google's rate-limit and usage-tier documentation](https://ai.google.dev/gemini-api/docs/rate-limits). The AI Studio dashboard shows the limits that currently apply to your project; a `429` response means a rate or quota limit was reached. Free-tier availability and pricing are described in [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing).
