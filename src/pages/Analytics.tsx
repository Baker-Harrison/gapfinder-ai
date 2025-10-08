import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store';
import { TrendingUp, Target, CheckCircle2, AlertTriangle, Brain } from 'lucide-react';

export function Analytics() {
  const { conceptMastery, loadConceptMastery } = useStore();
  const [overallAccuracy, setOverallAccuracy] = useState(0);
  const [averageBrier, setAverageBrier] = useState(0);

  // Load analytics data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load concept mastery first
        await loadConceptMastery();
        
        const { api } = await import('@/api');
        const trends = await api.analytics.getPerformanceTrends();
        
        // Calculate overall stats
        if (trends.length > 0) {
          const avgAcc = trends.reduce((sum, t) => sum + t.accuracy, 0) / trends.length;
          setOverallAccuracy(Math.round(avgAcc * 100));
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };
    loadData();
  }, [loadConceptMastery]);

  // Calculate Brier score from concept mastery and deduplicate
  useEffect(() => {
    if (conceptMastery.length > 0) {
      // Deduplicate by concept_id (keep first occurrence)
      const uniqueMastery = conceptMastery.filter((c, index, self) => 
        index === self.findIndex((t) => t.concept_id === c.concept_id)
      );
      const avgBrier = uniqueMastery.reduce((sum, c) => sum + c.brier_score, 0) / uniqueMastery.length;
      setAverageBrier(avgBrier);
    }
  }, [conceptMastery]);

  // Deduplicate conceptMastery for counts
  const uniqueConceptMastery = conceptMastery.filter((c, index, self) => 
    index === self.findIndex((t) => t.concept_id === c.concept_id)
  );
  
  const masteredCount = uniqueConceptMastery.filter((c) => c.mastery_score >= 80).length;
  const criticalGaps = uniqueConceptMastery.filter((c) => c.mastery_score < 50).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your performance, calibration, and progress over time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Based on all attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brier Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageBrier.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {averageBrier < 0.25 ? 'Well calibrated' : 'Improving'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concepts Mastered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{masteredCount}</div>
            <p className="text-xs text-muted-foreground">
              Out of {uniqueConceptMastery.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalGaps}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Concept List */}
      <Card>
        <CardHeader>
          <CardTitle>Concept Mastery Details</CardTitle>
          <CardDescription>
            Your performance on each concept
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uniqueConceptMastery.length === 0 ? (
            <div className="py-12 text-center">
              <Brain className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No data yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start practicing to see your analytics
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {uniqueConceptMastery.map((concept) => (
                <div key={concept.concept_id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{concept.concept_name}</h4>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Mastery: {Math.round(concept.mastery_score)}%</span>
                      <span>•</span>
                      <span>{concept.attempts} attempts</span>
                      <span>•</span>
                      <span>{concept.correct} correct</span>
                    </div>
                  </div>
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full font-semibold"
                    style={{
                      backgroundColor: concept.mastery_score >= 80 ? 'hsl(142, 76%, 36%, 0.2)' : concept.mastery_score >= 50 ? 'hsl(48, 96%, 53%, 0.2)' : 'hsl(0, 84%, 60%, 0.2)',
                      color: concept.mastery_score >= 80 ? 'hsl(142, 76%, 36%)' : concept.mastery_score >= 50 ? 'hsl(48, 96%, 53%)' : 'hsl(0, 84%, 60%)',
                    }}
                  >
                    {Math.round(concept.mastery_score)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
