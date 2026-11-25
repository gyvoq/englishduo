# EnglishDuo

English practice site with a members area (lessons, PDFs and chat) and an admin panel. Built for Vercel, with no dependencies.

- Site: `/`
- Admin: `/admin`
- Post-purchase page (customer gets their key): `/obrigado`
- Standalone quizzes: `/K7M2Q` (Aula 1 · Inglês para Comissários), `/R4T8L` (Inglês para viajar a Londres), `/G5B4V` (Aula 3 · London, here we come!)

## Environment variables (Vercel)

| Name | What it is |
| --- | --- |
| `ADMIN_PASSWORD` | Admin panel password (min. 8 characters) |
| `SESSION_SECRET` | Long random string (min. 24 characters) |
| `CONTENT_KEY` | Key that decrypts questions, lessons and PDFs |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Created automatically when you connect Upstash Redis (Storage) |
| `CAKTO_WEBHOOK_SECRET` | Secret configured in the Cakto webhook. Without it, purchases don't generate keys |
| `KEY_MONTHS` | Optional. Validity of keys created by purchases: `1`, `3`, `6` or `12` (default `12`) |
| `KEY_DEVICES` | Optional. Devices allowed per purchased key, 1–10 (default `1`) |

## Sales (Cakto)

Point the Cakto webhook to `https://<your-domain>/api/cakto` with the same secret as `CAKTO_WEBHOOK_SECRET`.

- `purchase_approved`: creates one key per order (duplicate webhooks don't create a second key).
- `refund` / `chargeback`: revokes the key for that order.
- Set `/obrigado` as the Cakto thank-you page. The customer types the e-mail and CPF used in the purchase and gets the key, with a button that opens the site with the key filled in (`/?chave=...`). Pix and boleto only work after the payment clears.

Keys can still be created, revoked and reset by hand in `/admin`.

## Visitors and members

- Without a key: free questions, lesson names and a preview of the first 3 lessons.
- With a key: all lessons, PDFs, chat and progress saved on the server.

## Devices per key

Each key has a device limit. On login, the device is recognized by:

1. the same browser as before (cookie);
2. another browser on the same device: same hardware (system, screen, time zone, GPU, cores) **and** a network where that device was seen in the last 45 days;
3. otherwise it counts as a new device.

If the limit is reached, the login is blocked. In `/admin`, "reset" clears the devices of a key.

## Access log

Each key keeps a log of logins, logouts, blocked attempts, revocations and resets (date, IP, browser, device), with the last 300 entries, for about 6 months (Marco Civil da Internet, art. 15). View it in `/admin` to spot shared keys. Deleting a key also deletes its log.

## Security

Paid content (questions, lesson links and PDFs) is stored encrypted in the repository and is only released by the server to users with a valid key. Without `CONTENT_KEY`, no one can read it.

## Editing content

Put `content.json` and the PDFs in `private/` (this folder never goes to GitHub) and run `CONTENT_KEY=... npm run build:content`.

## Legal

Termos de Uso e Política de Privacidade (LGPD) ficam em `public/index.html`, na tela "Antes de começar", e precisam ser aceitos antes do uso. Se mudar o que o app coleta ou os provedores, atualize esse texto.

Hoje o app coleta: nome, chave, identificador e características do aparelho, rede aproximada, progresso, mensagens do chat, IP e registro de acessos. Na compra pela Cakto, também guarda o e-mail e um hash de e-mail + CPF, usado para o cliente recuperar a chave em `/obrigado`. A seção "Pagamento" dos Termos ainda diz que a chave chega por e-mail e precisa ser ajustada para esse fluxo.
