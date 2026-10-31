import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { DEFAULT_PROJECTS } from '../types';
import { FolderOpen, Plus, Sparkles, Terminal, Code, Layers } from 'lucide-react';

export function TemplatesModal({
  isOpen,
  onClose,
  onLoadTemplate,
  savedProjects = [],
  onLoadSavedProject,
  onDeleteSavedProject,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Templates & Saved Work"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Starter Templates */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Featured Starter Templates</span>
          </h4>

          <div className="grid grid-cols-1 gap-2.5">
            {DEFAULT_PROJECTS.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-400 bg-slate-50/50 hover:bg-brand-50/20 transition flex items-center justify-between gap-4 cursor-pointer group"
                onClick={() => {
                  onLoadTemplate(tmpl);
                  onClose();
                }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition">
                      {tmpl.name}
                    </span>
                    {tmpl.id.includes('python') && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        Python 3.11
                      </span>
                    )}
                    {tmpl.id.includes('frontend') && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 font-semibold">
                        Frontend
                      </span>
                    )}
                    {tmpl.id.includes('fullstack') && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                        Fullstack
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{tmpl.description}</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition"
                >
                  Load Template
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Projects */}
        {savedProjects.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Your Saved Projects ({savedProjects.length})</span>
            </h4>

            <div className="space-y-2">
              {savedProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Saved {new Date(p.updatedAt || p.createdAt).toLocaleString()} • {p.files?.length || 0} files
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        onLoadSavedProject(p);
                        onClose();
                      }}
                    >
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                      onClick={() => onDeleteSavedProject(p.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
