import React from 'react';
import { StickyNoteIcon } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';

interface NoteIndicatorProps {
  id: string;
  type: 'opportunity' | 'initiative';
  onClick?: (e?: React.MouseEvent) => void;
}

export const NoteIndicator: React.FC<NoteIndicatorProps> = ({ id, type, onClick }) => {
  const getNotes = type === 'opportunity' 
    ? useNoteStore((state) => state.getNotesByOpportunityId)
    : useNoteStore((state) => state.getNotesByInitiativeId);
  
  const notes = getNotes(id);
  
  if (notes.length === 0) return null;
  
  const hasActionItems = notes.some(note => note.hasAction);
  
  return (
    <button
      onClick={(e) => {
        e?.stopPropagation();
        onClick?.(e);
      }}
      className={`inline-flex items-center ${
        hasActionItems ? 'text-amber-500' : 'text-blue-500'
      } hover:opacity-75`}
      title={`${notes.length} note${notes.length > 1 ? 's' : ''}${hasActionItems ? ' (Action Required)' : ''}`}
    >
      <StickyNoteIcon className="w-4 h-4" />
      <span className="ml-1 text-xs">{notes.length}</span>
    </button>
  );
};