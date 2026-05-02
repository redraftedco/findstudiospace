<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FindStudioSpace Operating Rules

## Default posture

Move the project toward revenue with the smallest safe diff. Prefer direct execution over discussion when the user gives a clear directive. If a requirement is genuinely ambiguous, ask one specific question and stop.

The user is a first-time web developer. Final reports should use short, plain-language bullets and explain the practical "ABC" of what changed without jargon.

## Code efficiency

- Read surrounding files before editing.
- Match existing naming, folder structure, data-fetching, validation, error handling, and UI patterns.
- Use the smallest implementation that fully satisfies the requirement.
- Do not add dependencies unless the user approves after a one-sentence justification and install command.
- Avoid speculative abstractions, parallel systems, duplicate helpers, oversized components, and broad refactors.
- Keep functions and components focused. Separate display logic from business logic when it makes the code easier to maintain.
- Select only fields the UI or downstream logic uses. Avoid unbounded queries, N+1 calls, repeated network requests, and large payloads.
- Use maps, sets, keyed objects, or shared constants when they reduce repeated searching or matching.
- Remove dead code, unused imports, unreachable branches, temporary logs, and abandoned comments in files you touch.
- Preserve correctness before optimization. Faster code is not acceptable if it becomes fragile or obscure.

## Scope discipline

- One task at a time.
- Do not rewrite unrelated parts of the codebase.
- Do not fix unrelated bugs discovered mid-task. Report them as follow-up unless they block the requested work.
- Stop and re-plan if a scoped task would require more than five touched files, missing env vars, missing tables, auth failures, unclear Supabase/Stripe errors, or a failing verification that cannot be fixed in two small edits.

## Planning and review

For non-trivial or security-sensitive tasks, produce a short plan before editing:

- What will change.
- Files to touch.
- Files explicitly not touched.
- New files or migrations.
- Verification command(s).
- Open question, if any.

For visible UI changes, summarize the JSX/visual result before shipping when practical.

## Security gate

Before auth, webhook, RLS, or DB-write changes, run a SECURITY PRE-CHECK:

- Env vars touched, listed by name only.
- Whether each secret is server-only.
- Whether a Supabase service role key is used, and confirmation it stays in server code only.
- New DB table/column and required RLS policy, if any.
- External input being validated before DB access.
- Attack surface opened and how the code prevents it.
- Stripe webhook changes must verify signatures with `stripe.webhooks.constructEvent` and `STRIPE_WEBHOOK_SECRET`.

Never print API keys, auth tokens, webhook secrets, service role keys, or private env values in chat, commits, logs, or GitHub.

## Git hygiene

- Check `git status` before edits.
- Work on the current branch unless the user asks for a branch.
- Stage only files intentionally touched for the task.
- Never force-push.
- Never push without explicit user instruction.

## Verification

Claims of "done" need command/query evidence, not inference.

Use the repo's package manager/scripts. On this Windows setup, prefer `npm.cmd run ...` if PowerShell blocks `npm.ps1`.

Before finalizing code work, run relevant checks. For broad app changes, run:

- `npm.cmd run lint`
- `npm.cmd run build`

If a check fails from a pre-existing issue, report it separately and do not hide it.

## SEO and copy

For public indexable pages:

- Put the primary keyword within the first 60 characters of title tags. Brand goes last.
- Use one H1 per page. Headings are structural, not decorative.
- Listing image alt text should follow: `{studio name} {space type} studio in {neighborhood} Portland`. Decorative images use `alt=""`.
- Detail pages should link to parent category and geographic hub when practical.
- Do not batch-apply meta descriptions to more than 10 pages without sample review.

Voice rules:

- Write like a working creative talking to another working creative.
- Use specific inventory facts over vague claims.
- Banned marketing words: "solutions", "leverage", "empower", "seamless", "unlock", "streamline", "best-in-class", "premium experience", "world-class".
- Show known prices. If missing, use "Price on request" with a visible inquiry path.
- Use real social proof only. If there is no verified proof, omit it.
- Lead with neighborhood when available; fall back to city only when needed.

## External facts and costs

Current or changing external facts need a source read in the current session, or must be labeled as not verified this session.

Any task that calls a paid external API must include a rough cost estimate before execution. If the estimate is over $5 per run, get explicit approval first.

## Revenue priority

When choosing between valid approaches, pick the one with the fewest user decisions, lowest blast radius, easiest rollback, and closest path to revenue.

Revenue-moving work, in order:

1. Sending cold email.
2. Verifying payment flow.
3. Cleaning outreach data.
4. Fixing bugs that block the above.

Everything else should be treated as deferrable unless the user explicitly prioritizes it.
