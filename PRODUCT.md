# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** A double-sided local marketplace — buyers who discover, compare, and order products online, and local vendors who publish listings, manage sales, and build trust on the platform.

**Secondary audiences:**
- **Admins** — moderate users, validate seller KYC, manage catalog and platform operations.
- **Guests** — browse the public catalog before registering.

Default geography centers on **RD Congo** (users default to `country: RD Congo`; products default to `city: Goma`), with market zones such as Virunga, Birere, Centre-Ville, Himbi, Katindo, Kinshasa, Lubumbashi, and Bukavu.

## Product Purpose

WapiBei is a trusted online marketplace for Africa. It lets local buyers find agricultural, high-tech, fashion, and everyday goods from verified vendors, while giving sellers a modern storefront, order workflow, and reputation tools (TrustScore, KYC, reviews).

Success means reliable discovery-to-checkout flows for buyers, sustainable selling tools for vendors, and enforceable trust/safety guardrails across the platform.

## Positioning

A marketplace built for **local African commerce** — not a generic global clone — combining multilingual UX (French, English, Swahili), province/commune addressing, local market zones, seller verification (KYC + TrustScore), and integrated notifications (email, WhatsApp, web push) in one product stack.

## Operating Context

- **Monorepo layout:** `backend/` (NestJS API + Prisma/PostgreSQL) and `frontend/` (Next.js App Router).
- **Local dev:** `pnpm dev` runs both; frontend at `http://localhost:3000`, API at `http://localhost:4000/api`.
- **Roles:** `CLIENT`, `VENDOR`, `ADMIN`.
- **Seller onboarding:** vendors require KYC approval before full selling capabilities.
- **Content safety:** text and image moderation (bad-words, NSFW/Sightengine) on user-generated content.
- **Notifications:** transactional email (Brevo/SMTP), optional WhatsApp and web push.

## Capabilities and Constraints

**Confirmed capabilities**
- Auth: register, login, OTP verification, password reset, JWT access + refresh tokens.
- Catalog: categories, multilingual product fields (fr/en/sw), images, stock, sales pricing.
- Commerce: cart, orders, addresses, seller dashboard, analytics.
- Social/trust: follows, TrustScore, seller profiles, testimonials on marketing surfaces.
- Admin: user/vendor/product management, reports, notifications.
- i18n: French (default), English, Swahili.

**Technical constraints**
- PostgreSQL required (`DATABASE_URL`); backend refuses to start without it.
- Frontend consumes API via `NEXT_PUBLIC_API_URL`.
- Package manager: pnpm (workspace).

**Open / undecided**
- Production deployment targets and hosting topology not recorded in repo docs.
- Payment provider integration details not confirmed in product docs (payment claims in marketing copy should be verified before external use).

## Brand Commitments

- **Name:** WapiBei / WapiBei Market / WapiBei MarketPlace (used across UI, metadata, and email templates).
- **Public positioning line (from site metadata):** “Marketplace N°1 en Afrique” — treat as marketing copy until independently verified.
- **Accent color in UI:** `#E67E22` (orange); secondary green `#2D5A27` appears in marketing sections.
- **Domain referenced in metadata:** `https://wapibei.com`
- **Support contact in emails:** `support@wapibei.com`

## Evidence on Hand

- Runnable monorepo with README setup instructions (`README.md`, `frontend/README.md`, `backend/README.md`).
- Database schema and seed data (`backend/prisma/`).
- Marketing/home surfaces with hero, categories, featured stores, testimonials (`frontend/src/features/home/`).
- Admin dashboard (`frontend/src/app/admin/`, `frontend/src/features/admin-dashboard/`).
- Email HTML templates embedded in backend (`backend/src/common/email/email.service.ts`).

**Do not fabricate:** customer counts, revenue benchmarks, press mentions, or “#1 in Africa” proof unless provided by the product owner.

## Product Principles

1. **Local first** — design flows around Congolese/East African addressing, languages, and market zones, not generic Western e-commerce defaults.
2. **Trust by design** — verification, moderation, and visible seller reputation are product features, not afterthoughts.
3. **Two-sided clarity** — buyer and vendor journeys stay distinct but coherent under one brand.
4. **Multilingual parity** — fr/en/sw are first-class; default language is French.
5. **Ship real operations** — admin moderation, notifications, and order lifecycle must stay production-viable alongside the storefront.

## Accessibility & Inclusion

- Trilingual interface (fr, en, sw); no additional accessibility standard recorded yet.
- Image/text moderation protects users from inappropriate UGC; exact WCAG target not established.
