/**
 * WebAssembly Python Execution Engine for DevAcademy IDE
 * Powered by Pyodide (Python 3.11 in the browser)
 */

let pyodideInstance = null;
let pyodideLoadingPromise = null;

export async function initPyodide(onProgress) {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadingPromise) return pyodideLoadingPromise;

  pyodideLoadingPromise = new Promise(async (resolve, reject) => {
    try {
      if (onProgress) onProgress('Loading Pyodide WebAssembly script...');

      // Check if pyodide script is already present
      if (!window.loadPyodide) {
        await new Promise((res, rej) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
          script.async = true;
          script.onload = () => res();
          script.onerror = (e) => rej(new Error('Failed to load Pyodide script from CDN. Ensure internet connection is available.'));
          document.head.appendChild(script);
        });
      }

      if (onProgress) onProgress('Initializing Python 3.11 environment...');

      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
      });

      pyodideInstance = pyodide;
      if (onProgress) onProgress('Python WebAssembly runtime is ready!');
      resolve(pyodide);
    } catch (err) {
      pyodideLoadingPromise = null;
      reject(err);
    }
  });

  return pyodideLoadingPromise;
}

export function isPyodideReady() {
  return !!pyodideInstance;
}

/**
 * Execute Python code within Pyodide with virtual filesystem sync
 */
export async function runPythonCode({
  code,
  projectFiles = [],
  entryFileName = 'main.py',
  onStdout,
  onStderr,
  onStatus,
}) {
  const startTime = performance.now();

  try {
    if (onStatus) onStatus('Initializing Python runtime...');
    const pyodide = await initPyodide((msg) => onStatus && onStatus(msg));

    // Redirect stdout and stderr
    pyodide.setStdout({
      batched: (text) => {
        if (onStdout) onStdout(text);
      },
    });

    pyodide.setStderr({
      batched: (text) => {
        if (onStderr) onStderr(text);
      },
    });

    // Sync all files from the project into Pyodide virtual filesystem
    if (pyodide.FS) {
      projectFiles.forEach((file) => {
        if (file.type === 'file' && file.content !== undefined) {
          try {
            // Write to root of Pyodide FS
            pyodide.FS.writeFile(file.name, file.content);
          } catch (e) {
            console.warn('Could not sync file to Pyodide FS:', file.name, e);
          }
        }
      });
    }

    if (onStatus) onStatus(`Running ${entryFileName}...`);

    // Execute Python code
    const result = await pyodide.runPythonAsync(code);
    const durationMs = Math.round(performance.now() - startTime);

    return {
      success: true,
      result: result !== undefined ? String(result) : null,
      durationMs,
    };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = error?.message || String(error);

    if (onStderr) {
      onStderr(errorMessage);
    }

    return {
      success: false,
      error: errorMessage,
      durationMs,
    };
  }
}
