import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store';
import { Search, Plus, Trash2, Play, Target, X, Loader2 } from 'lucide-react';
import { cn, getMasteryColor, getMasteryLabel } from '@/lib/utils';

type ConceptWithMastery = {
  id: string;
  name: string;
  domain: string;
  subdomain?: string;
  description?: string;
  mastery: number;
  stability: number;
  coverage: number;
  created_at: string;
  updated_at: string;
};

export function Concepts() {
  const { concepts, conceptMastery, loadConcepts, loadConceptMastery, createConcept, deleteConcept, loading, getRemediationPlan } = useStore();
  const [selectedConcept, setSelectedConcept] = useState<ConceptWithMastery | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'weak' | 'low-stability'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newConceptName, setNewConceptName] = useState('');
  const [newConceptDomain, setNewConceptDomain] = useState('');

  const handleCreateConcept = async () => {
    if (newConceptName && newConceptDomain) {
      await createConcept(newConceptName, newConceptDomain);
      setDialogOpen(false);
      setNewConceptName('');
      setNewConceptDomain('');
    }
  };

  const handleDeleteConcept = async (id: string) => {
    if (confirm('Are you sure you want to delete this concept?')) {
      await deleteConcept(id);
      setSelectedConcept(null);
    }
  };

  useEffect(() => {
    loadConcepts();
    loadConceptMastery();
  }, [loadConcepts, loadConceptMastery]);

  // Map concepts to include mastery data
  const conceptsWithMastery = concepts.map(concept => {
    const mastery = conceptMastery.find(m => m.concept_id === concept.id);
    return {
      id: concept.id,
      name: concept.name,
      domain: concept.domain,
      subdomain: concept.subdomain || 'Other',
      description: concept.description,
      created_at: concept.created_at || new Date().toISOString(),
      updated_at: concept.updated_at || concept.created_at || new Date().toISOString(),
      mastery: mastery?.mastery_score || 0,
      stability: mastery?.stability || 0,
      coverage: mastery ? (mastery.attempts > 0 ? 100 : 0) : 0,
    };
  });

  // Group concepts by domain and subdomain
  const groupedConcepts = conceptsWithMastery.reduce((acc, concept) => {
    if (!acc[concept.domain]) {
      acc[concept.domain] = {};
    }
    const subdomain = concept.subdomain || 'Other';
    if (!acc[concept.domain][subdomain]) {
      acc[concept.domain][subdomain] = [];
    }
    acc[concept.domain][subdomain].push(concept);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  const filteredConcepts = (conceptList: ConceptWithMastery[]) => {
    let filtered = conceptList;

    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterMode === 'weak') {
      filtered = filtered.filter((c) => c.mastery < 70);
    } else if (filterMode === 'low-stability') {
      filtered = filtered.filter((c) => c.stability < 7);
    }

    return filtered;
  };

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Concepts</h1>
              <p className="text-sm text-muted-foreground">
                Visualize mastery across all domains
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Concept
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Concept</DialogTitle>
                    <DialogDescription>
                      Add a new concept to track your learning progress.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Concept Name</Label>
                      <Input
                        id="name"
                        value={newConceptName}
                        onChange={(e) => setNewConceptName(e.target.value)}
                        placeholder="e.g., Creatinine Clearance"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain</Label>
                      <Input
                        id="domain"
                        value={newConceptDomain}
                        onChange={(e) => setNewConceptDomain(e.target.value)}
                        placeholder="e.g., Calculations"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateConcept} disabled={!newConceptName || !newConceptDomain}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={filterMode === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('all')}
              >
                All
              </Button>
              <Button
                variant={filterMode === 'weak' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('weak')}
              >
                Weak (&lt;70)
              </Button>
              <Button
                variant={filterMode === 'low-stability' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('low-stability')}
              >
                Low Stability
              </Button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 px-6 py-2 text-sm text-muted-foreground border-b bg-muted/30">
            <Loader2 className="h-4 w-4 animate-spin" />
            Syncing concept data...
          </div>
        )}

        {/* Heatmap */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {Object.entries(groupedConcepts).map(([domain, subdomains]) => (
              <Card key={domain}>
                <CardHeader>
                  <CardTitle>{domain}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(subdomains).map(([subdomain, conceptList]) => {
                      const filtered = filteredConcepts(conceptList);
                      if (filtered.length === 0) return null;

                      return (
                        <div key={subdomain}>
                          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                            {subdomain}
                          </h4>
                          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                            {filtered.map((concept) => (
                              <button
                                key={concept.id}
                                onClick={() => setSelectedConcept(concept)}
                                className={cn(
                                  'group relative aspect-square rounded-md transition-all',
                                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                  'hover:scale-105 hover:shadow-lg',
                                  selectedConcept?.id === concept.id && 'ring-2 ring-primary'
                                )}
                                style={{
                                  backgroundColor: getMasteryColor(concept.mastery) + '40',
                                }}
                                title={`${concept.name}: ${concept.mastery}% mastery, ${concept.stability}d stability`}
                              >
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
                                  <span className="text-xs font-bold" style={{ color: getMasteryColor(concept.mastery) }}>
                                    {Math.round(concept.mastery)}
                                  </span>
                                  <span className="text-[8px] truncate w-full" style={{ color: getMasteryColor(concept.mastery) }}>
                                    {concept.name.split(' ')[0]}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legend */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: getMasteryColor(85) }}
                  />
                  <span className="text-sm">Strong (≥80)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: getMasteryColor(75) }}
                  />
                  <span className="text-sm">Developing (70-79)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: getMasteryColor(60) }}
                  />
                  <span className="text-sm">Weak (50-69)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: getMasteryColor(40) }}
                  />
                  <span className="text-sm">Critical Gap (&lt;50)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Drawer */}
      {selectedConcept && (
        <aside className="w-96 border-l bg-card flex flex-col">
          <div className="border-b p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{selectedConcept.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedConcept.domain} · {selectedConcept.subdomain}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConcept(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Mastery</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: getMasteryColor(selectedConcept.mastery) }}>
                  {selectedConcept.mastery}%
                </p>
                <Badge variant="outline" className="mt-1">
                  {getMasteryLabel(selectedConcept.mastery)}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stability</p>
                <p className="mt-1 text-2xl font-bold">{selectedConcept.stability}d</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Coverage</p>
                <p className="mt-1 text-2xl font-bold">{selectedConcept.coverage}%</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            {selectedConcept.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedConcept.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3">Next Best Actions</h3>
              <div className="space-y-2">
                {(() => {
                  const plan = getRemediationPlan(selectedConcept.id);
                  return plan.actions.map((action, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-3 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {action.type}
                        </Badge>
                        {action.estimatedMinutes && (
                          <span className="text-xs text-muted-foreground">
                            ~{action.estimatedMinutes}m
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{action.description}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Target to 80</h3>
              <div className="rounded-lg border bg-muted p-4">
                <p className="text-sm">
                  Complete the actions above to raise mastery from{' '}
                  <span className="font-semibold">{selectedConcept.mastery}%</span> to{' '}
                  <span className="font-semibold">80%</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t p-6 space-y-2">
            <Button className="w-full gap-2">
              <Play className="h-4 w-4" />
              Practice This Concept
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Target className="h-4 w-4" />
              Quick Drill (5 items)
            </Button>
            <Button 
              variant="destructive" 
              className="w-full gap-2"
              onClick={() => handleDeleteConcept(selectedConcept.id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Concept
            </Button>
          </div>
        </aside>
      )}
    </div>
  );
}
