import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note } from '../types/notes';

interface NoteStore {
  notes: { [id: string]: Note[] };
  addNote: (id: string, content: string, hasAction: boolean, type: 'opportunity' | 'initiative') => void;
  updateNote: (noteId: string, content: string, hasAction: boolean) => void;
  deleteNote: (noteId: string) => void;
  getNotesByOpportunityId: (opportunityId: string) => Note[];
  getNotesByInitiativeId: (initiativeId: string) => Note[];
  clearNotes: () => void;
  importNotes: (importedNotes: { [id: string]: Note[] }) => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: {},
      
      addNote: (id, content, hasAction, type) => {
        const note: Note = {
          id: crypto.randomUUID(),
          ...(type === 'opportunity' ? { opportunityId: id } : { initiativeId: id }),
          content,
          hasAction,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          notes: {
            ...state.notes,
            [id]: Array.isArray(state.notes[id]) 
              ? [...state.notes[id], note]
              : [note],
          },
        }));
      },
      
      updateNote: (noteId, content, hasAction) => {
        set((state) => {
          const newNotes = { ...state.notes };
          
          for (const id in newNotes) {
            if (!Array.isArray(newNotes[id])) {
              newNotes[id] = [];
              continue;
            }
            
            const noteIndex = newNotes[id].findIndex(n => n.id === noteId);
            if (noteIndex !== -1) {
              newNotes[id] = [
                ...newNotes[id].slice(0, noteIndex),
                {
                  ...newNotes[id][noteIndex],
                  content,
                  hasAction,
                  updatedAt: new Date().toISOString(),
                },
                ...newNotes[id].slice(noteIndex + 1),
              ];
              break;
            }
          }
          
          return { notes: newNotes };
        });
      },
      
      deleteNote: (noteId) => {
        set((state) => {
          const newNotes = { ...state.notes };
          
          for (const id in newNotes) {
            if (!Array.isArray(newNotes[id])) {
              newNotes[id] = [];
              continue;
            }
            
            const noteIndex = newNotes[id].findIndex(n => n.id === noteId);
            if (noteIndex !== -1) {
              const updatedNotes = [
                ...newNotes[id].slice(0, noteIndex),
                ...newNotes[id].slice(noteIndex + 1),
              ];
              
              if (updatedNotes.length === 0) {
                delete newNotes[id];
              } else {
                newNotes[id] = updatedNotes;
              }
              break;
            }
          }
          
          return { notes: newNotes };
        });
      },
      
      getNotesByOpportunityId: (opportunityId) => {
        const state = get();
        const notes = state.notes[opportunityId] || [];
        return notes.filter(note => note.opportunityId === opportunityId);
      },

      getNotesByInitiativeId: (initiativeId) => {
        const state = get();
        const notes = state.notes[initiativeId] || [];
        return notes.filter(note => note.initiativeId === initiativeId);
      },

      clearNotes: () => set({ notes: {} }),

      importNotes: (importedNotes) => set({ notes: importedNotes }),
    }),
    {
      name: 'notes-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return { notes: {}, ...persistedState };
        }
        return persistedState as NoteStore;
      },
    }
  )
);