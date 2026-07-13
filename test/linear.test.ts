import assert from "node:assert/strict";
import test from "node:test";
import { authorizationUrl, createCodeChallenge, isLocalRedirectUri } from "../extensions/oauth.ts";
import { parseIssueReference } from "../extensions/issue-reference.ts";

test("only accepts local HTTP OAuth redirect URIs", () => {
  assert.equal(isLocalRedirectUri("http://localhost:3000/oauth/callback"), true);
  assert.equal(isLocalRedirectUri("http://127.0.0.1:3000/oauth/callback"), true);
  assert.equal(isLocalRedirectUri("https://localhost:3000/oauth/callback"), false);
  assert.equal(isLocalRedirectUri("http://example.com/oauth/callback"), false);
});

test("parses Linear issue identifiers and URLs", () => {
  assert.deepEqual(parseIssueReference("CLINE-2368"), {
    type: "identifier",
    teamKey: "CLINE",
    number: 2368,
    identifier: "CLINE-2368",
  });
  assert.deepEqual(
    parseIssueReference("https://linear.app/cline-bot/issue/CLINE-2368/api-error-codex"),
    {
      type: "identifier",
      teamKey: "CLINE",
      number: 2368,
      identifier: "CLINE-2368",
    },
  );
  assert.throws(() => parseIssueReference("api error codex"), /Invalid Linear issue reference/);
});

test("creates a PKCE authorization URL", () => {
  const url = new URL(authorizationUrl({
    clientId: "client-id",
    redirectUri: "http://localhost:3000/oauth/callback",
  }, "state-value", "verifier-value"));

  assert.equal(url.origin, "https://linear.app");
  assert.equal(url.pathname, "/oauth/authorize");
  assert.equal(url.searchParams.get("client_id"), "client-id");
  assert.equal(url.searchParams.get("redirect_uri"), "http://localhost:3000/oauth/callback");
  assert.equal(url.searchParams.get("state"), "state-value");
  assert.equal(url.searchParams.get("scope"), "read,write");
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.equal(url.searchParams.get("code_challenge"), createCodeChallenge("verifier-value"));
});
