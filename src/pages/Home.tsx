import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store';
import { Play, Target, RefreshCw, Plus, TrendingDown, TrendingUp, Minus, Upload, BarChart3, FileText, Brain } from 'lucide-react';
import { formatDuration, getMasteryColor } from '@/lib/utils';

interface HomeProps {
  onNavigate: (page: string) => void;
  onStartSession?: () => void;
}

export function Home({ onNavigate, onStartSession }: HomeProps) {
  const { getTodayPlan } = useStore();
  const plan = getTodayPlan();

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Today</h1>
        <p className="text-muted-foreground">
          Your personalized plan to detect and close knowledge gaps
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Plan Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Plan</CardTitle>
            <CardDescription>
              {plan.reviewCount + plan.diagnosticCount} items · ~{formatDuration(plan.estimatedMinutes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Reviews</p>
                <p className="text-2xl font-bold">{plan.reviewCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Diagnostics</p>
                <p className="text-2xl font-bold">{plan.diagnosticCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Due Soon</p>
                <p className="text-2xl font-bold text-warning">{plan.dueItems}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={onStartSession} size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Start Session
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Target className="h-4 w-4" />
                Quick Diagnostic (5 min)
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Review Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coverage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Coverage</CardTitle>
            <CardDescription>Syllabus attempted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{plan.coveragePercent}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('concepts')}
                >
                  View All
                </Button>
              </div>
              <Progress value={plan.coveragePercent} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              {100 - plan.coveragePercent}% of concepts not yet attempted
            </p>
            <Button variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Content
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Gaps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Gaps</CardTitle>
              <CardDescription>Concepts needing the most attention</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('concepts')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {plan.topGaps.length === 0 ? (
            <div className="py-12 text-center">
              <Brain className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No data yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Run a 5-minute diagnostic to surface your top gaps.
              </p>
              <Button className="mt-4 gap-2">
                <Target className="h-4 w-4" />
                Start Diagnostic
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {plan.topGaps.map((gap) => (
                <div
                  key={gap.conceptId}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{gap.conceptName}</h4>
                      {getTrendIcon(gap.trend)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Mastery: {gap.mastery}%</span>
                      <span>·</span>
                      <span>{gap.itemsToReview} items to review</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center font-semibold"
                      style={{
                        backgroundColor: getMasteryColor(gap.mastery) + '20',
                        color: getMasteryColor(gap.mastery),
                      }}
                    >
                      {gap.mastery}
                    </div>
                    <Button size="sm" variant="outline">
                      Practice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-colors hover:bg-accent" onClick={() => onNavigate('import')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5" />
              Import Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Import learning objectives, CSV, or Anki decks
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-accent" onClick={() => onNavigate('analytics')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              View Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track performance, calibration, and progress
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-accent" onClick={() => onNavigate('items')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Author Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create new questions and practice items
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
