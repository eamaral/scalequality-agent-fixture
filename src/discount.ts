// Intentionally untested business logic (coverage gap for Code Health).
export function applyDiscount(price: number, pct: number): number {
    if (pct < 0 || pct > 100) throw new Error("pct must be between 0 and 100");
    return Math.round(price * (1 - pct / 100) * 100) / 100;
}

export function tier(total: number): "bronze" | "silver" | "gold" {
    if (total >= 1000) return "gold";
    if (total >= 90) return "silver";
    return "bronze";
}
