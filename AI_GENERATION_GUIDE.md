# AI Content Generation Guide

## Overview
The AI Content Generation feature allows users to automatically create concepts and practice items from lecture summaries, study notes, or textbook excerpts using Google's Gemini AI.

## Features

### 🤖 AI-Powered Generation
- **Automatic Concept Extraction**: AI identifies core concepts from your text
- **Learning Objectives**: Generates learning objectives for each concept
- **Practice Items**: Creates multiple types of questions:
  - Multiple-choice questions (MCQ)
  - Open-ended recall questions
  - Clinical application scenarios
  - Calculation-based problems
  - True/False questions

### 📝 Input Format
The AI accepts various types of educational content:
- Lecture summaries
- Study notes
- Textbook excerpts
- Course materials
- Clinical case descriptions

### 🔑 API Configuration
- **Demo Mode**: Works without API key using mock data
- **Production Mode**: Requires Google Gemini API key for real AI generation
- Get your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
- API key is stored locally and never sent to external servers

## How It Works

### 1. Submit Content
```markdown
Example Input:

Pharmacokinetics Overview

Pharmacokinetics is the study of how the body affects drugs. 
It encompasses four main processes: Absorption, Distribution, 
Metabolism, and Elimination (ADME).

Absorption: Drugs must cross biological membranes...
Distribution: Once absorbed, drugs distribute...
Metabolism: Primarily occurs in the liver...
Elimination: Drugs are eliminated primarily...
```

### 2. AI Processing
The AI analyzes the content to:
- Identify key concepts and their relationships
- Extract learning objectives
- Generate relevant practice questions
- Map concepts to questions

### 3. Review & Import
- Preview all generated content
- Review concept mappings
- Edit or remove items before import
- Confirm import to add to database

## Generated Content Structure

### Concepts
```typescript
{
  name: "Pharmacokinetics",
  domain: "Pharmacy",
  description: "Study of drug absorption and distribution",
  tags: ["ADME", "Drug Kinetics"],
  learning_objectives: [
    "Explain the four processes of ADME",
    "Calculate pharmacokinetic parameters"
  ]
}
```

### Practice Items
```typescript
{
  stem: "Which enzyme system is primarily responsible for drug metabolism?",
  type: "mcq",
  concepts: ["Drug Metabolism"],
  difficulty: 2,
  explanation: "The cytochrome P450 enzyme system..."
}
```

## Best Practices

### Input Preparation
1. **Clear Structure**: Organize content with headings and paragraphs
2. **Complete Information**: Include definitions, explanations, and examples
3. **Appropriate Length**: 500-3000 words works best
4. **Domain Context**: Specify the subject area for better concept mapping

### Quality Review
1. **Verify Concepts**: Check that extracted concepts are accurate
2. **Review Questions**: Ensure questions align with learning objectives
3. **Check Difficulty**: Validate difficulty levels are appropriate
4. **Update Explanations**: Add or improve explanations as needed

### Integration Tips
1. **Batch Processing**: Submit related content together for better concept relationships
2. **Incremental Import**: Start with small batches to verify quality
3. **Manual Refinement**: Edit generated content before final import
4. **Concept Merging**: Combine duplicate or overlapping concepts

## AI Prompt Engineering (For Production)

### System Prompt Template
The Gemini prompt is embedded in the code:
```text
You are an expert educational content creator. Analyze the following 
lecture summary and generate educational content.

Generate a JSON response with:
- concepts: Array of core concepts with name, domain, and description
- items: Array of practice questions with stem, type, and related concepts

Generate 3-5 core concepts and 5-10 practice items of varying types.
```

### Expected Response Format
```json
{
  "concepts": [
    {
      "name": "string",
      "domain": "string",
      "description": "string",
      "tags": ["string"],
      "learning_objectives": ["string"]
    }
  ],
  "items": [
    {
      "stem": "string",
      "type": "mcq|open|calculation|true_false",
      "choices": ["string"],
      "correct_answer": "string",
      "concepts": ["string"],
      "difficulty": 1-5,
      "explanation": "string"
    }
  ]
}
```

## API Integration (Production)

### Gemini API Call
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(apiKey);
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

const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();
const parsed = JSON.parse(text);
```

### Error Handling
- Invalid API key → Show error message
- Rate limiting → Queue requests
- Parsing errors → Fallback to manual import
- Network errors → Retry with exponential backoff

## Future Enhancements

### Planned Features
1. **Multi-Model Support**: Claude, OpenAI, local models
2. **Custom Prompts**: User-defined generation templates
3. **Batch Processing**: Upload multiple files
4. **PDF Parsing**: Direct PDF import with text extraction
5. **Image Understanding**: Generate questions from diagrams
6. **Citation Extraction**: Automatically add references
7. **Difficulty Calibration**: ML-based difficulty estimation
8. **Concept Relationships**: Auto-generate concept maps

### Advanced Options
- **Question Type Distribution**: Specify % of each question type
- **Difficulty Range**: Target specific difficulty levels
- **Domain Specialization**: Fine-tune for specific medical specialties
- **Language Support**: Multi-language content generation

## Security & Privacy

### Data Handling
- All processing happens client-side when using demo mode
- API keys stored locally using secure browser storage
- Content never stored on external servers
- HIPAA compliance for medical education content

### Best Practices
1. Never commit API keys to version control
2. Use environment variables for production
3. Rotate API keys regularly
4. Monitor API usage and costs
5. Implement rate limiting

## Troubleshooting

### Common Issues

**AI not generating content**
- Check API key is valid
- Verify internet connection
- Check input text length (not too short/long)
- Review error messages in console

**Low quality outputs**
- Improve input text structure
- Add more context and examples
- Specify domain more clearly
- Increase temperature parameter

**Incorrect concept mapping**
- Review and manually adjust mappings
- Provide more explicit concept definitions
- Use consistent terminology in input

## Usage Examples

### Example 1: Pharmacology Lecture
**Input**: 2000-word lecture on cardiovascular drugs
**Output**: 8 concepts, 24 practice items (mix of MCQ, calculation, open-ended)

### Example 2: Clinical Case
**Input**: Patient case study with differential diagnosis
**Output**: 3 concepts (diagnosis, treatment, monitoring), 12 clinical reasoning questions

### Example 3: Textbook Chapter
**Input**: Textbook excerpt on renal physiology
**Output**: 6 concepts, 30 items with detailed explanations

## Metrics & Analytics

Track AI generation effectiveness:
- **Acceptance Rate**: % of generated items kept
- **Edit Frequency**: How often items are modified
- **Performance**: Student accuracy on AI-generated items
- **Efficiency**: Time saved vs. manual creation

## Support & Resources

### Documentation
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Get Gemini API Key](https://aistudio.google.com/app/apikey)
- Prompt Engineering Guide
- Medical Education Best Practices

### Community
- Share successful prompts
- Report quality issues
- Suggest improvements
- Contribute to prompt library
