import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Edit3 } from 'lucide-react';

export function RenameModal({ isOpen, onClose, onSubmit, item }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setError('');
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name cannot be empty');
      return;
    }

    if (/[\/\\:*?"<>|]/.test(trimmed)) {
      setError('Name contains invalid characters: / \\ : * ? " < > |');
      return;
    }

    onSubmit(item.id, trimmed);
    onClose();
  };

  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rename ${item.type === 'folder' ? 'Folder' : 'File'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            New Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            autoFocus
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-900"
          />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
            <Edit3 className="w-4 h-4" />
            <span>Rename</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
