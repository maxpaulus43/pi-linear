import { createHash, randomBytes } from "node:crypto";

export interface OAuthSettings {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
}

export function isLocalRedirectUri(redirectUri: string): boolean {
  try {
    const url = new URL(redirectUri);
    return url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]");
  } catch {
    return false;
  }
}

export function createCodeVerifier(): string {
  return randomBytes(48).toString("base64url");
}

export function createCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function authorizationUrl(settings: OAuthSettings, state: string, verifier: string): string {
  const url = new URL("https://linear.app/oauth/authorize");
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: settings.clientId,
    redirect_uri: settings.redirectUri,
    state,
    scope: "read,write",
    code_challenge: createCodeChallenge(verifier),
    code_challenge_method: "S256",
  }).toString();
  return url.toString();
}
