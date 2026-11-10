# EnglishDuo

English practice site with a members area (lessons, PDFs and chat) and an admin panel. Built for Vercel, with no dependencies.

- Site: `/`
- Admin: `/admin`

## Environment variables (Vercel)

| Name | What it is |
| --- | --- |
| `ADMIN_PASSWORD` | Admin panel password (min. 8 characters) |
| `SESSION_SECRET` | Long random string (min. 24 characters) |
| `CONTENT_KEY` | Key that decrypts questions, lessons and PDFs |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Created automatically when you connect Upstash Redis (Storage) |

## Security

Paid content (questions, lesson links and PDFs) is stored encrypted in the repository and is only released by the server to users with a valid key. Without `CONTENT_KEY`, no one can read it.

## Editing content

Put `content.json` and the PDFs in `private/` (this folder never goes to GitHub) and run `CONTENT_KEY=... npm run build:content`.

## Legal

Termos de Uso e Política de Privacidade (LGPD) ficam em `public/index.html`, na tela "Antes de começar", e precisam ser aceitos antes do uso. Se mudar o que o app coleta ou os provedores, atualize esse texto.
