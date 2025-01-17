"use client";

import { Eye, Edit2, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActionButtons({ onView, onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onView}
        className="hover:opacity-70"
        data-testid="view-button"
      >
        <Eye className="w-5 h-5 text-kai-primary" />
      </button>
      <button
        onClick={onEdit}
        className="hover:opacity-70"
        data-testid="edit-button"
      >
        <Edit2 className="w-5 h-5 text-kai-primary" />
      </button>
      <button
        onClick={onDelete}
        className="hover:opacity-70"
        data-testid="delete-button"
      >
        <Trash2 className="w-5 h-5 text-kai-primary" />
      </button>
    </div>
  );
}
