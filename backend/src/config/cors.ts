// Comma separated list, for example: https://my-dashboard.vercel.app
export const allowedOrigins = process.env.CORS_ORIGIN?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);