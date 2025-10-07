import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Upload,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item, ItemType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Items() {
  const { items, concepts } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');
  const [showAuthorDialog, setShowAuthorDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.stem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Items</h1>
            <p className="text-sm text-muted-foreground">
              Manage your question bank and create new items
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <Button onClick={() => setShowAuthorDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Item
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              All
            </Button>
            <Button
              variant={typeFilter === 'mcq' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('mcq')}
            >
              MCQ
            </Button>
            <Button
              variant={typeFilter === 'calc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('calc')}
            >
              Calc
            </Button>
            <Button
              variant={typeFilter === 'free-recall' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('free-recall')}
            >
              Free Recall
            </Button>
            <Button
              variant={typeFilter === 'case' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('case')}
            >
              Case
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 border-b bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Stem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Concepts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Last Edit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y bg-card">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-accent"
              >
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="line-clamp-2 text-sm">{item.stem}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{item.type.toUpperCase()}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.conceptIds.slice(0, 2).map((conceptId) => {
                      const concept = concepts.find((c) => c.id === conceptId);
                      return concept ? (
                        <Badge key={conceptId} variant="secondary" className="text-xs">
                          {concept.name.length > 20
                            ? concept.name.slice(0, 20) + '...'
                            : concept.name}
                        </Badge>
                      ) : null;
                    })}
                    {item.conceptIds.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.conceptIds.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">{item.difficulty}/100</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingItem(item);
                        setShowAuthorDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No items found</p>
              <Button
                onClick={() => setShowAuthorDialog(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Item
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Author Dialog */}
      <AuthorDialog
        open={showAuthorDialog}
        onOpenChange={setShowAuthorDialog}
        item={editingItem}
      />
    </div>
  );
}

interface AuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
}

function AuthorDialog({ open, onOpenChange, item }: AuthorDialogProps) {
  const { concepts } = useStore();
  const [itemType, setItemType] = useState<ItemType>('mcq');
  const [stem, setStem] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Create New Item'}</DialogTitle>
          <DialogDescription>
            Author a new question or practice item
          </DialogDescription>
        </DialogHeader>

        <Tabs value={itemType} onValueChange={(v) => setItemType(v as ItemType)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mcq">MCQ</TabsTrigger>
            <TabsTrigger value="free-recall">Free Recall</TabsTrigger>
            <TabsTrigger value="calc">Calculation</TabsTrigger>
            <TabsTrigger value="case">Case</TabsTrigger>
            <TabsTrigger value="cloze">Cloze</TabsTrigger>
          </TabsList>

          <TabsContent value="mcq" className="space-y-4">
            <div className="space-y-2">
              <Label>Question Stem</Label>
              <textarea
                value={stem}
                onChange={(e) => setStem(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter your question..."
              />
            </div>

            <div className="space-y-2">
              <Label>Answer Choices</Label>
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-6">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <Input
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...choices];
                      newChoices[index] = e.target.value;
                      setChoices(newChoices);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  <input
                    type="radio"
                    name="correct"
                    checked={correctAnswer === choice}
                    onChange={() => setCorrectAnswer(choice)}
                    className="h-4 w-4"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Explanation</Label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Explain why this is the correct answer..."
              />
            </div>
          </TabsContent>

          <TabsContent value="calc" className="space-y-4">
            <div className="space-y-2">
              <Label>Question Stem</Label>
              <textarea
                value={stem}
                onChange={(e) => setStem(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter calculation problem..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Formula</Label>
                <Input placeholder="e.g., CrCl = ((140-age) × weight) / (72 × SCr)" />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input placeholder="e.g., mL/min" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Worked Solution</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Step-by-step solution..."
              />
            </div>
          </TabsContent>

          <TabsContent value="free-recall" className="space-y-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <textarea
                value={stem}
                onChange={(e) => setStem(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter your question..."
              />
            </div>

            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Input
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Expected answer..."
              />
            </div>
          </TabsContent>

          <TabsContent value="case" className="space-y-4">
            <div className="space-y-2">
              <Label>Case Vignette</Label>
              <textarea
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter clinical case scenario..."
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Add multi-step questions below
            </p>
          </TabsContent>

          <TabsContent value="cloze" className="space-y-4">
            <div className="space-y-2">
              <Label>Cloze Text</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Use {{}} to mark blanks. Example: The drug {{answer}} is used for..."
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Save Item</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
