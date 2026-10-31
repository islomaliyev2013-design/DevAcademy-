import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Settings, Sliders, Type, AlignLeft } from 'lucide-react';

export function IDESettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="IDE & Editor Settings"
    >
      <div className="space-y-5 text-sm text-slate-700">
        {/* Font Size */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Editor Font Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[12, 14, 16, 18].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, fontSize: size })}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  settings.fontSize === size
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        {/* Tab Size */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Tab Indentation Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[2, 4].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, tabSize: size })}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  settings.tabSize === size
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {size} Spaces
              </button>
            ))}
          </div>
        </div>

        {/* Word Wrap */}
        <div className="flex items-center justify-between py-2 border-t border-slate-200">
          <div>
            <span className="font-semibold text-slate-800">Word Wrap</span>
            <p className="text-xs text-slate-500">Wrap long lines to fit the editor viewport</p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({
                ...settings,
                wordWrap: settings.wordWrap === 'on' ? 'off' : 'on',
              })
            }
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.wordWrap === 'on' ? 'bg-brand-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.wordWrap === 'on' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Minimap */}
        <div className="flex items-center justify-between py-2 border-t border-slate-200">
          <div>
            <span className="font-semibold text-slate-800">Code Minimap</span>
            <p className="text-xs text-slate-500">Show visual miniature code overview on the right</p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({
                ...settings,
                minimap: !settings.minimap,
              })
            }
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.minimap ? 'bg-brand-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.minimap ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Auto Run on Save */}
        <div className="flex items-center justify-between py-2 border-t border-slate-200">
          <div>
            <span className="font-semibold text-slate-800">Auto-Run on Save</span>
            <p className="text-xs text-slate-500">Automatically trigger live preview refresh on Ctrl+S</p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({
                ...settings,
                autoRunOnSave: !settings.autoRunOnSave,
              })
            }
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.autoRunOnSave ? 'bg-brand-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.autoRunOnSave ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
