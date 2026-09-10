# 🍔 Foodify

A cross‑platform food‑ordering app built with **Expo (React Native)**, **Expo Router**, **NativeWind**, **Zustand**, **Appwrite**, and **Stripe**.

Browse a menu, customise items with toppings and sides, manage a cart, and check out with a real Stripe payment sheet or cash on delivery.

> ⚠️ This is a portfolio project. It talks to a self‑hosted / Appwrite Cloud backend that you provision yourself (see **Backend setup** below).

---

## ✨ Features

| Area              | What it does                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| **Onboarding**    | 3‑slide intro, shown once (persisted in `AsyncStorage`)                                           |
| **Auth**          | Email/password sign‑up & sign‑in via Appwrite, animated success / error states                    |
| **Menu & Search** | Server‑side search + category filter, two‑column grid                                             |
| **Item details**  | Calories/protein, rating, selectable toppings & sides with live price                             |
| **Offers**        | Promo bundles with autoplaying muted video, discount breakdown                                    |
| **Cart**          | Add / remove / change quantity, persisted across app restarts                                     |
| **Checkout**      | Stripe Payment Sheet (via a serverless function) **or** cash on delivery; order saved to Appwrite |
| **Profile**       | View & edit name, phone, home/work address; logout confirmation                                   |

---

## 🧱 Tech stack

- **Expo SDK 54**, React Native 0.81, new architecture + React Compiler
- **Expo Router v6** — file‑based routing, typed routes
- **NativeWind v4** (Tailwind for RN) for styling
- **Zustand** for auth & cart state (cart uses the `persist` middleware)
- **Appwrite** (`react-native-appwrite`) — auth, database, storage, functions
- **Stripe** (`@stripe/stripe-react-native`) — Payment Sheet
- **TypeScript** (strict), ESLint (`eslint-config-expo`), Prettier

---

## 📂 Project structure

```
app/                    # Expo Router routes
  (onboarding)/         # first‑run intro
  (auth)/               # sign‑in / sign‑up (+ shared layout)
  (tabs)/               # Home, Search, Cart, Profile
  details/[id].tsx      # menu item details
  offer-details/[id].tsx
  edit-profile.tsx
components/              # reusable UI (Button, Input, Cards, Modals…)
constants/              # image map, offers data, onboarding slides
lib/                    # appwrite client, data hooks, payment service, seed
store/                  # zustand stores (auth, cart)
type.d.ts               # shared types
```

---

## 🚀 Getting started

### 1. Prerequisites

- Node 18+
- An [Appwrite](https://appwrite.io) project (Cloud or self‑hosted)
- A [Stripe](https://stripe.com) account (test mode is fine)
- For payments you need a **development build** (Stripe’s native module does not
  run in Expo Go). The rest of the app works in Expo Go.

### 2. Install

```bash
npm install
```

### 3. Environment variables

```bash
cp .env.example .env
```

Then fill in `.env`. Every value and where to find it is documented inside
`.env.example`. Nothing secret goes in this file — the Stripe **secret** key
lives only in the Appwrite function (step 5).

### 4. Backend setup (Appwrite)

Create one **Database** and the following **collections** (IDs must match
`lib/appwrite.ts`). Give `users` document‑level permissions; the rest can be
read by any authenticated user.

| Collection ID         | Attributes                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`                | `name`, `email`, `avatar`, `accountId`, `phone?`, `address_home?`, `address_work?`                                                                                                                                  |
| `categories`          | `name`, `description`                                                                                                                                                                                               |
| `menu`                | `name`, `description`, `image_url`, `price` (float), `rating` (float), `calories` (int), `protein` (int), `categories` (relation → `categories`)                                                                    |
| `customizations`      | `name`, `price` (float), `type` (enum: `topping`, `side`)                                                                                                                                                           |
| `menu_customizations` | `menu` (relation → `menu`), `customization` (relation → `customizations`), `customization_name`, `customization_price` (float), `customization_type`                                                                |
| `orders`              | `userId`, `items` (string, JSON), `totalAmount`, `deliveryFee`, `discount`, `finalAmount`, `paymentIntentId`, `paymentStatus`, `orderStatus`, `deliveryAddress?`, `customerName`, `customerEmail`, `customerPhone?` |

Also create a **Storage bucket** and register an **Android/iOS platform** whose
bundle id matches `app.json` (`com.foodify.app`).

**Seed sample data:** temporarily call the seeder once — in `app/_layout.tsx`
add `import seed from "@/lib/seed";` and run `seed()` inside a `useEffect`, open
the app once, then remove it. Menu data lives in `lib/data.ts`.

### 5. Stripe payment function (Appwrite Functions)

Payments never expose the Stripe secret to the client. Create an Appwrite
Function (Node) that:

1. reads `{ amount, currency, customerEmail, customerName }` from the request body,
2. creates a Stripe `PaymentIntent` with your **secret** key (set as a function
   env var, e.g. `STRIPE_SECRET_KEY`),
3. returns `{ success: true, clientSecret, paymentIntentId }`.

Put its Function ID in `EXPO_PUBLIC_APPWRITE_FUNCTION_PAYMENT_ID`.

### 6. Run

```bash
npm run start:go          # Expo Go — everything works except real card payments
```

Card payments (`@stripe/stripe-react-native`) need a **development build**, since
Stripe's native module is not in Expo Go:

```bash
# set EXPO_PUBLIC_ENABLE_STRIPE=true in .env, re-add the
# "@stripe/stripe-react-native" config plugin to app.json, then:
npx expo run:android      # or: eas build --profile development
```

With `EXPO_PUBLIC_ENABLE_STRIPE` unset/false, Metro swaps Stripe for a stub
(`lib/stripe-stub.tsx`) and checkout falls back to cash on delivery.

---

## 📜 Scripts

| Script                    | Purpose                              |
| ------------------------- | ------------------------------------ |
| `npm run start:go`        | Expo dev server, forced Expo Go mode |
| `npm start`               | Expo dev server (dev-client mode)    |
| `npm run android` / `ios` | build & run a native dev client      |
| `npm run lint`            | ESLint                               |
| `npm run typecheck`       | `tsc --noEmit`                       |
| `npm run format`          | Prettier write                       |

---

## 🗺️ Roadmap

- [ ] Order history screen (backend + `getUserOrders` already exist)
- [ ] Pull‑to‑refresh & skeleton loaders
- [ ] Unit tests for the cart store, component tests with RNTL
- [ ] Dark mode (tokens are half‑wired already)
- [ ] Accessibility pass (labels / roles)
