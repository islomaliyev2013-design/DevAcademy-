import React, { useState, useRef, useEffect } from 'react';
import { askAIMentor, getAIConfigurationStatus } from '../../services/aiMentorService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Loader2,
  Key,
  AlertCircle,
  Settings,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export function AIMentorWidget({
  codeContext = '',
  lessonContext = '',
  htmlCode = '',
  cssCode = '',
  jsCode = '',
  activeTab = 'html',
  className = '',
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      content:
        "Hello! I'm your **DevAcademy AI Coding Mentor**. You can ask me to review your code, explain tricky concepts, spot errors, or suggest CSS improvements. Click any prompt below or type your question!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState(
    () => localStorage.getItem('devacademy_ai_api_key') || ''
  );
  const [configStatus, setConfigStatus] = useState(() => getAIConfigurationStatus());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await askAIMentor({
        message: text,
        codeContext:
          codeContext ||
          `// ACTIVE TAB: ${activeTab.toUpperCase()}\n// HTML:\n${htmlCode}\n\n// CSS:\n${cssCode}\n\n// JAVASCRIPT:\n${jsCode}`,
        lessonContext: lessonContext || `Active Tab: ${activeTab}`,
        history: messages,
        htmlCode,
        cssCode,
        jsCode,
      });

      if (response.success && response.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-' + Date.now(),
            sender: 'assistant',
            content: response.reply,
          },
        ]);
      } else if (response.isUnconfigured) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'unconfigured-' + Date.now(),
            sender: 'assistant',
            isNotice: true,
            setupGuide: response.setupGuide,
            content:
              `⚠️ **AI Mentor Backend Not Configured**\n\n` +
              `An active AI service or API key has not been configured yet. To enable real-time AI code analysis:\n\n` +
              `1. Set \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\` in your \`.env\` file.\n` +
              `2. Deploy the \`ai-mentor\` Supabase Edge Function with your \`AI_API_KEY\`.\n` +
              `3. Or click **Configure AI Key** in the toolbar to enter a development API key.`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          content: `⚠️ **Connection Error**: ${err.message || 'Unable to communicate with the AI service. Please check your network or configuration.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        content:
          "Conversation cleared. How can I help you with your code today?",
      },
    ]);
    setShowClearConfirm(false);
  };

  const handleSaveCustomKey = () => {
    const trimmed = customKeyInput.trim();
    if (trimmed) {
      localStorage.setItem('devacademy_ai_api_key', trimmed);
    } else {
      localStorage.removeItem('devacademy_ai_api_key');
    }
    setConfigStatus(getAIConfigurationStatus());
    setShowSettingsModal(false);
  };

  // Six required pedagogical actions from prompt
  const actionPrompts = [
    { label: 'Explain my code', prompt: 'Please explain how my current code works step by step.' },
    { label: 'Find & explain bugs', prompt: 'Can you analyze my HTML, CSS, and JS to find potential bugs or runtime errors?' },
    { label: 'Improve my code', prompt: 'What improvements or best practices would make this code cleaner and more efficient?' },
    { label: 'Explain a concept', prompt: 'Explain the core programming concepts demonstrated in this project in beginner-friendly terms.' },
    { label: 'Generate example', prompt: 'Generate a small, practical example that extends the current project functionality.' },
    { label: 'HTML & CSS advice', prompt: 'Suggest improvements to the HTML semantic structure and CSS visual styling.' },
  ];

  return (
    <div
      className={`flex flex-col bg-navy-950 text-slate-100 border-l border-slate-800 h-full overflow-hidden select-text ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-navy-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold flex items-center gap-1.5 text-white">
              <span>AI Coding Mentor</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  configStatus.isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
                title={configStatus.isConfigured ? 'AI Service Connected' : 'Configuration Required'}
              />
            </h4>
            <span className="text-[10px] text-slate-400">
              {configStatus.isConfigured ? configStatus.provider : 'Setup required'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Configure AI API Key / Settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-slate-800 transition"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            title="Clear Chat History"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Unconfigured Warning Banner (if not configured) */}
      {!configStatus.isConfigured && (
        <div className="px-3 py-2 bg-amber-950/60 border-b border-amber-800/40 text-amber-200 text-[11px] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AI Backend not configured</span>
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="underline font-semibold text-amber-300 hover:text-white shrink-0"
          >
            Configure
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-navy-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[88%] rounded-xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : msg.isNotice
                  ? 'bg-slate-900 border border-amber-500/40 text-slate-200 rounded-tl-none'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-1">{msg.content}</div>

              {msg.setupGuide && (
                <div className="mt-3 pt-2.5 border-t border-slate-800">
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="w-full py-1.5 px-2 bg-brand-600/20 hover:bg-brand-600/40 border border-brand-500/40 text-brand-300 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition text-[11px]"
                  >
                    <Key className="w-3 h-3" />
                    Configure AI Key / Endpoint
                  </button>
                </div>
              )}

              {msg.sender === 'assistant' && !msg.isNotice && (
                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 transition"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 py-1">
            <div className="w-6 h-6 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span className="italic text-[11px] text-brand-300">
              DevAcademy AI is analyzing your code...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Action Chips */}
      <div className="px-3 py-2 bg-navy-900 border-t border-slate-800">
        <div className="text-[10px] text-slate-400 font-semibold mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-400" />
          <span>Quick Actions:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {actionPrompts.map((item) => (
            <button
              key={item.label}
              onClick={() => handleSend(item.prompt)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-brand-600/30 hover:border-brand-500/50 text-slate-300 hover:text-white border border-slate-700/80 transition whitespace-nowrap disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-navy-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your code..."
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() || isLoading}
          isLoading={isLoading}
          className="bg-brand-600 hover:bg-brand-700 text-white shrink-0 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>

      {/* Clear Chat Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear Chat History"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4 text-slate-800">
          <p className="text-sm">
            Are you sure you want to clear the conversation? All previous questions and AI responses
            will be removed.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmClear}
            >
              Yes, Clear Chat
            </Button>
          </div>
        </div>
      </Modal>

      {/* AI Configuration Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="AI Mentor Configuration"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-slate-800 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Current Status:</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  configStatus.isConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {configStatus.isConfigured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Provider: <strong>{configStatus.provider}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">
              Development API Key (Optional Client Override)
            </label>
            <p className="text-slate-500 text-[11px]">
              If you have an OpenAI or compatible API key, you can paste it here for immediate testing in
              your local browser (stored securely in browser localStorage only):
            </p>
            <input
              type="password"
              value={customKeyInput}
              onChange={(e) => setCustomKeyInput(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2 text-indigo-900">
            <h5 className="font-bold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Backend Deployment Setup:</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-indigo-800 leading-relaxed">
              <li>Configure <code>VITE_SUPABASE_URL</code> in <code>.env</code>.</li>
              <li>Configure <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code>.</li>
              <li>Deploy the edge function: <code>supabase functions deploy ai-mentor</code>.</li>
              <li>Set secret: <code>supabase secrets set AI_API_KEY=your_key</code>.</li>
            </ol>
          </div>

          <div className="flex justify-between items-center pt-2">
            {customKeyInput && (
              <button
                type="button"
                onClick={() => {
                  setCustomKeyInput('');
                  localStorage.removeItem('devacademy_ai_api_key');
                  setConfigStatus(getAIConfigurationStatus());
                }}
                className="text-rose-600 hover:text-rose-700 text-xs font-semibold"
              >
                Remove Key
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettingsModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveCustomKey}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
