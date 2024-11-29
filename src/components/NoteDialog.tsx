import React, { useState } from 'react';
import { useNoteStore } from '../store/noteStore';
import { PipelineData } from '../types/pipeline';
import { XIcon, TrashIcon } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface NoteDialogProps {
  opportunity: PipelineData;
  onClose: () => void;
}

export const NoteDialog: React.FC<NoteDialogProps> = ({ opportunity, onClose }) => {
  const { addNote, updateNote, deleteNote } = useNoteStore();
  const notes = useNoteStore((state) => state.getNotesByOpportunityId(opportunity.id));
  
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [hasAction, setHasAction] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNote) {
      updateNote(editingNote, content, hasAction);
    } else {
      addNote(opportunity.id, content, hasAction);
    }
    
    setEditingNote(null);
    setContent('');
    setHasAction(false);
  };

  const handleEdit = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setContent(note.content);
      setHasAction(note.hasAction);
    }
  };

  const handleDelete = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
      if (editingNote === noteId) {
        setEditingNote(null);
        setContent('');
        setHasAction(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingNote(null);
    setContent('');
    setHasAction(false);
  };

  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">
            Notes for {opportunity.opportunityName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {/* Note Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your note here..."
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasAction}
                  onChange={(e) => setHasAction(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">
                  This note requires action
                </span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              {editingNote && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {editingNote ? 'Update Note' : 'Add Note'}
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Previous Notes</h4>
            {sortedNotes.length === 0 ? (
              <p className="text-sm text-gray-500">No notes yet</p>
            ) : (
              sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border ${
                    note.hasAction ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500">
                      {formatDate(note.createdAt)}
                      {note.updatedAt !== note.createdAt && ' (edited)'}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(note.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{note.content}</div>
                  {note.hasAction && (
                    <div className="mt-2 text-xs font-medium text-amber-600">
                      Action Required
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};