import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { invoke } from '@tauri-apps/api/tauri';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function Import() {
  const { toast } = useToast();
  const [learningMaterial, setLearningMaterial] = useState('');
  const [domain, setDomain] = useState('Pharmacy');
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiApiKey, setAiApiKey] = useState('');

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setAiApiKey(savedKey);
    }
  }, []);

  const handleAiGenerate = async () => {
    if (!learningMaterial.trim()) return;
    
    setAiGenerating(true);
    try {
      let generatedConcepts, generatedItems;

      if (aiApiKey && aiApiKey.trim()) {
        const genAI = new GoogleGenerativeAI(aiApiKey);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.0-flash-exp',
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
        });

        const prompt = `You are a high-precision lecture ingestion engine for Justin Sung's SIR (Spaced-Interleaved Retrieval) framework. Transform raw educational material into cognitively optimized, testable learning data.

=== LEARNING MATERIAL ===
${learningMaterial}

=== COGNITIVE FRAMEWORK (GRINDE) ===
• Generate: Identify relationships (causal, comparative, hierarchical)
• Recall: Extract atomic facts for retrieval practice
• Interleave: Link to related/prerequisite topics
• Network: Build schema-level connections
• Distribute: Estimate difficulty (1=simple recall, 5=complex application)

=== EXTRACTION TASKS ===
1. **Core Concepts** (3-5): Extract testable concepts with clear names, descriptions explaining "what" and "why it matters", and relevant tags
2. **Relationships**: Identify hierarchical (topic→subtopic), associative (A↔B), and causal (X→Y) connections
3. **Questions** (10-15): Generate across cognitive levels:
   - Remember (30%): Facts, definitions, terminology
   - Understand (30%): Explanations, comparisons, mechanisms
   - Apply (25%): Clinical scenarios, problem-solving
   - Analyze (15%): Complex reasoning, multi-step problems
4. **Quality Focus**: Prioritize testable, exam-relevant, transferable knowledge. Avoid trivia.

=== OUTPUT FORMAT (JSON) ===
{
  "concepts": [
    {
      "name": "Clear concept name (2-4 words)",
      "domain": "${domain}",
      "description": "Explain what this is and why it matters",
      "tags": ["mechanism", "clinical", "foundational"]
    }
  ],
  "items": [
    {
      "stem": "Clear, testable question (use clinical/applied contexts when possible)",
      "type": "mcq|free-recall",
      "choices": ["A) Plausible option", "B) Correct answer", "C) Common misconception", "D) Related distractor"],
      "correct_answer": "B) Correct answer",
      "explanation": "Detailed explanation reinforcing understanding and connections to other concepts",
      "concepts": ["Related concept names from above"],
      "difficulty": 1-5,
      "cognitive_level": "remember|understand|apply|analyze"
    }
  ]
}

Generate comprehensive output now. Prioritize depth over breadth.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const parsed = JSON.parse(text);

        generatedConcepts = parsed.concepts.map((c: any, i: number) => ({
          id: `concept_${i + 1}`,
          name: c.name,
          domain: c.domain,
          description: c.description,
          tags: c.tags || [],
        }));

        generatedItems = parsed.items.map((item: any, i: number) => ({
          id: `item_${i + 1}`,
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
        toast({
          title: 'API Key Required',
          description: 'Please enter your Google Gemini API key to generate content.',
          variant: 'destructive',
        });
        return;
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

  const handleConfirmImport = async () => {
    try {
      // First, save the learning material
      const learningMaterialRecord = await invoke('create_learning_material', {
        content: learningMaterial,
        domain: domain,
      }) as any;

      // Separate concepts and items from preview
      const concepts = importPreview.filter(item => item.itemType === 'concept');
      const items = importPreview.filter(item => item.itemType === 'item');
      
      console.log(`Importing ${concepts.length} concepts and ${items.length} items`);
      
      const conceptNameToId = new Map();
      
      // Create all concepts
      for (const concept of concepts) {
        const createdConcept = await invoke('create_concept', {
          name: concept.name,
          domain: concept.domain || domain,
        }) as any;
        
        // Update concept with learning material link
        if (concept.description || concept.tags?.length) {
          await invoke('update_concept', {
            concept: {
              ...createdConcept,
              description: concept.description || null,
              subdomain: null,
              tags: concept.tags || [],
              learning_material_id: learningMaterialRecord.id,
              updated_at: new Date().toISOString(),
            }
          });
        }
        
        conceptNameToId.set(concept.name, createdConcept.id);
      }
      
      // Create all items
      for (const item of items) {
        const conceptIds = (item.concepts || [])
          .map((name: string) => conceptNameToId.get(name))
          .filter(Boolean);
        
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
        } else {
          itemType = {
            type: 'free-recall',
            correct_answer: item.correct_answer || '',
          };
        }
        
        await invoke('create_item', {
          stem: item.stem,
          itemType: itemType,
          conceptIds: conceptIds,
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
      setLearningMaterial('');
    } catch (error) {
      console.error('Import error:', error);
      
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to import items',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Learning Material</h1>
        <p className="text-muted-foreground">
          Paste your learning material and AI will generate SIR-optimized practice questions
        </p>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>SIR-Based Learning Material</CardTitle>
          </div>
          <CardDescription>
            Submit lecture notes, textbook excerpts, or study material for SIR question generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="AIza..."
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain/Subject</Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., Pharmacy, Medicine, Biology"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="learning-material">Learning Material</Label>
              <span className="text-xs text-muted-foreground">
                {learningMaterial.length > 0 && (
                  <>
                    {Math.round(learningMaterial.trim().split(/\s+/).length).toLocaleString()} words · {learningMaterial.length.toLocaleString()} chars
                  </>
                )}
              </span>
            </div>
            <textarea
              id="learning-material"
              value={learningMaterial}
              onChange={(e) => setLearningMaterial(e.target.value)}
              className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y overflow-y-auto font-mono leading-relaxed"
              placeholder="Paste your learning material here...&#10;&#10;Example:&#10;&#10;Pharmacokinetics Overview&#10;&#10;Pharmacokinetics is the study of how the body affects drugs through Absorption, Distribution, Metabolism, and Elimination (ADME).&#10;&#10;Absorption: Drugs cross biological membranes. Factors include lipid solubility, pH, and blood flow.&#10;&#10;Distribution: Drugs distribute throughout the body. Volume of distribution (Vd) indicates apparent space.&#10;&#10;Metabolism: Occurs in the liver via Phase I (oxidation, reduction) and Phase II (conjugation) reactions. CYP450 is crucial.&#10;&#10;Elimination: Primarily through renal and biliary routes. Clearance (Cl) = volume of plasma cleared per unit time."
            />
            <p className="text-xs text-muted-foreground">
              💡 Tip: Include clear headings, detailed explanations, and examples for best results.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              SIR Framework - What Will Be Generated:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Core concepts extracted from your material</li>
              <li>Questions testing different cognitive levels</li>
              <li>Spaced retrieval scheduling (1-2 days, 3-5 days, 7-10 days, 14+ days)</li>
              <li>Interleaving support for mixing related topics</li>
              <li>Metacognitive reflection prompts</li>
              <li>Flexible, transferable knowledge building</li>
            </ul>
          </div>

          <Button 
            onClick={handleAiGenerate} 
            disabled={!learningMaterial.trim() || !aiApiKey.trim() || aiGenerating}
            className="w-full gap-2"
          >
            {aiGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate SIR Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {showPreview && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Import Preview</CardTitle>
                <CardDescription>
                  Review concepts and questions before importing
                </CardDescription>
              </div>
              <Badge variant="outline">
                {importPreview.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-auto rounded-lg border">
              <table className="w-full">
                <thead className="sticky top-0 border-b bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Content</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {importPreview.map((item) => (
                    <tr key={item.id} className="hover:bg-accent">
                      <td className="px-4 py-2">
                        <Badge variant={item.itemType === 'concept' ? 'default' : 'secondary'}>
                          {item.itemType}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <p className="line-clamp-2 text-sm">
                          {item.itemType === 'concept' 
                            ? item.name
                            : item.stem}
                        </p>
                      </td>
                      <td className="px-4 py-2">
                        {item.itemType === 'concept' ? (
                          <span className="text-sm text-muted-foreground">{item.domain}</span>
                        ) : (
                          <Badge variant="outline">{item.type}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {importPreview.filter(i => i.itemType === 'concept').length} concepts · {importPreview.filter(i => i.itemType === 'item').length} questions
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmImport}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
