/**
 * Validates required environment variables at startup.
 * Fails fast so misconfigured deploys do not run half-broken.
 */
const REQUIRED_ALWAYS = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];

const REQUIRED_PRODUCTION = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
];

function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing = [];

  for (const key of REQUIRED_ALWAYS) {
    if (!process.env[key]?.trim()) {
      missing.push(key);
    }
  }

  if (isProduction) {
    for (const key of REQUIRED_PRODUCTION) {
      if (!process.env[key]?.trim()) {
        missing.push(key);
      }
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      console.error('FATAL: JWT_SECRET must be at least 32 characters in production.');
      process.exit(1);
    }
  }

  if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    console.error('Copy server/.env.example to server/.env and fill in values.');
    process.exit(1);
  }

  if (!isProduction && !process.env.EMAIL_HOST) {
    console.warn('WARN: Email not configured — verification/reset emails will be skipped in development.');
  }
}

function getAllowedOrigins() {
  const origins = new Set();
  const clientUrl = process.env.CLIENT_URL?.trim();
  if (clientUrl) origins.add(clientUrl.replace(/\/$/, ''));

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:5180');
    origins.add('http://127.0.0.1:5180');
    origins.add('http://localhost:5173');
    origins.add('http://127.0.0.1:5173');
  }

  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
  extra.forEach((o) => origins.add(o));

  return [...origins];
}

module.exports = { validateEnv, getAllowedOrigins };
