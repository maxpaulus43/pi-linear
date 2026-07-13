const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISSUE_IDENTIFIER_PATTERN = /^([A-Za-z][A-Za-z0-9_]*)-([1-9]\d*)$/;

export type IssueReference =
    | { type: "uuid"; id: string }
    | { type: "identifier"; teamKey: string; number: number; identifier: string };

export function parseIssueReference(input: string): IssueReference {
    const value = input.trim();
    if (UUID_PATTERN.test(value)) return { type: "uuid", id: value };

    let identifier = value;
    try {
        const url = new URL(value);
        if (url.hostname === "linear.app" || url.hostname.endsWith(".linear.app")) {
            const match = url.pathname.match(/^\/[^/]+\/issue\/([^/]+)/i);
            if (match) identifier = match[1];
        }
    } catch {
        // The input is an identifier rather than a URL.
    }

    const match = identifier.match(ISSUE_IDENTIFIER_PATTERN);
    if (!match) {
        throw new Error(
            `Invalid Linear issue reference: ${input}. Use a UUID, identifier such as ENG-123, or Linear issue URL.`,
        );
    }
    return {
        type: "identifier",
        teamKey: match[1].toUpperCase(),
        number: Number(match[2]),
        identifier: `${match[1].toUpperCase()}-${match[2]}`,
    };
}
