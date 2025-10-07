import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function Analytics() {
  const { concepts } = useStore();

  // Mock data for charts
  const performanceData = [
    { date: 'Week 1', accuracy: 65 },
    { date: 'Week 2', accuracy: 68 },
    { date: 'Week 3', accuracy: 72 },
    { date: 'Week 4', accuracy: 75 },
    { date: 'Week 5', accuracy: 78 },
    { date: 'Week 6', accuracy: 82 },
  ];

  const calibrationData = [
    { confidence: 1, accuracy: 45, count: 12 },
    { confidence: 2, accuracy: 58, count: 24 },
    { confidence: 3, accuracy: 68, count: 45 },
    { confidence: 4, accuracy: 82, count: 38 },
    { confidence: 5, accuracy: 92, count: 21 },
  ];

  const domainData = concepts.reduce((acc, concept) => {
    const existing = acc.find((d) => d.domain === concept.domain);
    if (existing) {
      existing.mastery = (existing.mastery + concept.mastery) / 2;
      existing.count++;
    } else {
      acc.push({ domain: concept.domain, mastery: concept.mastery, count: 1 });
    }
    return acc;
  }, [] as { domain: string; mastery: number; count: number }[]);

  const errorTypes = [
    { type: 'Unit Conversion', count: 15, percentage: 28 },
    { type: 'MOA Confusion', count: 12, percentage: 22 },
    { type: 'Dosing Errors', count: 10, percentage: 19 },
    { type: 'Contraindications', count: 8, percentage: 15 },
    { type: 'Drug Interactions', count: 8, percentage: 15 },
  ];

  const brierScore = 0.18; // Lower is better, 0 is perfect

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
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+5%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brier Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brierScore.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Well calibrated (closer to 0 is better)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concepts Mastered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {concepts.filter((c) => c.mastery >= 80).length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {concepts.length} total concepts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {concepts.filter((c) => c.mastery < 50).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Concepts below 50% mastery
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="errors">Error Bank</TabsTrigger>
          <TabsTrigger value="domains">By Domain</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Over Time</CardTitle>
              <CardDescription>
                Your performance trend across all practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Accuracy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blueprint Coverage</CardTitle>
              <CardDescription>
                Percentage of syllabus attempted by domain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainData.map((domain) => (
                  <div key={domain.domain} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{domain.domain}</span>
                      <span className="text-muted-foreground">
                        {Math.round(domain.mastery)}% mastery
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${domain.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calibration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confidence vs Accuracy</CardTitle>
              <CardDescription>
                How well your confidence matches your actual performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="confidence"
                    name="Confidence"
                    domain={[0, 6]}
                    ticks={[1, 2, 3, 4, 5]}
                  />
                  <YAxis
                    type="number"
                    dataKey="accuracy"
                    name="Accuracy"
                    domain={[0, 100]}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter
                    name="Calibration"
                    data={calibrationData}
                    fill="hsl(var(--primary))"
                  />
                  {/* Perfect calibration line */}
                  <Line
                    type="linear"
                    dataKey="y"
                    data={[
                      { x: 1, y: 20 },
                      { x: 5, y: 100 },
                    ]}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Calibration Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Brier Score</span>
                  <Badge variant="outline">{brierScore.toFixed(2)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overconfidence</span>
                  <Badge variant="outline">Low</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Underconfidence</span>
                  <Badge variant="outline">Moderate</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-success" />
                    <span>Your calibration is generally good</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-warning" />
                    <span>Consider being more confident on easier items</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Error Types</CardTitle>
              <CardDescription>
                Most common mistakes to focus remediation efforts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={errorTypes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errorTypes.map((error) => (
                  <div
                    key={error.type}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{error.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {error.count} errors · {error.percentage}% of total
                      </p>
                    </div>
                    <Badge variant="outline">Practice</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mastery by Domain</CardTitle>
              <CardDescription>
                Average mastery across all concepts in each domain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={domainData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="domain" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mastery" name="Mastery %">
                    {domainData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.mastery >= 80
                            ? 'hsl(142, 76%, 36%)'
                            : entry.mastery >= 70
                            ? 'hsl(48, 96%, 53%)'
                            : 'hsl(0, 84%, 60%)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
