import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_EVENT_TYPES = new Set(["page_view", "checkout_clicked", "checkout_completed"]);

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function POST(request: NextRequest) {
  let body: { visitorId?: string; type?: string; path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { visitorId, type, path } = body;

  if (!visitorId || typeof visitorId !== "string" || visitorId.length > 100) {
    return NextResponse.json({ error: "Missing or invalid visitorId" }, { status: 400 });
  }
  if (!type || !ALLOWED_EVENT_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const country = decodeHeader(request.headers.get("x-vercel-ip-country"));
  const region = decodeHeader(request.headers.get("x-vercel-ip-country-region"));
  const city = decodeHeader(request.headers.get("x-vercel-ip-city"));
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");

  await prisma.visitor.upsert({
    where: { id: visitorId },
    update: {},
    create: { id: visitorId },
  });

  await prisma.event.create({
    data: {
      visitorId,
      type,
      path: typeof path === "string" ? path.slice(0, 500) : null,
      country,
      region,
      city,
      ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}
