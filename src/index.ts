import { applyDiscount, tier } from "./discount";

export function checkout(price: number, discountPct: number) {
    const final = applyDiscount(price, discountPct);
    return { final, tier: tier(final) };
}
