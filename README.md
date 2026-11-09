# EnglishDuo

A mobile-first English quiz app with explanations in Portuguese. Try a free sample, then unlock the full question bank and recorded lessons.

## Features

- 18 modules: grammar, vocabulary, skills and exams (IELTS/TOEFL, Cambridge)
- Instant feedback with a Portuguese explanation for every answer
- Text-to-speech for questions (Web Speech API)
- Free trial of 30 questions across 8 modules
- Progress tracking per module, saved in the browser
- Recorded course overview with a link to the lessons
- Terms and privacy consent on first visit

## Stack

A single `index.html` file. Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no backend.

## Run

Open `index.html` in a browser, or serve it with any static host (e.g. Vercel, Netlify, GitHub Pages).

## Configuration

Edit the `CONFIG` object at the top of the script:

| Key | Description |
|---|---|
| `checkoutUrl` | Payment page URL (Cakto) |
| `free` | Free questions per module |
| `videoUrl` | Link to the recorded lessons |
| `perPage` | Questions per page |

## Access codes

Codes are validated client-side by comparing a SHA-256 hash of the normalized code against the `HASHES` list. Unlock via the "Access" tab, or with a `?codigo=YOUR-CODE` URL parameter.

> This is client-side only, so it is not tamper-proof. Use a server-side check if you need real protection.

## Data

Progress, access and terms acceptance are stored in `localStorage` (`ep.progress`, `ep.access`, `ep.terms`). Nothing is sent to a server.
