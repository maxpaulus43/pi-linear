export function issueFilter({
    assigneeEmail,
    team,
    state,
    project,
    label,
    priority,
}: {
    assigneeEmail?: string;
    team?: string;
    state?: string;
    project?: string;
    label?: string;
    priority?: number;
}) {
    return {
        ...(assigneeEmail
            ? { assignee: { email: { eq: assigneeEmail } } }
            : {}),
        ...(team ? { team: { key: { eq: team } } } : {}),
        ...(state ? { state: { name: { eq: state } } } : {}),
        ...(project ? { project: { name: { eq: project } } } : {}),
        ...(label ? { labels: { some: { name: { eq: label } } } } : {}),
        ...(priority === undefined ? {} : { priority: { eq: priority } }),
    };
}
