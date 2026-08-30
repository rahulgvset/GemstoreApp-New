import { prisma } from "@/lib/prisma";
import { getISTDayRangeUTC, istDateKey } from "@/lib/timezone";

export const MAX_HISTORY_DAYS = 10;

export interface VisitEventRow {
  id: string;
  visitorId: string;
  path: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  createdAt: Date;
}

export async function getPageViewEvents(daysBack: number = MAX_HISTORY_DAYS): Promise<VisitEventRow[]> {
  const clampedDays = Math.min(daysBack, MAX_HISTORY_DAYS);
  const { startUTC } = getISTDayRangeUTC(clampedDays - 1);

  const events = await prisma.event.findMany({
    where: { type: "page_view", createdAt: { gte: startUTC } },
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true,
      visitorId: true,
      path: true,
      country: true,
      region: true,
      city: true,
      createdAt: true,
    },
  });

  return events;
}

export interface DailyFunnel {
  date: string;
  clicked: number;
  completed: number;
}

export interface AbandonedCheckout {
  visitorId: string;
  clickedAt: Date;
  country: string | null;
  city: string | null;
}

export interface CheckoutFunnelResult {
  daily: DailyFunnel[];
  abandonedSessions: AbandonedCheckout[];
  totalClicked: number;
  totalCompleted: number;
}

export async function getCheckoutFunnel(daysBack: number = MAX_HISTORY_DAYS): Promise<CheckoutFunnelResult> {
  const clampedDays = Math.min(daysBack, MAX_HISTORY_DAYS);
  const { startUTC } = getISTDayRangeUTC(clampedDays - 1);

  const events = await prisma.event.findMany({
    where: {
      type: { in: ["checkout_clicked", "checkout_completed"] },
      createdAt: { gte: startUTC },
    },
    orderBy: { createdAt: "asc" },
    select: {
      visitorId: true,
      type: true,
      country: true,
      city: true,
      createdAt: true,
    },
  });

  const dailyMap = new Map<string, DailyFunnel>();
  for (let i = clampedDays - 1; i >= 0; i--) {
    const { label } = getISTDayRangeUTC(i);
    dailyMap.set(label, { date: label, clicked: 0, completed: 0 });
  }

  const completedByVisitor = new Map<string, Date[]>();
  for (const event of events) {
    if (event.type === "checkout_completed") {
      const list = completedByVisitor.get(event.visitorId) ?? [];
      list.push(event.createdAt);
      completedByVisitor.set(event.visitorId, list);
    }
  }

  const abandonedSessions: AbandonedCheckout[] = [];
  let totalClicked = 0;
  let totalCompleted = 0;

  for (const event of events) {
    const dayKey = istDateKey(event.createdAt);
    const bucket = dailyMap.get(dayKey);

    if (event.type === "checkout_clicked") {
      totalClicked += 1;
      if (bucket) bucket.clicked += 1;

      const completions = completedByVisitor.get(event.visitorId) ?? [];
      const hasCompletionAfter = completions.some((t) => t >= event.createdAt);
      if (!hasCompletionAfter) {
        abandonedSessions.push({
          visitorId: event.visitorId,
          clickedAt: event.createdAt,
          country: event.country,
          city: event.city,
        });
      }
    } else if (event.type === "checkout_completed") {
      totalCompleted += 1;
      if (bucket) bucket.completed += 1;
    }
  }

  abandonedSessions.sort((a, b) => b.clickedAt.getTime() - a.clickedAt.getTime());

  return {
    daily: Array.from(dailyMap.values()),
    abandonedSessions,
    totalClicked,
    totalCompleted,
  };
}
