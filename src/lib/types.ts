export type ZodiacSignId =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export interface ZodiacInfo {
  id: ZodiacSignId;
  name: string;
  symbol: string;
  dateRange: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  rulingPlanet: string;
  traits: string[];
}

export interface Gemstone {
  id: string;
  name: string;
  color: string;
  hex: string;
  chakra: string;
  properties: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  gemstoneIds: string[];
  zodiacSignIds: ZodiacSignId[];
  beadSizeMm: number;
  stock: number;
  featured?: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  placedAt: string;
  lines: CartLine[];
  customer: CustomerInfo;
  subtotal: number;
  shipping: number;
  total: number;
}
