# EnglishDuo

Site de questões de inglês com área de membros (aulas, PDFs e chat) e painel admin. Feito para a Vercel, sem dependências.

- Site: `/`
- Admin: `/admin`

## Variáveis de ambiente (Vercel)

| Nome | O que é |
| --- | --- |
| `ADMIN_PASSWORD` | Senha do painel admin (mín. 8 caracteres) |
| `SESSION_SECRET` | Texto aleatório longo (mín. 24 caracteres) |
| `CONTENT_KEY` | Chave que descriptografa questões, aulas e PDFs |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Criadas sozinhas ao conectar o Upstash Redis (Storage) |

## Segurança

O conteúdo pago (questões, links das aulas e PDFs) fica criptografado no repositório e só é liberado pelo servidor para quem tem chave válida. Sem `CONTENT_KEY` ninguém consegue ler.

## Editar conteúdo

Coloque `content.json` e os PDFs em `private/` (essa pasta nunca vai para o GitHub) e rode `CONTENT_KEY=... npm run build:content`.
