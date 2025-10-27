import { GoogleAuth } from "google-auth-library";

export async function getAuthToken(): Promise<string> {
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  const client = await auth.getClient();
  return await client.getAccessToken() as string;
}
