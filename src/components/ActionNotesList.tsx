import React from 'react';
import { useNoteStore } from '../store/noteStore';
import { usePipelineStore } from '../store/pipelineStore';
import { useInitiativeStore } from '../store/initiativeStore';
import { AlertCircleIcon } from 'lucide-react';
import { NoteDialog } from './NoteDialog';
import { InitiativeNoteDialog } from './InitiativeNoteDialog';

export const ActionNotesList: React.FC = () => {
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<any>(null);
  const [selectedInitiative, setSelectedInitiative] = React.useState<any>(null);
  const { notes } = useNoteStore();
  const pipelineData = usePipelineStore((state) => state.currentData);
  const initiatives = useInitiativeStore((state) => state.initiatives);

  // Get all notes with actions
  const actionNotes = React.useMemo(() => {
    const allActionNotes: Array<{
      id: string;
      type: 'opportunity' | 'initiative';
      partnerName: string;
      noteContent: string;
      data: any;
    }> = [];

    Object.entries(notes).forEach(([id, noteList]) => {
      noteList.forEach(note => {
        if (note.hasAction) {
          if (note.opportunityId) {
            const opportunity = pipelineData.find(p => p.id === note.opportunityId);
            if (opportunity) {
              allActionNotes.push({
                id: note.id,
                type: 'opportunity',
                partnerName: opportunity.coSellingWith,
                noteContent: note.content,
                data: opportunity
              });
            }
          } else if (note.initiativeId) {
            const initiative = initiatives.find(i => i.id === note.initiativeId);
            if (initiative) {
              allActionNotes.push({
                id: note.id,
                type: 'initiative',
                partnerName: initiative.partner,
                noteContent: note.content,
                data: initiative
              });
            }
          }
        }
      });
    });

    return allActionNotes.sort((a, b) => a.partnerName.localeCompare(b.partnerName));
  }, [notes, pipelineData, initiatives]);

  if (actionNotes.length === 0) {
    return null;
  }

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  };

  // Split notes into two columns
  const midpoint = Math.ceil(actionNotes.length / 2);
  const leftColumnNotes = actionNotes.slice(0, midpoint);
  const rightColumnNotes = actionNotes.slice(midpoint);

  const NoteColumn: React.FC<{ notes: typeof actionNotes }> = ({ notes }) => (
    <div className="flex-1 min-w-0">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Partner
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notes.map((note) => (
            <tr
              key={note.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                if (note.type === 'opportunity') {
                  setSelectedOpportunity(note.data);
                } else {
                  setSelectedInitiative(note.data);
                }
              }}
            >
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                {truncate(note.partnerName, 15)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                {truncate(note.noteContent, 15)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                {note.type === 'opportunity' ? 'Pipeline' : 'Initiative'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircleIcon className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold">Action Required Notes</h2>
      </div>
      <div className="flex gap-6">
        <NoteColumn notes={leftColumnNotes} />
        {rightColumnNotes.length > 0 && <NoteColumn notes={rightColumnNotes} />}
      </div>

      {selectedOpportunity && (
        <NoteDialog
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
      
      {selectedInitiative && (
        <InitiativeNoteDialog
          initiative={selectedInitiative}
          onClose={() => setSelectedInitiative(null)}
        />
      )}
    </div>
  );
};