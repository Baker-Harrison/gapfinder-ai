import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store';
import { Moon, Sun, Download, Upload, Database, Trash2 } from 'lucide-react';

export function Settings() {
  const { theme, toggleTheme, clearDatabase, loading } = useStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearDatabase = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000);
      return;
    }
    await clearDatabase();
    setConfirmClear(false);
    alert('Database cleared successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your learning experience and manage your data
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="srs">SRS Algorithm</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Small</span>
                  <Slider defaultValue={[100]} min={75} max={175} step={25} className="flex-1" />
                  <span className="text-sm text-muted-foreground">Large</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date Format</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Number Format</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option>1,234.56 (US)</option>
                  <option>1.234,56 (EU)</option>
                  <option>1 234,56 (SI)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Defaults</CardTitle>
              <CardDescription>
                Set default preferences for practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Session Length</Label>
                <Input type="number" defaultValue={15} min={5} max={100} />
                <p className="text-xs text-muted-foreground">
                  Number of items per session
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Timer</Label>
                  <p className="text-sm text-muted-foreground">
                    Display elapsed time during sessions
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Confidence Rating</Label>
                  <p className="text-sm text-muted-foreground">
                    Always ask for confidence before showing feedback
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="srs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FSRS Parameters</CardTitle>
              <CardDescription>
                Fine-tune the spaced repetition algorithm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-warning bg-warning/10 p-4">
                <p className="text-sm">
                  <strong>Advanced:</strong> These parameters are automatically optimized based on
                  your performance. Only adjust if you understand the FSRS algorithm.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Desired Retention</Label>
                <div className="flex items-center gap-4">
                  <Slider defaultValue={[90]} min={70} max={98} step={1} className="flex-1" />
                  <span className="w-12 text-sm font-medium">90%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Target probability of recalling an item
                </p>
              </div>

              <div className="space-y-2">
                <Label>Maximum Interval (days)</Label>
                <Input type="number" defaultValue={365} min={30} max={3650} />
              </div>

              <Button variant="outline">Reset to Defaults</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-schedule Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically add due reviews to daily plan
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="space-y-2">
                <Label>Daily Review Limit</Label>
                <Input type="number" defaultValue={50} min={10} max={200} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mastery Thresholds</CardTitle>
              <CardDescription>
                Define what constitutes weak, developing, and strong mastery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Critical Gap Threshold</Label>
                <div className="flex items-center gap-4">
                  <Slider defaultValue={[50]} min={0} max={100} step={5} className="flex-1" />
                  <span className="w-12 text-sm font-medium">&lt; 50%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Concepts below this are flagged as critical gaps
                </p>
              </div>

              <div className="space-y-2">
                <Label>Weak Threshold</Label>
                <div className="flex items-center gap-4">
                  <Slider defaultValue={[70]} min={0} max={100} step={5} className="flex-1" />
                  <span className="w-12 text-sm font-medium">&lt; 70%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Strong Threshold</Label>
                <div className="flex items-center gap-4">
                  <Slider defaultValue={[80]} min={0} max={100} step={5} className="flex-1" />
                  <span className="w-12 text-sm font-medium">≥ 80%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stability Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Low Stability Threshold (days)</Label>
                <Input type="number" defaultValue={7} min={1} max={30} />
                <p className="text-xs text-muted-foreground">
                  Concepts with stability below this are flagged for review
                </p>
              </div>

              <div className="space-y-2">
                <Label>Stability Horizon (days)</Label>
                <Input type="number" defaultValue={30} min={7} max={365} />
                <p className="text-xs text-muted-foreground">
                  Time window for calculating stability metrics
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Storage</CardTitle>
              <CardDescription>
                All data is stored locally on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Local Encryption</Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt your local database
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>

              <div className="space-y-2">
                <Label>Storage Location</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="C:\Users\YourName\AppData\Local\GapFinder"
                    className="flex-1"
                  />
                  <Button variant="outline">Change</Button>
                </div>
              </div>

              <div className="rounded-lg border bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Database Size</p>
                    <p className="text-sm text-muted-foreground">2.4 MB</p>
                  </div>
                  <Database className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Create daily backups automatically
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="space-y-2">
                <Label>Backup Location</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="C:\Users\YourName\Documents\GapFinder Backups"
                    className="flex-1"
                  />
                  <Button variant="outline">Change</Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Export Backup
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Upload className="h-4 w-4" />
                  Restore Backup
                </Button>
              </div>

              <div className="rounded-lg border bg-muted p-4">
                <p className="text-sm">
                  <strong>Last Backup:</strong> Today at 3:42 PM
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anki Bridge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Anki Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync with Anki via AnkiConnect
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>

              <div className="space-y-2">
                <Label>AnkiConnect Port</Label>
                <Input type="number" defaultValue={8765} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions - proceed with caution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Clear All Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Delete all concepts, items, attempts, and sessions
                  </p>
                </div>
                <Button
                  variant={confirmClear ? "destructive" : "outline"}
                  onClick={handleClearDatabase}
                  disabled={loading}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {confirmClear ? 'Click Again to Confirm' : 'Clear Database'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
