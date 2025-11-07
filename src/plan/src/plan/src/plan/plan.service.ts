import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY!
});

@Injectable()
export class PlanService {
  private categories = [
    'History', 'Art & Culture', 'Food', 'Nature', 'Festivals',
    'Shopping', 'Photography', 'Wellness', 'Adventure', 'Nightlife'
  ];

  async getCategories() {
    return this.categories;
  }

  async getAIStory(query: string) {
    if (!query) {
      return { story: 'Please ask a question about Jaipur!' };
    }

    const prompt = `
You are a fun, expert local guide for Jaipur, India. 
Answer this user question in a short, engaging, and personal way (150–200 words max).
Use real facts, legends, and insider tips. End with a follow-up question suggestion.
User question: "${query}"
`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      });
      return { story: completion.choices[0].message.content };
    } catch (error) {
      return { 
        story: 'Sorry, AI is taking a break. Try: "Tell me about Hawa Mahal."' 
      };
    }
  }

  async getPlan(interests: string[]) {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .in('category', interests.length > 0 ? interests : this.categories);

    if (error) return { recommended: [], total: 0 };
    return { recommended: data, total: data.length };
  }

  async addPlace(place: any) {
    const { data, error } = await supabase
      .from('places')
      .insert([place])
      .select();

    if (error) throw error;
    return data[0];
  }
}
