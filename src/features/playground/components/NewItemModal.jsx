import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { FilePlus, FolderPlus } from 'lucide-react';

export function NewItemModal({
  isOpen,
  onClose,
  onSubmit,
  type = 'file', // 'file' | 'folder'
  folders = [],
  defaultParentId = null,
}) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(defaultParentId);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setParentId(defaultParentId);
      setError('');
    }
  }, [isOpen, defaultParentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(`Please enter a valid ${type} name`);
      return;
    }

    // Disallow illegal characters
    if (/[\/\\:*?"<>|]/.test(trimmed)) {
      setError('Name contains invalid characters: / \\ : * ? " < > |');
      return;
    }

    onSubmit({
      name: trimmed,
      type,
      parentId: parentId || null,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'file' ? 'Create New File' : 'Create New Folder'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {type === 'file' ? 'File Name (e.g. index.html, main.py, styles.css)' : 'Folder Name (e.g. components, utils)'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder={type === 'file' ? 'main.py' : 'components'}
            autoFocus
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-900"
          />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>

        {folders.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Folder
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
            >
              <option value="">Root directory (/)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name} ({f.path || '/' + f.name})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
            {type === 'file' ? <FilePlus className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
            <span>Create {type === 'file' ? 'File' : 'Folder'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
