# Yufa Deployment Notes

## Current Free Soft-Launch Stack

- Frontend: Vercel free tier
- Backend: Render free web service
- Database: MongoDB Atlas free tier
- Media: Cloudinary free tier
- Email: Resend free tier when enabled
- Payments: Stripe test/live later, transaction fees only

This setup is suitable for testing, owner review, and a soft launch. It is not the final recommended production setup for a real ecommerce launch.

## Upgrade Before Full Production Launch

Before taking real customer orders at scale, upgrade or review:

- Backend hosting: move from Render free to a paid always-on web service.
- Frontend hosting: use Vercel Pro if the site is being used commercially and needs stronger support/limits.
- Database: review MongoDB Atlas usage, backups, and upgrade from free tier if storage/traffic grows.
- Email: verify a sending domain in Resend and monitor deliverability.
- Payments: configure Stripe live mode, webhooks, order payment confirmation, and stock deduction.
- Domain/CORS: set backend `CLIENT_URL` to the live frontend domain only.
- Secrets: keep production `.env` values only in hosting dashboards, never in GitHub.
- Monitoring: add uptime/error monitoring before serious launch traffic.

## Production Reminder

Free tiers can sleep, throttle, suspend, or hit usage limits. For a real store, the first priority is upgrading the backend so customer-facing APIs and payment webhooks stay reliable.
