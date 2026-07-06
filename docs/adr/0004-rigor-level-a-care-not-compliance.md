# Rigor Level A: HIPAA-grade care, not HIPAA compliance

Happy Harmony is mental-health-adjacent and stores user-entered activity content,
which we treat as sensitive by default. It is **not** a covered entity, integrates
with no health systems (e.g. no MyChart), and stores only categories and
activities. We adopt "Rigor Level A": apply HIPAA-grade _care_ as a design
principle while deliberately **not** pursuing formal HIPAA compliance (no BAAs,
audits, certifications, or audit-trail infrastructure), to avoid the legal and
operational burden that is inappropriate for a personal project. This is
consistent with `docs/privacy-and-guardrails-spec.md`, which already scopes
HIPAA/regulated-compliance claims out.

## Non-negotiables that survive at Level A

- **Per-user isolation** via the repository choke point (ADR 0003), continuously
  tested (ADR 0005).
- **No user content to third parties** — activity titles/notes/category names must
  never reach Sentry, analytics, or logs. Scrubbing must be true from the first
  slice that stores real data, not deferred to a later milestone.
- **Minimal, content-free operational logging** (route/function id, status,
  timing, request id — never payloads).

## Consequences

- If the project ever moved toward real multi-user PHI, this decision would be
  revisited — nothing here forecloses that, but it is explicitly out of scope now.
- Compliance-shaped work (BAAs, formal risk assessments, audit trails) does not
  belong in the backlog and should be trimmed if present.
