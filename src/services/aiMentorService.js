import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Check if AI Mentor backend or client test key is configured
export function getAIConfigurationStatus() {
  const customKey = localStorage.getItem('devacademy_ai_api_key');
  const customEndpoint = import.meta.env.VITE_AI_ENDPOINT_URL || localStorage.getItem('devacademy_ai_endpoint');

  if (isSupabaseConfigured) {
    return {
      isConfigured: true,
      provider: 'Supabase Edge Function (ai-mentor)',
      mode: 'edge-function',
    };
  }

  if (customKey) {
    return {
      isConfigured: true,
      provider: 'Custom AI API Key (Client Configured)',
      mode: 'direct-key',
    };
  }

  if (customEndpoint) {
    return {
      isConfigured: true,
      provider: 'Custom AI Proxy Endpoint',
      mode: 'proxy',
    };
  }

  return {
    isConfigured: false,
    provider: 'None',
    mode: 'unconfigured',
  };
}

export async function askAIMentor({
  message,
  codeContext = '',
  history = [],
  lessonContext = '',
  htmlCode = '',
  cssCode = '',
  jsCode = '',
}) {
  const status = getAIConfigurationStatus();

  // If Supabase edge function is available:
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-mentor', {
        body: {
          message,
          codeContext: codeContext || `HTML:\n${htmlCode}\n\nCSS:\n${cssCode}\n\nJS:\n${jsCode}`,
          history,
          lessonContext,
        },
      });

      if (!error && data?.reply) {
        return { success: true, reply: data.reply };
      }
      if (error) {
        throw new Error(error.message || 'Supabase AI function error');
      }
    } catch (err) {
      console.error('Supabase edge function call failed:', err);
      throw new Error(`AI Edge Function error: ${err.message}`);
    }
  }

  // If user provided a custom test API key (e.g. OpenAI or Gemini-compatible key in playground settings)
  const clientApiKey = localStorage.getItem('devacademy_ai_api_key');
  if (clientApiKey) {
    try {
      const systemPrompt = `You are DevAcademy AI Mentor, an expert programming instructor and code reviewer.
Guide students patiently with step-by-step hints and readable markdown.
HTML:
${htmlCode || '(empty)'}

CSS:
${cssCode || '(empty)'}

JavaScript:
${jsCode || '(empty)'}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${clientApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map((h) => ({
              role: h.sender === 'user' ? 'user' : 'assistant',
              content: h.content,
            })),
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI API returned HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No response returned from model.';
      return { success: true, reply };
    } catch (err) {
      console.error('Client AI request failed:', err);
      throw err;
    }
  }

  // If no backend is configured, do NOT fake responses - return unconfigured status with setup guide
  return {
    success: false,
    isUnconfigured: true,
    setupGuide: {
      title: 'AI Coding Mentor is not configured',
      description:
        'To use real-time AI assistance, configure a backend service or add a developer API key.',
      steps: [
        'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
        'Deploy the Supabase ai-mentor edge function with your AI_API_KEY.',
        'Or click "Configure AI Key" to provide a local API key for testing during development.',
      ],
    },
  };
}
