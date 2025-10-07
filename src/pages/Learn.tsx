import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store';
import { Clock, Flag, Pause, CheckCircle2, XCircle, Brain, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item } from '@/types';

export function Learn() {
  const { items, getConceptById } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | string[]>('');
  const [confidence, setConfidence] = useState(3);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  if (!currentItem) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No items available</h2>
          <p className="mt-2 text-muted-foreground">Start by importing or creating content</p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    // Simple answer checking (in real app, this would be more sophisticated)
    const correct = Array.isArray(currentItem.correctAnswer)
      ? JSON.stringify(userAnswer) === JSON.stringify(currentItem.correctAnswer)
      : userAnswer === currentItem.correctAnswer;
    
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setConfidence(3);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const renderItemContent = () => {
    switch (currentItem.type) {
      case 'mcq':
        return <MCQItem item={currentItem} userAnswer={userAnswer} setUserAnswer={setUserAnswer} showFeedback={showFeedback} />;
      case 'free-recall':
        return <FreeRecallItem item={currentItem} userAnswer={userAnswer} setUserAnswer={setUserAnswer} showFeedback={showFeedback} />;
      case 'calc':
        return <CalcItem item={currentItem} userAnswer={userAnswer} setUserAnswer={setUserAnswer} showFeedback={showFeedback} />;
      case 'cloze':
        return <ClozeItem item={currentItem} userAnswer={userAnswer} setUserAnswer={setUserAnswer} showFeedback={showFeedback} />;
      default:
        return <div>Unsupported item type</div>;
    }
  };

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">Question {currentIndex + 1} of {items.length}</Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Flag className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-1" />
        </div>

        {/* Item content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Stem */}
            <div className="space-y-2">
              <Badge>{currentItem.type.toUpperCase()}</Badge>
              <h2 className="text-xl font-medium leading-relaxed">{currentItem.stem}</h2>
            </div>

            {/* Item-specific content */}
            {renderItemContent()}

            {/* Confidence slider */}
            {!showFeedback && (
              <div className="space-y-4 rounded-lg border bg-card p-6">
                <Label>How sure were you? (1=guess, 5=absolutely sure)</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">1</span>
                  <Slider
                    value={[confidence]}
                    onValueChange={(v) => setConfidence(v[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">5</span>
                  <Badge variant="outline" className="w-12 justify-center">
                    {confidence}
                  </Badge>
                </div>
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <Card className={cn(
                'border-2',
                isCorrect ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'
              )}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-6 w-6 text-success" />
                        <span className="text-lg font-semibold text-success">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6 text-destructive" />
                        <span className="text-lg font-semibold text-destructive">Incorrect</span>
                      </>
                    )}
                  </div>

                  {currentItem.explanation && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Explanation</h4>
                      <p className="text-sm text-muted-foreground">{currentItem.explanation}</p>
                    </div>
                  )}

                  <Button onClick={handleNext} className="w-full gap-2">
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Submit button */}
            {!showFeedback && (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full"
                disabled={!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)}
              >
                Submit Answer
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Context pane */}
      <aside className="w-80 border-l bg-card p-6 space-y-6 overflow-auto">
        <div>
          <h3 className="font-semibold mb-3">Linked Concepts</h3>
          <div className="space-y-2">
            {currentItem.conceptIds.map((conceptId) => {
              const concept = getConceptById(conceptId);
              return concept ? (
                <Badge key={conceptId} variant="secondary" className="w-full justify-start">
                  <Brain className="mr-2 h-3 w-3" />
                  {concept.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Item Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Difficulty</dt>
              <dd className="font-medium">{currentItem.difficulty}/100</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="font-medium">{currentItem.type}</dd>
            </div>
            {currentItem.lastAttempted && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last Attempted</dt>
                <dd className="font-medium">
                  {new Date(currentItem.lastAttempted).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Keyboard Shortcuts</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Submit</dt>
              <dd>
                <kbd className="rounded border bg-muted px-2 py-1 text-xs">Enter</kbd>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Flag</dt>
              <dd>
                <kbd className="rounded border bg-muted px-2 py-1 text-xs">F</kbd>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Concepts</dt>
              <dd>
                <kbd className="rounded border bg-muted px-2 py-1 text-xs">G</kbd>
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

// Item type components
function MCQItem({ item, userAnswer, setUserAnswer, showFeedback }: any) {
  return (
    <div className="space-y-3">
      {item.choices?.map((choice: string, index: number) => {
        const isSelected = userAnswer === choice;
        const isCorrect = choice === item.correctAnswer;
        const showCorrect = showFeedback && isCorrect;
        const showIncorrect = showFeedback && isSelected && !isCorrect;

        return (
          <button
            key={index}
            onClick={() => !showFeedback && setUserAnswer(choice)}
            disabled={showFeedback}
            className={cn(
              'w-full rounded-lg border-2 p-4 text-left transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isSelected && !showFeedback && 'border-primary bg-primary/5',
              !isSelected && !showFeedback && 'border-border hover:border-primary/50 hover:bg-accent',
              showCorrect && 'border-success bg-success/10',
              showIncorrect && 'border-destructive bg-destructive/10',
              showFeedback && !isCorrect && !isSelected && 'opacity-50'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-medium',
                isSelected && !showFeedback && 'border-primary bg-primary text-primary-foreground',
                !isSelected && !showFeedback && 'border-muted-foreground',
                showCorrect && 'border-success bg-success text-success-foreground',
                showIncorrect && 'border-destructive bg-destructive text-destructive-foreground'
              )}>
                {String.fromCharCode(65 + index)}
              </div>
              <span>{choice}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function FreeRecallItem({ item, userAnswer, setUserAnswer, showFeedback }: any) {
  return (
    <div className="space-y-4">
      <Input
        value={userAnswer as string}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer..."
        disabled={showFeedback}
        className="text-lg"
      />
      {showFeedback && (
        <div className="rounded-lg border bg-muted p-4">
          <p className="text-sm font-medium">Correct Answer:</p>
          <p className="mt-1">{item.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}

function CalcItem({ item, userAnswer, setUserAnswer, showFeedback }: any) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted p-4">
        <p className="text-sm font-medium">Formula:</p>
        <p className="mt-1 font-mono">{item.calcTemplate?.formula || 'N/A'}</p>
      </div>
      
      <div className="flex gap-2">
        <Input
          type="number"
          value={userAnswer as string}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter calculated value..."
          disabled={showFeedback}
          className="flex-1"
        />
        <div className="flex items-center rounded-md border bg-muted px-3 text-sm">
          {item.calcTemplate?.unit || 'units'}
        </div>
      </div>

      {showFeedback && item.calcTemplate?.workingSolution && (
        <div className="rounded-lg border bg-muted p-4">
          <p className="text-sm font-medium">Worked Solution:</p>
          <p className="mt-2 whitespace-pre-line text-sm">{item.calcTemplate.workingSolution}</p>
        </div>
      )}
    </div>
  );
}

function ClozeItem({ item, userAnswer, setUserAnswer, showFeedback }: any) {
  // Simple cloze implementation
  const parts = item.clozeText?.split('{{}}') || [];
  
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-6 text-lg leading-relaxed">
        {parts.map((part: string, index: number) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              showFeedback ? (
                <span className="font-semibold text-primary">{item.correctAnswer}</span>
              ) : (
                <Input
                  value={userAnswer as string}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="mx-2 inline-flex w-32"
                  placeholder="..."
                />
              )
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
