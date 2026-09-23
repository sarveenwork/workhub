"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { Badge, Button, Card, LoadingState } from "@/src/components/ui";
import { NOTIFICATION_CATEGORY_LABELS } from "@/src/lib/constants";
import { formatDateTime } from "@/src/lib/format";
import { notificationService } from "@/src/services";
import type { Notification } from "@/src/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const list = await notificationService.list();
    setItems(list);
  }

  useEffect(() => {
    let cancelled = false;
    void notificationService.list().then((list) => {
      if (cancelled) return;
      setItems(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function markRead(id: string) {
    await notificationService.markRead(id);
    await refresh();
  }

  async function markAll() {
    await notificationService.markAllRead();
    await refresh();
  }

  if (loading) return <LoadingState />;

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unread} unread · categories include payroll, attendance, leave and reports.`}
        actions={
          <Button variant="outline" size="sm" onClick={markAll}>
            Mark all read
          </Button>
        }
      />
      <DemoBanner />

      <div className="space-y-2">
        {items.map((n) => (
          <Card
            key={n.id}
            className={`!p-4 ${n.read ? "opacity-80" : "border-teal-200 bg-teal-50/30"}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">{n.title}</h3>
                  <Badge tone={n.read ? "neutral" : "primary"}>
                    {NOTIFICATION_CATEGORY_LABELS[n.category]}
                  </Badge>
                  {!n.read ? <Badge tone="danger">Unread</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDateTime(n.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!n.read ? (
                  <Button variant="outline" size="sm" onClick={() => markRead(n.id)}>
                    Mark read
                  </Button>
                ) : null}
                {n.href ? (
                  <Link href={n.href}>
                    <Button size="sm">Open</Button>
                  </Link>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
