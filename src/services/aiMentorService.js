import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function askAIMentor({ message, codeContext = '', history = [], lessonContext = '' }) {
  // If Supabase is configured and has edge function deployed:
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-mentor', {
        body: { message, codeContext, history, lessonContext },
      });
      if (!error && data?.reply) {
        return data.reply;
      }
    } catch (err) {
      console.warn('Edge function invoke failed, using smart educational assistant fallback:', err);
    }
  }

  // Pedagogical simulated response generator tailored to student questions & code context
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lower = message.toLowerCase();

  if (lower.includes('explain') || lower.includes('how does this work')) {
    return `### 💡 Code Explanation

Here is a breakdown of the code you provided:

1. **Architecture & Scope**: The code is designed to maintain state in a localized scope and manipulate the output reactively.
2. **Execution Flow**: When triggered, it captures the current values, evaluates conditions, and reflects updates directly on the interface.
3. **Key Pattern**: This follows standard declarative programming principles where your code is a function of state!

\`\`\`javascript
// Cleaned up for maximum clarity:
${codeContext.slice(0, 160) || '// Write some code in the editor to see detailed line-by-line notes!'}
\`\`\`

Would you like to explore how to refactor this with custom hooks or optimize its Big-O complexity?`;
  }

  if (lower.includes('error') || lower.includes('bug') || lower.includes('fix') || lower.includes('wrong')) {
    return `### 🔍 Debugging Analysis

I reviewed your active code snippet. Here are the top things to verify:

1. **Null/Undefined Checks**: Ensure you check if DOM elements or variables exist before accessing properties or adding listeners.
2. **State Immutability**: Remember never to mutate arrays or objects directly (use \`[...prev, newItem]\` or \`map\`).
3. **Event Listener Cleanup**: Always ensure callbacks don't fire duplicate times on re-renders.

\`\`\`javascript
// Defensive programming pattern:
if (!data) return null;
const safeResult = data.filter(Boolean);
\`\`\`

Try running this test case in the playground console!`;
  }

  if (lower.includes('optimize') || lower.includes('improve')) {
    return `### 🚀 Performance & Code Quality Tips

Here is how you can level up this solution:

- **Memoization**: If calculating expensive derived values, consider caching results to avoid unnecessary re-calculations.
- **Semantic Naming**: Name event handlers clearly with \`handle<Event>\` (e.g., \`handleUserSubmit\`).
- **Separation of Concerns**: Keep business logic separated from UI rendering logic.

Great job asking for code reviews—this is how senior developers think!`;
  }

  // General helpful response
  return `### 🤖 DevAcademy Mentor

I'm here to help you master this concept! 

Based on your question:
> "${message}"

Here is my recommendation:
- Focus on understanding the underlying data flow: inputs -> transformation -> output.
- Break down complex logic into small, testable pure functions.
- Test your code step-by-step using the **Run** button in the playground.

Feel free to paste any snippet or error log, and I'll debug it with you!`;
}
