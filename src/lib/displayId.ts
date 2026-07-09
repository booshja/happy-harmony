// Opaque External Identity (CONTEXT.md): every user-owned row exposes an opaque
// `displayId` as its sole external identity, while the internal autoincrement
// integer `id` never crosses the repository interface. The displayId is minted on
// create and must be unguessable — it is defense-in-depth / enumeration-prevention,
// NOT the authorization boundary (that is `WHERE userId = caller`, per ADR-0003).
export function generateDisplayId(): string {
    return crypto.randomUUID();
}
