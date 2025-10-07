# Google Gemini AI Integration Guide

## Quick Start

### 1. Get Your API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (starts with `AIza...`)

### 2. Use in GapFinder AI
1. Navigate to **Import & Generate** page
2. Click the **AI Generate** tab
3. Paste your API key in the "Google Gemini API Key" field
4. Paste your lecture summary or study notes
5. Click "Generate Content with AI"
6. Review and import the generated content

## Features

### ✅ What's Included
- **Gemini 2.5 Flash** model integration
- JSON mode for structured output
- Automatic concept extraction
- Practice item generation (MCQ, open-ended, calculations)
- Demo mode (works without API key)

### 🎯 Configuration
```typescript
model: 'gemini-2.5-flash'
temperature: 0.7
topP: 0.95
topK: 40
maxOutputTokens: 8192
responseMimeType: 'application/json'
```

## Demo vs Production Mode

### Demo Mode (No API Key)
- Uses mock data
- 2-second simulation delay
- Generates 3 concepts + 3 items
- Good for testing UI

### Production Mode (With API Key)
- Real Gemini AI generation
- Analyzes actual content
- Generates 3-5 concepts + 5-10 items
- Varies based on input complexity

## API Costs

**Gemini 2.5 Flash Pricing** (as of 2025):
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- **Very affordable** for educational use

### Example Costs
- 1000-word lecture summary: ~$0.001-0.003 per generation
- 100 generations: ~$0.10-0.30
- Much cheaper than OpenAI GPT-4

## Prompt Engineering

### Current Prompt
```
You are an expert educational content creator. Analyze the following 
lecture summary and generate educational content.

Lecture Summary:
{user_input}

Generate a JSON response with this exact structure:
{
  "concepts": [
    {
      "name": "concept name",
      "domain": "subject area",
      "description": "brief description"
    }
  ],
  "items": [
    {
      "stem": "question text",
      "type": "mcq|open|calculation|true_false",
      "concepts": ["related concept names"]
    }
  ]
}

Generate 3-5 core concepts and 5-10 practice items of varying types.
```

### Tips for Better Results
1. **Structured Input**: Use clear headings and paragraphs
2. **Include Examples**: Add specific examples in your notes
3. **Specify Domain**: Mention the subject area explicitly
4. **Add Context**: Include prerequisite knowledge or relationships

## Code Structure

### Installation
```bash
npm install @google/generative-ai
```

### Import
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
```

### Initialize
```typescript
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
```

### Generate
```typescript
const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();
const parsed = JSON.parse(text);
```

## Troubleshooting

### Common Issues

**"API key not valid"**
- Verify key starts with `AIza`
- Check for extra spaces
- Generate new key if needed

**"Quota exceeded"**
- Free tier: 15 requests/minute, 1500/day
- Upgrade to paid tier if needed
- Add rate limiting in code

**"Invalid JSON response"**
- Gemini might add markdown code blocks
- Strip ```json and ``` if present
- Add error handling for malformed JSON

**"Empty or poor quality results"**
- Input too short (< 200 words)
- Input lacks structure
- Too vague or generic content
- Try more specific, detailed notes

### Error Handling in Code
```typescript
try {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Remove markdown code blocks if present
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  const parsed = JSON.parse(text);
  // ... process parsed data
} catch (error) {
  console.error('Gemini API Error:', error);
  // Fallback to demo mode or show error
}
```

## Best Practices

### Security
- ✅ Store API key in local state only
- ✅ Never commit keys to git
- ✅ Use environment variables in production
- ✅ Implement key rotation

### Performance
- ⚡ Cache recent generations
- ⚡ Debounce API calls
- ⚡ Show loading states
- ⚡ Batch similar requests

### Quality
- ✨ Review AI outputs before import
- ✨ Edit generated content as needed
- ✨ Provide feedback for improvement
- ✨ Track accuracy metrics

## Advanced Features

### Custom Models
Change model to:
- `gemini-2.5-pro` (more capable, higher cost)
- `gemini-2.5-flash-lite` (faster, lower quality)
- `gemini-2.0-flash` (previous generation)

### Streaming Responses
```typescript
const result = await model.generateContentStream(prompt);
for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  console.log(chunkText);
}
```

### Multi-turn Conversations
```typescript
const chat = model.startChat({
  history: [
    { role: "user", parts: [{ text: "Explain pharmacokinetics" }] },
    { role: "model", parts: [{ text: "Pharmacokinetics is..." }] },
  ],
});

const result = await chat.sendMessage("Now generate practice questions");
```

## Migration from OpenAI

### Key Differences
| Feature | OpenAI | Gemini |
|---------|--------|--------|
| SDK | `openai` | `@google/generative-ai` |
| Model | `gpt-4-turbo` | `gemini-1.5-flash` |
| JSON Mode | `response_format` | `responseMimeType` |
| Cost | Higher | Lower |
| Rate Limits | Stricter | More generous (free tier) |

### Code Changes
```typescript
// OpenAI (old)
const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  response_format: { type: "json_object" },
  messages: [...]
});

// Gemini (new)
const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();
```

## Support

### Resources
- [Gemini API Docs](https://ai.google.dev/docs)
- [API Pricing](https://ai.google.dev/pricing)
- [Model Comparison](https://ai.google.dev/models/gemini)
- [Best Practices](https://ai.google.dev/gemini-api/docs/prompting-strategies)

### Getting Help
1. Check console for error messages
2. Review API quota in Google AI Studio
3. Test with demo mode first
4. Validate input format and length
