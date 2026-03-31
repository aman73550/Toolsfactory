import express from 'express';
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

/**
 * Tool generation endpoint
 * Admin provides a prompt -> AI generates complete tool
 */
export async function handleGenerateTool(req: express.Request, res: express.Response) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Tool prompt is required' });
    }

    if (prompt.length < 10) {
      return res.status(400).json({ error: 'Prompt is too short. Provide more details.' });
    }

    const systemPrompt = `You are an expert React/TypeScript developer and UI/UX designer.
Generate complete tool code based on user prompts.

Output ONLY valid JSON with this exact structure:
{
  "name": "Tool Name",
  "slug": "kebab-case-slug",
  "description": "200-word description of what the tool does",
  "category": "category-name",
  "component": "import React...",
  "seoTitle": "SEO-optimized title",
  "seoDescription": "160-character SEO description",
  "blogContent": "500-800 words of educational content",
  "faqs": [
    {"question": "Q1?", "answer": "A1 (2-3 sentences)"},
    {"question": "Q2?", "answer": "A2 (2-3 sentences)"}
  ]
}

REQUIREMENTS:
- Use React hooks (useState, useEffect) not class components
- Import from lucide-react for icons
- Use Tailwind CSS for styling (no inline CSS)
- Component must have proper TypeScript types
- Must follow the 60-30-10 color scheme (white, slate-900, indigo-600)
- Include real-time preview/before-after when applicable
- Handle file uploads with proper validation
- Add error handling and user feedback with toast notifications
- Make it production-ready`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 8096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a tool for: ${prompt}`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to generate valid tool structure' });
    }

    const tool = JSON.parse(jsonMatch[0]);

    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'category', 'component', 'seoTitle', 'seoDescription', 'blogContent', 'faqs'];
    for (const field of requiredFields) {
      if (!tool[field]) {
        return res.status(500).json({ error: `Generated tool missing required field: ${field}` });
      }
    }

    res.json({
      success: true,
      tool,
      message: 'Tool generated successfully. Review and save to add to the platform.',
    });
  } catch (error) {
    console.error('Tool generation error:', error);
    res.status(500).json({
      error: 'Failed to generate tool',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Save generated tool to database/config
 */
export async function handleSaveTool(req: express.Request, res: express.Response) {
  try {
    const { tool } = req.body;

    if (!tool || !tool.slug) {
      return res.status(400).json({ error: 'Invalid tool data' });
    }

    // TODO: Save to database or tools-config.json
    // For now, return success
    res.json({
      success: true,
      message: 'Tool saved successfully',
      slug: tool.slug,
    });
  } catch (error) {
    console.error('Tool save error:', error);
    res.status(500).json({ error: 'Failed to save tool' });
  }
}
