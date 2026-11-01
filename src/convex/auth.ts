// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import Google from "@auth/core/providers/google";
import { emailOtp } from "./auth/emailOtp";


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  // `Google` is Auth.js's built-in provider (Convex Auth materializes it and
  // fills client credentials from the AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
  // environment variables). The OAuth callback rides on
  // `auth.addHttpRoutes(http)` in convex/http.ts: /api/auth/callback/google.
  providers: [emailOtp, Anonymous, Google],
});