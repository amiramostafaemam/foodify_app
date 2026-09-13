# check-email (Appwrite Function)

Lets the app ask "does an account with this email exist?" before sending a
password-recovery link, without exposing a privileged API key in the
mobile app itself.

## Deploy

1. Appwrite Console → your project → **Functions** → **Create function**.
2. Runtime: **Node.js** (latest LTS offered, e.g. 22.x).
3. Give it any name (e.g. "check-email") and create it.
4. On the function's **Settings** tab:
   - **Entrypoint**: `src/main.js`
   - **Execute access**: `Any` (this function only reveals a yes/no, not
     any account data, so it's safe to let anyone call it — that's the
     whole point of doing the check server-side).
   - Scroll to **API credentials** and tick `users.read`. This is what
     lets the function list users server-side; without it the function
     will get a permission error on every call.
5. On the **Deployments** tab, create a deployment: upload this whole
   `check-email` folder (or connect it via Git and point Appwrite at
   this folder) and activate it.
6. Copy the Function ID (shown at the top of the function's page) into
   the app's `.env` as `EXPO_PUBLIC_APPWRITE_FUNCTION_CHECK_EMAIL_ID`.
