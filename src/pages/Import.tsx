import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { invoke } from '@tauri-apps/api/tauri';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Database, CheckCircle2, AlertCircle, Download, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function Import() {
  const { toast } = useToast();
  const [loText, setLoText] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [lectureSummary, setLectureSummary] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiApiKey, setAiApiKey] = useState('');

  const handleLoImport = () => {
    const lines = loText.split('\n').filter((line) => line.trim());
    const preview = lines.map((line, index) => ({
      id: index,
      itemType: 'concept',
      name: line, // Use full text as concept name
      displayName: line.length > 50 ? `${line.slice(0, 50)}...` : line, // For UI display only
      domain: 'General', // Default domain, can be customized
      description: `Concept derived from learning objective`,
      tags: [],
      learning_objectives: [line], // The LO text becomes a learning objective
      mapped: true,
    }));
    setImportPreview(preview);
    setShowPreview(true);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Simulate CSV parsing
      const preview = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        stem: `Sample question ${i + 1} from CSV`,
        type: 'mcq',
        mapped: true,
        concepts: ['Concept A', 'Concept B'],
      }));
      setImportPreview(preview);
      setShowPreview(true);
    }
  };

  const handleConfirmImport = async () => {
    try {
      // Separate concepts and items from preview
      const concepts = importPreview.filter(item => item.itemType === 'concept');
      const items = importPreview.filter(item => item.itemType === 'item');
      
      console.log(`Importing ${concepts.length} concepts and ${items.length} items`);
      
      // Create a map to track concept IDs
      const conceptNameToId = new Map();
      
      // First, create all concepts
      for (const concept of concepts) {
        console.log('Creating concept:', concept.name);
        // Create concept with just name and domain
        const createdConcept = await invoke('create_concept', {
          name: concept.name,
          domain: concept.domain || 'General',
        }) as any;
        
        // If there are additional fields, update the concept
        if (concept.description || concept.tags?.length || concept.learning_objectives?.length) {
          await invoke('update_concept', {
            concept: {
              ...createdConcept,
              description: concept.description || null,
              subdomain: null,
              tags: concept.tags || [],
              learning_objectives: concept.learning_objectives || [],
              updated_at: new Date().toISOString(), // Update timestamp
            }
          });
        }
        
        conceptNameToId.set(concept.name, createdConcept.id);
        console.log('Concept created successfully:', createdConcept.id);
      }
      
      console.log('All concepts created. Now creating items...');
      
      // Then, create all items with concept references
      for (const item of items) {
        // Map concept names to IDs
        const conceptIds = (item.concepts || [])
          .map((name: string) => conceptNameToId.get(name))
          .filter(Boolean);
        
        // Convert item type to backend format
        let itemType;
        if (item.type === 'mcq' && item.choices) {
          itemType = {
            type: 'mcq',
            options: item.choices.map((choice: string, idx: number) => ({
              id: `opt_${idx}`,
              text: choice,
              is_correct: choice === item.correct_answer || choice.startsWith(item.correct_answer),
              explanation: null,
            })),
          };
        } else if (item.type === 'free-recall') {
          itemType = {
            type: 'free-recall',
            correct_answer: item.correct_answer || '',
          };
        } else if (item.type === 'calc' || item.type === 'calculation') {
          itemType = {
            type: 'calc',
            formula: item.formula || '',
            variables: item.variables || [],
            correct_answer: parseFloat(item.correct_answer) || 0,
            unit: item.unit || '',
            worked_solution: [],
          };
        } else {
          // Default to free-recall
          itemType = {
            type: 'free-recall',
            correct_answer: item.correct_answer || '',
          };
        }
        
        await invoke('create_item', {
          stem: item.stem,
          item_type: itemType,
          concept_ids: conceptIds,
          explanation: item.explanation || '',
        });
      }
      
      toast({
        title: 'Import Successful',
        description: `Imported ${concepts.length} concepts and ${items.length} items successfully.`,
      });
      
      // Reset form
      setShowPreview(false);
      setImportPreview([]);
      setLoText('');
      setCsvFile(null);
      setLectureSummary('');
    } catch (error) {
      console.error('Import error:', error);
      
      // Extract detailed error message
      let errorMessage = 'Failed to import items';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: 'Import Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleAiGenerate = async () => {
    if (!lectureSummary.trim()) return;
    
    setAiGenerating(true);
    try {
      let generatedConcepts, generatedItems;

      // If API key is provided, use real Gemini API
      if (aiApiKey && aiApiKey.trim()) {
        const genAI = new GoogleGenerativeAI(aiApiKey);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
        });

        const prompt = `You are an expert educational content creator. Analyze the following lecture summary and generate educational content.

Lecture Summary:
${lectureSummary}

Generate a JSON response with this exact structure:
{
  "concepts": [
    {
      "name": "concept name",
      "domain": "subject area (e.g., Pharmacy, Medicine, Biology)",
      "description": "clear, concise description",
      "tags": ["tag1", "tag2"],
      "learning_objectives": ["objective 1", "objective 2"]
    }
  ],
  "items": [
    {
      "stem": "complete question text",
      "type": "mcq|open|calculation|true_false",
      "choices": ["A) choice 1", "B) choice 2", "C) choice 3", "D) choice 4"] (only for mcq),
      "correct_answer": "the correct answer",
      "explanation": "detailed explanation of why the answer is correct",
      "concepts": ["related concept names"],
      "difficulty": 1-5 (1=easiest, 5=hardest),
      "tags": ["tag1", "tag2"]
    }
  ]
}

Generate 3-5 core concepts with detailed learning objectives and 8-15 practice items of varying types (mix of mcq, open-ended, calculations). For MCQ questions, always include 4 choices (A-D).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const parsed = JSON.parse(text);

        generatedConcepts = parsed.concepts.map((c: any, i: number) => ({
          id: i + 1,
          name: c.name,
          domain: c.domain,
          description: c.description,
          tags: c.tags || [],
          learning_objectives: c.learning_objectives || [],
        }));

        generatedItems = parsed.items.map((item: any, i: number) => ({
          id: i + 1,
          stem: item.stem,
          type: item.type,
          choices: item.choices || null,
          correct_answer: item.correct_answer || null,
          explanation: item.explanation || null,
          concepts: item.concepts || [],
          difficulty: item.difficulty || 3,
          tags: item.tags || [],
        }));
      } else {
        // Demo mode - use mock data
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        generatedConcepts = [
          { 
            id: 1, 
            name: 'Pharmacokinetics', 
            domain: 'Pharmacy', 
            description: 'Study of drug absorption, distribution, metabolism and elimination (ADME)',
            tags: ['ADME', 'Drug Kinetics'],
            learning_objectives: ['Explain the four processes of ADME', 'Calculate pharmacokinetic parameters']
          },
          { 
            id: 2, 
            name: 'Drug Metabolism', 
            domain: 'Pharmacy', 
            description: 'Enzymatic transformation of drugs primarily in the liver',
            tags: ['CYP450', 'Biotransformation'],
            learning_objectives: ['Identify Phase I and Phase II reactions', 'Explain enzyme induction and inhibition']
          },
          { 
            id: 3, 
            name: 'Elimination Pathways', 
            domain: 'Pharmacy', 
            description: 'Routes of drug excretion from the body',
            tags: ['Renal', 'Biliary', 'Clearance'],
            learning_objectives: ['Describe renal elimination mechanisms', 'Calculate drug clearance']
          },
        ];
        
        generatedItems = [
          { 
            id: 1, 
            stem: 'Which enzyme system is primarily responsible for drug metabolism?', 
            type: 'mcq', 
            choices: ['A) Monoamine oxidase', 'B) Cytochrome P450', 'C) Acetylcholinesterase', 'D) Alkaline phosphatase'],
            correct_answer: 'B) Cytochrome P450',
            explanation: 'The cytochrome P450 enzyme system, particularly CYP3A4, is responsible for metabolizing approximately 50% of all drugs.',
            concepts: ['Drug Metabolism'],
            difficulty: 2,
            tags: ['CYP450', 'Enzymes']
          },
          { 
            id: 2, 
            stem: 'Calculate the half-life (t½) of a drug given: Volume of distribution (Vd) = 50L, Clearance (Cl) = 7L/hr. Use the formula: t½ = (0.693 × Vd) / Cl', 
            type: 'calculation',
            choices: null,
            correct_answer: '4.95 hours',
            explanation: 't½ = (0.693 × 50) / 7 = 34.65 / 7 = 4.95 hours',
            concepts: ['Pharmacokinetics'],
            difficulty: 4,
            tags: ['Calculations', 'Half-life']
          },
          { 
            id: 3, 
            stem: 'List and briefly describe the three major routes of drug elimination from the body.', 
            type: 'open',
            choices: null,
            correct_answer: '1) Renal excretion - drugs filtered/secreted by kidneys, 2) Biliary excretion - drugs secreted into bile and eliminated in feces, 3) Pulmonary excretion - volatile drugs exhaled through lungs',
            explanation: 'The three major elimination routes are renal (most common for hydrophilic drugs), biliary (for larger molecules), and pulmonary (for volatile anesthetics).',
            concepts: ['Elimination Pathways'],
            difficulty: 3,
            tags: ['Elimination', 'Excretion']
          },
        ];
      }
      
      setImportPreview([
        ...generatedConcepts.map((c: any) => ({ ...c, itemType: 'concept', mapped: true })),
        ...generatedItems.map((i: any) => ({ ...i, itemType: 'item', mapped: true })),
      ]);
      
      setShowPreview(true);
      
      toast({
        title: 'AI Generation Complete',
        description: `Generated ${generatedConcepts.length} concepts and ${generatedItems.length} items.`,
      });
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast({
        title: 'AI Generation Failed',
        description: error instanceof Error ? error.message : 'Please check your API key and try again.',
        variant: 'destructive',
      });
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import & Generate</h1>
        <p className="text-muted-foreground">
          Use AI to generate content from lecture notes, or import from CSV, learning objectives, and Anki decks
        </p>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Generate
          </TabsTrigger>
          <TabsTrigger value="los">Learning Objectives</TabsTrigger>
          <TabsTrigger value="csv">CSV/TSV</TabsTrigger>
          <TabsTrigger value="anki">Anki Deck</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>AI-Powered Content Generation</CardTitle>
              </div>
              <CardDescription>
                Submit lecture summaries, notes, or textbook excerpts and let AI automatically generate concepts and practice items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Google Gemini API Key (Optional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="AIza..."
                  value={aiApiKey}
                  onChange={(e) => setAiApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  For demo purposes, AI generation will work without a key. Add your Google Gemini API key for production use. Get one at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lecture-summary">Lecture Summary / Study Notes</Label>
                  <span className="text-xs text-muted-foreground">
                    {lectureSummary.length > 0 && (
                      <>
                        {Math.round(lectureSummary.trim().split(/\s+/).length).toLocaleString()} words · {lectureSummary.length.toLocaleString()} chars
                      </>
                    )}
                  </span>
                </div>
                <textarea
                  id="lecture-summary"
                  value={lectureSummary}
                  onChange={(e) => setLectureSummary(e.target.value)}
                  className="flex min-h-[600px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y overflow-y-auto font-mono leading-relaxed"
                  placeholder="Paste your lecture summary, study notes, or textbook excerpt here...&#10;&#10;✨ Supports 10,000+ words with automatic scrolling ✨&#10;&#10;Example:&#10;&#10;Pharmacokinetics Overview&#10;&#10;Pharmacokinetics is the study of how the body affects drugs. It encompasses four main processes: Absorption, Distribution, Metabolism, and Elimination (ADME).&#10;&#10;Absorption: Drugs must cross biological membranes. Factors affecting absorption include lipid solubility, pH, and blood flow.&#10;&#10;Distribution: Once absorbed, drugs distribute throughout the body. Volume of distribution (Vd) indicates the apparent space in the body available to contain the drug.&#10;&#10;Metabolism: Primarily occurs in the liver via Phase I (oxidation, reduction) and Phase II (conjugation) reactions. The cytochrome P450 enzyme system is crucial.&#10;&#10;Elimination: Drugs are eliminated primarily through renal excretion and biliary elimination. Clearance (Cl) represents the volume of plasma cleared of drug per unit time."
                />
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Paste up to 10,000+ words. Include clear headings, detailed explanations, and examples for best AI results.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-4 space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  What the AI will generate:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>Core concepts and their relationships</li>
                  <li>Learning objectives for each concept</li>
                  <li>Multiple-choice questions</li>
                  <li>Open-ended recall questions</li>
                  <li>Clinical application scenarios</li>
                  <li>Calculation-based problems (if applicable)</li>
                </ul>
              </div>

              <Button 
                onClick={handleAiGenerate} 
                disabled={!lectureSummary.trim() || aiGenerating}
                className="w-full gap-2"
              >
                {aiGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Content with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="los" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Learning Objectives</CardTitle>
              <CardDescription>
                Paste your learning objectives (one per line) and we'll auto-create concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Learning Objectives</Label>
                <textarea
                  value={loText}
                  onChange={(e) => setLoText(e.target.value)}
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Example:&#10;Calculate creatinine clearance using Cockcroft-Gault equation&#10;Identify drug-drug interactions for warfarin&#10;Recommend appropriate antibiotic therapy for community-acquired pneumonia"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleLoImport} disabled={!loText.trim()}>
                  Preview Import
                </Button>
                <p className="text-sm text-muted-foreground">
                  {loText.split('\n').filter((l) => l.trim()).length} objectives detected
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import CSV/TSV File</CardTitle>
              <CardDescription>
                Upload a CSV or TSV file with your questions and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>CSV File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".csv,.tsv"
                    onChange={handleCsvUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Download template CSV to see expected format
                </p>
              </div>

              {csvFile && (
                <div className="rounded-lg border bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{csvFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(csvFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                </div>
              )}

              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-medium">Expected Format</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-1 text-left">stem</th>
                        <th className="px-2 py-1 text-left">type</th>
                        <th className="px-2 py-1 text-left">choices</th>
                        <th className="px-2 py-1 text-left">correct</th>
                        <th className="px-2 py-1 text-left">concepts</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-muted-foreground">
                        <td className="px-2 py-1">What is...</td>
                        <td className="px-2 py-1">mcq</td>
                        <td className="px-2 py-1">A|B|C|D</td>
                        <td className="px-2 py-1">A</td>
                        <td className="px-2 py-1">Cardio;HTN</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anki" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Anki Deck</CardTitle>
              <CardDescription>
                Import cards from an Anki .apkg file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Anki Package (.apkg)</Label>
                <Input type="file" accept=".apkg" />
              </div>

              <div className="rounded-lg border border-warning bg-warning/10 p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Note</p>
                    <p className="text-sm text-muted-foreground">
                      Anki scheduling data will not be imported. Cards will be converted to
                      items and scheduled using FSRS.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Concept Mapping</Label>
                <p className="text-sm text-muted-foreground">
                  How should we map Anki tags to concepts?
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="mapping" defaultChecked />
                    <span className="text-sm">Use Anki tags as concepts</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="mapping" />
                    <span className="text-sm">Use deck name as concept</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="mapping" />
                    <span className="text-sm">Manual mapping after import</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      {showPreview && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Import Preview</CardTitle>
                <CardDescription>
                  Review and approve the mapping before importing
                </CardDescription>
              </div>
              <Badge variant="outline">
                {importPreview.filter((i) => i.mapped).length} / {importPreview.length} mapped
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-auto rounded-lg border">
              <table className="w-full">
                <thead className="sticky top-0 border-b bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Content</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Mapped To</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {importPreview.map((item) => (
                    <tr key={item.id} className="hover:bg-accent">
                      <td className="px-4 py-2">
                        {item.mapped ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-warning" />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <p className="line-clamp-2 text-sm">
                          {item.itemType === 'concept' 
                            ? (item.displayName || item.name)
                            : (item.text || item.stem)}
                        </p>
                      </td>
                      <td className="px-4 py-2">
                        {item.mapped ? (
                          <Badge variant="secondary" className="text-xs">
                            {item.itemType === 'concept' 
                              ? `Concept: ${item.domain}` 
                              : (item.conceptName || item.concepts?.join(', '))}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Manual mapping required
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {importPreview.filter((i) => !i.mapped).length > 0 && (
                  <span className="text-warning">
                    {importPreview.filter((i) => !i.mapped).length} items need manual mapping
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmImport}>
                  Confirm Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Imports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Imports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Pharmacy Calculations LOs', date: '2 days ago', count: 45 },
              { name: 'Cardiology MCQs', date: '1 week ago', count: 120 },
              { name: 'ID Antibiotics Deck', date: '2 weeks ago', count: 78 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.count} items · {item.date}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
