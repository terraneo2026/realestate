# Laravel MySQL to Firebase Firestore Mapping

## 1. Tables to Collections

| Laravel Table | Firestore Collection | Notes |
|---|---|---|
| `users` | `users` | Admin/Backend users |
| `customers` | `users` | Frontend users (merged into users collection) |
| `propertys` | `properties` | |
| `categories` | `categories` | |
| `settings` | `settings` | Use a single doc `settings/main` |
| `homepage_sections` | `homepage` | Use a single doc `homepage/main` |
| `chats` | `chats` | |
| `notifications` | `notifications` | |
| `sliders` | `sliders` | |
| `packages` | `packages` | |
| `articles` | `articles` | |

## 2. Structural Changes
- **No Joins**: In Firestore, instead of `category_id`, we may denormalize data or use separate lookups.
- **Roles**: Use a `role` field in the `users` document to distinguish between `admin`, `agent`, and `customer`.
- **FCM**: Use Firebase Cloud Messaging for notifications instead of a custom webhook sync.

## 3. Storage
- All images from Laravel's `public/storage` should move to Firebase Storage.
- Logos and UI assets should also move to Firebase Storage.

## 4. Authentication
- Replace Laravel Sanctum/JWT with Firebase Auth.
- Use Phone Auth (OTP) for users and Email/Password for Admin.
