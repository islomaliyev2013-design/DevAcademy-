import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, item }) {
  if (!item) return null;

  const isFolder = item.type === 'folder';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${isFolder ? 'Folder' : 'File'}?`}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">
              Are you sure you want to delete <span className="underline">{item.name}</span>?
            </p>
            {isFolder && (
              <p className="mt-1 text-xs text-rose-700">
                Warning: All files and nested items inside this folder will also be permanently deleted.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm(item.id);
              onClose();
            }}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
