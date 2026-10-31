import React, { useRef, useState, useEffect } from 'react';
import {
  RotateCw,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  X,
  ShieldCheck,
  Code2,
} from 'lucide-react';

export function PreviewPanel({
  files = [],
  onClose,
  isRunning = false,
  onRefresh,
}) {
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const iframeRef = useRef(null);

  // Build the bundled HTML document from all project files
  const buildPreviewHtml = () => {
    // 1. Locate primary HTML file (index.html or any html file)
    let htmlFile = files.find(
      (f) => f.type === 'file' && f.name.toLowerCase() === 'index.html'
    );
    if (!htmlFile) {
      htmlFile = files.find((f) => f.type === 'file' && f.name.toLowerCase().endsWith('.html'));
    }

    if (!htmlFile) {
      return `<!DOCTYPE html>
<html>
<head><style>body{background:#111827;color:#94a3b8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px;}</style></head>
<body>
  <div>
    <h3>No HTML file found</h3>
    <p>Create an <code>index.html</code> file in the explorer to see the live preview.</p>
  </div>
</body>
</html>`;
    }

    let rawHtml = htmlFile.content || '';

    // Collect all CSS files
    const cssFiles = files.filter(
      (f) =>
        f.type === 'file' &&
        (f.name.endsWith('.css') || f.name.endsWith('.scss'))
    );

    // Collect all JS files
    const jsFiles = files.filter(
      (f) =>
        f.type === 'file' &&
        (f.name.endsWith('.js') || f.name.endsWith('.mjs'))
    );

    // Replace linked stylesheet references with inlined styles
    cssFiles.forEach((cssFile) => {
      const fileNameRegex = new RegExp(
        `<link[^>]+href=["'](\\.\\/)?${cssFile.name}["'][^>]*>`,
        'gi'
      );
      if (fileNameRegex.test(rawHtml)) {
        rawHtml = rawHtml.replace(
          fileNameRegex,
          `<style data-filename="${cssFile.name}">\n${cssFile.content}\n</style>`
        );
      } else {
        // If not explicitly linked, append in head
        rawHtml = rawHtml.replace(
          '</head>',
          `<style data-filename="${cssFile.name}">\n${cssFile.content}\n</style></head>`
        );
      }
    });

    // Replace script src references with inlined script
    jsFiles.forEach((jsFile) => {
      const fileNameRegex = new RegExp(
        `<script[^>]+src=["'](\\.\\/)?${jsFile.name}["'][^>]*>\\s*<\\/script>`,
        'gi'
      );
      if (fileNameRegex.test(rawHtml)) {
        rawHtml = rawHtml.replace(
          fileNameRegex,
          `<script data-filename="${jsFile.name}">\ntry {\n${jsFile.content}\n} catch(err) { console.error(err.message); }\n</script>`
        );
      } else {
        // If not explicitly linked, append before </body>
        rawHtml = rawHtml.replace(
          '</body>',
          `<script data-filename="${jsFile.name}">\ntry {\n${jsFile.content}\n} catch(err) { console.error(err.message); }\n</script></body>`
        );
      }
    });

    // Inject sandbox interceptor for console & errors
    const interceptor = `
  <script>
    (function() {
      function sendLog(level, args) {
        var formatted = Array.prototype.slice.call(args).map(function(arg) {
          if (arg === null) return 'null';
          if (arg === undefined) return 'undefined';
          if (typeof arg === 'object') {
            try { return JSON.stringify(arg, null, 2); } catch(e) { return String(arg); }
          }
          return String(arg);
        }).join(' ');

        window.parent.postMessage({
          type: 'PLAYGROUND_CONSOLE',
          level: level,
          text: formatted
        }, '*');
      }

      var origLog = console.log;
      var origWarn = console.warn;
      var origError = console.error;
      var origInfo = console.info;

      console.log = function() {
        sendLog('log', arguments);
        if (origLog) origLog.apply(console, arguments);
      };
      console.warn = function() {
        sendLog('warn', arguments);
        if (origWarn) origWarn.apply(console, arguments);
      };
      console.error = function() {
        sendLog('error', arguments);
        if (origError) origError.apply(console, arguments);
      };
      console.info = function() {
        sendLog('info', arguments);
        if (origInfo) origInfo.apply(console, arguments);
      };

      window.onerror = function(msg, url, line, col, err) {
        var errText = 'Error on line ' + line + (col ? ':' + col : '') + ': ' + msg;
        window.parent.postMessage({
          type: 'PLAYGROUND_RUNTIME_ERROR',
          text: errText
        }, '*');
        return false;
      };

      window.addEventListener('unhandledrejection', function(event) {
        var reason = event.reason ? (event.reason.message || event.reason) : 'Unknown Promise Rejection';
        window.parent.postMessage({
          type: 'PLAYGROUND_RUNTIME_ERROR',
          text: 'Unhandled Promise Rejection: ' + reason
        }, '*');
      });
    })();
  </script>
`;

    if (rawHtml.includes('<head>')) {
      rawHtml = rawHtml.replace('<head>', `<head>${interceptor}`);
    } else {
      rawHtml = interceptor + rawHtml;
    }

    return rawHtml;
  };

  const updatePreview = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = buildPreviewHtml();
    }
  };

  useEffect(() => {
    updatePreview();
  }, [files]);

  const handleOpenNewTab = () => {
    const htmlContent = buildPreviewHtml();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Viewport width styling
  const getViewportStyle = () => {
    if (viewportMode === 'mobile') return 'max-w-[375px] my-2 shadow-2xl rounded-xl border border-slate-700';
    if (viewportMode === 'tablet') return 'max-w-[768px] my-2 shadow-2xl rounded-xl border border-slate-700';
    return 'w-full h-full';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#181818] border-l border-[#2d2d2d] overflow-hidden">
      {/* Mock Browser Header */}
      <div className="h-9 px-3 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between gap-2 select-none">
        {/* Left: Window Dots & Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <button
            type="button"
            title="Reload Preview"
            onClick={() => {
              updatePreview();
              if (onRefresh) onRefresh();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>

        {/* Center: Simulated URL Bar */}
        <div className="flex-1 max-w-md mx-auto flex items-center gap-2 px-2.5 py-1 bg-[#1e1e1e] rounded-md border border-[#333333] text-[11px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate text-slate-300">
            https://devacademy.local/preview/index.html
          </span>
        </div>

        {/* Right: Viewport Modes & External Link */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center bg-[#1e1e1e] rounded p-0.5 border border-[#333333] mr-1">
            <button
              type="button"
              title="Desktop View (100%)"
              onClick={() => setViewportMode('desktop')}
              className={`p-1 rounded transition ${
                viewportMode === 'desktop'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
            </button>
            <button
              type="button"
              title="Tablet View (768px)"
              onClick={() => setViewportMode('tablet')}
              className={`p-1 rounded transition ${
                viewportMode === 'tablet'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3 h-3" />
            </button>
            <button
              type="button"
              title="Mobile View (375px)"
              onClick={() => setViewportMode('mobile')}
              className={`p-1 rounded transition ${
                viewportMode === 'mobile'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            title="Open Preview in New Tab"
            onClick={handleOpenNewTab}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              type="button"
              title="Close Preview Panel"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Preview Iframe Container */}
      <div className="flex-1 w-full h-full flex justify-center items-stretch overflow-hidden bg-[#121212]">
        <iframe
          ref={iframeRef}
          title="DevAcademy Live Sandbox"
          sandbox="allow-scripts allow-modals allow-same-origin"
          className={`h-full bg-white transition-all duration-200 ${getViewportStyle()}`}
        />
      </div>
    </div>
  );
}
