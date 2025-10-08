import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuickLearn } from '@/components/QuickLearn';
import { useStore } from '@/store';
import { Upload, BarChart3, Zap, Settings as SettingsIcon, Sparkles, Loader2 } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { conceptMastery, items, loadItems, loadConceptMastery } = useStore();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  
  // Load data on mount
  useEffect(() => {
    loadConceptMastery();
    loadItems();
  }, [loadConceptMastery, loadItems]);
  
  // Check for API key
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    setHasApiKey(!!savedKey && savedKey.trim().length > 0);
  }, []);

  // Check for generation status
  useEffect(() => {
    const checkGenerationStatus = () => {
      const status = localStorage.getItem('generation_status');
      if (status) {
        const parsed = JSON.parse(status);
        setIsGenerating(parsed.isGenerating);
        setGenerationProgress(parsed.progress || { current: 0, total: 0 });
      } else {
        setIsGenerating(false);
      }
    };

    checkGenerationStatus();
    const interval = setInterval(() => {
      checkGenerationStatus();
      if (isGenerating) {
        loadItems(); // Reload items to show newly generated questions
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [isGenerating, loadItems]);
  
  // Deduplicate concepts
  const uniqueConcepts = conceptMastery.filter((c, index, self) => 
    index === self.findIndex((t) => t.concept_id === c.concept_id)
  );
  
  const totalConcepts = uniqueConcepts.length;
  const masteredConcepts = uniqueConcepts.filter(c => c.mastery_score >= 80).length;
  const totalAttempts = uniqueConcepts.reduce((sum, c) => sum + c.attempts, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Zap className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Quick Learn</h1>
        <p className="text-muted-foreground text-lg">
          Master concepts one question at a time
        </p>
      </div>

      {/* Generation Progress Indicator */}
      {isGenerating && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="font-medium">Generating Questions...</p>
                <p className="text-sm text-muted-foreground">
                  {generationProgress.current} of {generationProgress.total} concepts completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {Math.round((generationProgress.current / generationProgress.total) * 100)}%
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Learn Component */}
      <QuickLearn />

      {/* Simple Stats */}
      {totalConcepts > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{totalConcepts}</div>
              <p className="text-sm text-muted-foreground mt-1">Concepts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{items.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Questions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">{masteredConcepts}</div>
              <p className="text-sm text-muted-foreground mt-1">Mastered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{totalAttempts}</div>
              <p className="text-sm text-muted-foreground mt-1">Attempts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      {totalConcepts === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasApiKey && (
              <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">API Key Recommended</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add your Google Gemini API key in Settings to auto-generate questions from learning objectives
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => onNavigate('settings')} 
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  <SettingsIcon className="h-4 w-4" />
                  Add API Key
                </Button>
              </div>
            )}
            <p className="text-center text-muted-foreground">
              Import your learning objectives to generate questions
            </p>
            <Button 
              onClick={() => onNavigate('import')} 
              size="lg" 
              className="w-full gap-2"
            >
              <Upload className="h-5 w-5" />
              Import Learning Objectives
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Secondary Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card 
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary" 
          onClick={() => onNavigate('analytics')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              View Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your performance and mastery
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary" 
          onClick={() => onNavigate('import')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Import Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add new learning objectives
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
