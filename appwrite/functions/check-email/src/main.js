// Appwrite Function: check-email
//
// Tells the client whether an email address already has an account,
// *without* letting the client query the users list directly — the users
// list requires a privileged key, which must never live in the mobile app
// bundle. This function runs server-side instead, using the API key
// Appwrite injects into every function execution (scoped to whatever
// permissions are ticked in this function's Settings > "API credentials"
// tab in the console — that function needs "users.read").
//
// Request body: { "email": "someone@example.com" }
// Response:     { "exists": true } / { "exists": false }
import { Client, Query, Users } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  let email;
  try {
    email = JSON.parse(req.bodyText || "{}").email;
  } catch {
    return res.json({ error: "Invalid request body" }, 400);
  }

  if (!email || typeof email !== "string") {
    return res.json({ error: "email is required" }, 400);
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers["x-appwrite-key"] ?? "");

  const users = new Users(client);

  try {
    const result = await users.list([
      Query.equal("email", email.toLowerCase().trim()),
      Query.limit(1),
    ]);
    return res.json({ exists: result.total > 0 });
  } catch (err) {
    error(err.message);
    return res.json({ error: "Failed to check email" }, 500);
  }
};
