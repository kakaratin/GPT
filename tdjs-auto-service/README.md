<div align="center">

### TDJS-AUTO-SERVICE Control Plane

Mobile-first marketing site and orchestration console for provisioning TDJS virtual smartphones and VMOS clusters.

</div>

## Stack

- [Next.js 14 App Router](https://nextjs.org/docs/app)
- TypeScript + Tailwind CSS (glassmorphism theme tuned for OLED displays)
- Edge-optimised API route at `POST /api/orders` to relay activation requests while translating every provider response into English

## Local development

```bash
cd tdjs-auto-service
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) to explore the TDJS landing experience.

### Environment

The proxy endpoint does not require secrets. If you need to override headers or switch upstream providers, edit `app/api/orders/route.ts`.

## Deployment (Vercel)

1. Push this repository to GitHub/GitLab.
2. Create a new Vercel project.
3. When prompted, set **Framework** to `Next.js` and **Root Directory** to `tdjs-auto-service`.
4. Keep all default build settings (`npm install`, `npm run build`).
5. Once deployed, the marketing site and `/api/orders` serverless function will be live globally.

## Implementation notes

- All customer-facing copy omits mention of the upstream vendor so the experience reads as a TDJS native product.
- `components/order-form.tsx` renders the mobile-optimised onboarding form with loading states, success/error messaging, and collapsible execution detail logs.
- `app/api/orders/route.ts` performs validation, relays the activation payload, redacts sensitive fields, and translates any non-English strings using a curated dictionary + fallbacks.
- Tailwind utility classes are used directly for rapid iteration; adjust tokens in `app/globals.css` to retheme.

## QA checklist

- [ ] Submit a mock order with valid credentials to observe the full success path.
- [ ] Submit without credentials to confirm validation messaging.
- [ ] Temporarily disable upstream connectivity (e.g., change the endpoint) to confirm the control plane outage message is user friendly.
