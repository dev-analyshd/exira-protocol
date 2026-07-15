---
name: EXIRA artifact system workaround
description: createArtifact fails at env-var step system-wide; services run via configureWorkflow instead
---

## Rule
`createArtifact()` consistently fails with `ARTIFACT_NOT_FOUND` when setting service env vars (PORT/BASE_PATH). The artifact gets Added then immediately Removed. This is a platform-level issue, not a slug or ID problem.

**Why:** The artifact env-var setting step uses the artifact ID to look up the registration, but the lookup fails before the registration is fully committed.

**How to apply:**
- Skip `createArtifact` for new web apps if this error recurs.
- Configure services directly with `configureWorkflow({ name, command: "PORT=XXXX BASE_PATH=/ pnpm --filter @workspace/slug run dev", waitForPort: XXXX, outputType: "webview" })`.
- For the API server (kind "api", not a supported createArtifact type), use `configureWorkflow` with `outputType: "console"`.
- The vite.config.ts scaffold requires both `PORT` and `BASE_PATH` env vars — inject them in the command string.
- Running workflows: "API Server" on port 8080, "EXIRA Dashboard" on port 23309.
- Source code lives in `artifacts/exira-app/src/` (not exira-dashboard — that slug is deregistered).
