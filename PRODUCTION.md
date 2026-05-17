# Production deployment checklist

## Required environment variables (backend)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Min. 32 random characters |
| `CLIENT_URL` | Yes | Frontend URL (no trailing slash) |
| `EMAIL_HOST` | Yes (prod) | SMTP host |
| `EMAIL_PORT` | Yes (prod) | SMTP port (e.g. `587`) |
| `EMAIL_USER` | Yes (prod) | SMTP username |
| `EMAIL_PASS` | Yes (prod) | SMTP password |
| `ADMIN_EMAILS` | Recommended | Comma-separated admin emails |
| `CLOUDINARY_*` | Optional | Image uploads |

## Frontend

Set `VITE_API_URL` to your API base including `/api`, e.g. `https://your-api.onrender.com/api`.

## Security features enabled

- Startup env validation (fail fast)
- CORS restricted to `CLIENT_URL` (+ dev origins locally)
- Stricter rate limits on auth routes
- JWT socket authentication (no impersonation via `join_room`)
- Email verification required before platform access
- No hardcoded demo/admin credentials
- Helmet, compression, production logging
- Health check at `/api/health` (used by Render)

## Before go-live

1. Copy `server/.env.example` → `server/.env` and fill values.
2. Never run `seed_accounts.js` in production.
3. Use MongoDB Atlas with IP allowlist and strong credentials.
4. Set `ADMIN_EMAILS` instead of manually editing roles when possible.
5. Run `cd server && npm test` before deploying.

## Render

Use the included `render.yaml` blueprint. Set all `sync: false` secrets in the Render dashboard.
