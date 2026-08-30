import { CartLine, CustomerInfo, Order } from "@/lib/types";

const ORDER_STORAGE_KEY = "gemstore-last-order";

export function createOrderId(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CS-${random}`;
}

export function saveLastOrder(order: Order) {
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function readLastOrder(): Order | null {
  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

export function buildOrder(
  lines: CartLine[],
  customer: CustomerInfo,
  subtotal: number,
  shipping: number
): Order {
  return {
    id: createOrderId(),
    placedAt: new Date().toISOString(),
    lines,
    customer,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
