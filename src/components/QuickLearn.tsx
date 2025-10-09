import { useEffect, useMemo } from 'react';
import { useStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, Clock, ListChecks, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const trendIconMap = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
} as const;

type TrendKey = keyof typeof trendIconMap;

export function QuickLearn() {
  const { loadDailyPlan, getTodayPlan } = useStore();

  useEffect(() => {
    loadDailyPlan().catch(() => {
      // Errors are surfaced via the global store state/toast elsewhere.
    });
  }, [loadDailyPlan]);

  const todayPlan = getTodayPlan();
  const hasPlan = todayPlan.dueItems > 0 || todayPlan.topGaps.length > 0;

  const stats = useMemo(
    () => [
      { label: 'Due reviews', value: todayPlan.reviewCount, icon: Clock },
      { label: 'Diagnostics', value: todayPlan.diagnosticCount, icon: Target },
      { label: 'Est. minutes', value: todayPlan.estimatedMinutes, icon: Flame },
      { label: 'Total items', value: todayPlan.dueItems, icon: ListChecks },
    ],
    [todayPlan]
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Today&apos;s Smart Plan</CardTitle>
          <CardDescription>
            Stay focused on the highest impact reviews based on your spaced retrieval data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasPlan ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-lg font-semibold">{value}</p>
                      </div>
                    </div>
                    {label === 'Est. minutes' && todayPlan.estimatedMinutes > 0 && (
                      <Badge variant="outline" className="hidden sm:inline-flex">
                        ~{todayPlan.estimatedMinutes}m
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button className="gap-2">
                  <Flame className="h-4 w-4" />
                  Start Smart Session
                </Button>
                <Button variant="outline" className="gap-2">
                  <ListChecks className="h-4 w-4" />
                  Review due items
                </Button>
                <Badge variant="secondary" className="ml-auto">
                  Coverage {Math.round(todayPlan.coveragePercent)}%
                </Badge>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
              Import learning material or generate questions to receive a personalized study plan.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus Concepts</CardTitle>
          <CardDescription>Weak areas prioritized for remediation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayPlan.topGaps.length > 0 ? (
            todayPlan.topGaps.map((gap) => {
              const TrendIcon = trendIconMap[(gap.trend ?? 'stable') as TrendKey] ?? Minus;
              const trendColor =
                gap.trend === 'up'
                  ? 'text-success'
                  : gap.trend === 'down'
                  ? 'text-destructive'
                  : 'text-muted-foreground';

              return (
                <div key={gap.conceptId} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium leading-tight">{gap.conceptName}</p>
                      <p className="text-xs text-muted-foreground">{gap.itemsToReview} items ready for review</p>
                    </div>
                    <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Mastery</span>
                      <span>{Math.round(gap.mastery)}%</span>
                    </div>
                    <Progress value={Math.min(100, Math.max(0, gap.mastery))} className="h-1.5" />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up! New focus concepts will appear once analytics detects weak areas.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
