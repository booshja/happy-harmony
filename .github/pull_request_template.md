## Summary

- What changed and why?

### Ticket

JANDES-###: <ticket name here>

## Risks

- Where could this break or regress?

## Why this change is safe:

- What have you done to mitigate the risks?

## Validation

- Steps/commands:
- Logging/Sentry: no PII; minimal context; keep Sentry contexts/breadcrumbs redacted and minimal.
- Performance (Cloudflare Workers): avoid heavy/blocking work on request path; prefer async/queued work.

## Tests

- Ran:
- Not run (why):

## Notes

- Accessibility: consider focus/keyboard/ARIA for UI changes.
- Error handling: bubble to existing boundaries; avoid silent catches.
- Commit/merge message format: `<TICKET-123>: <Summary>`; include what changed + ticket reference.
