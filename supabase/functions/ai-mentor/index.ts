// Supabase Edge Function: ai-mentor
// Follows standard Deno HTTP server implementation for Supabase Edge Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, codeContext, history = [], lessonContext } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("AI_API_KEY");
    if (!apiKey) {
      // Graceful fallback for local development when secret has not been configured in Supabase yet
      return new Response(
        JSON.stringify({
          reply: `[DevAcademy AI Mentor]: I analyzed your code! Here is an observation based on what you shared: \n\n\`\`\`javascript\n${codeContext ? codeContext.slice(0, 150) + "..." : "// No code context provided"}\n\`\`\`\n\nTo optimize this solution, ensure you validate edge cases, manage variable scoping cleanly, and avoid unhandled asynchronous errors. Keep up the great coding!`,
          simulated: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare system prompt for pedagogy
    const systemPrompt = `You are DevAcademy Pro AI Mentor, an expert programming instructor. 
Your goal is to guide students to write clean, idiomatic code, explain bugs simply, and provide actionable improvements.
Always format code snippets clearly using markdown.
Lesson Context: ${lessonContext || "General programming assistance"}
Active Code in Editor:
${codeContext ? "```\n" + codeContext + "\n```" : "No code provided"}`;

    // Call AI provider (e.g., Gemini or OpenAI compatible)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.map((h: { sender: string; content: string }) => ({
            role: h.sender === "user" ? "user" : "assistant",
            content: h.content,
          })),
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: `AI provider error: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
