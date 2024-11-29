import React, { useState } from 'react';
import { useInitiativeStore } from '../store/initiativeStore';
import { useNoteStore } from '../store/noteStore';
import { Initiative } from '../types/initiative';
import { Edit2Icon, TrashIcon, MoreHorizontalIcon, MessageSquarePlusIcon } from 'lucide-react';
import { InitiativeNoteDialog } from './InitiativeNoteDialog';
import { NoteIndicator } from './NoteIndicator';

interface InitiativeTableProps {
  onEdit: (initiative: Initiative) => void;
}

export const InitiativeTable: React.FC<InitiativeTableProps> = ({ onEdit }) => {
  const initiatives = useInitiativeStore((state) => state.initiatives);
  const deleteInitiative = useInitiativeStore((state) => state.deleteInitiative);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Quarter
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HPE Owner
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Notes
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initiatives.map((initiative) => (
              <React.Fragment key={initiative.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {initiative.partner}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {initiative.project}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {initiative.targetQuarter}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {initiative.hpeOwner}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <NoteIndicator
                        id={initiative.id}
                        type="initiative"
                        onClick={() => setSelectedInitiative(initiative)}
                      />
                      <button
                        onClick={() => setSelectedInitiative(initiative)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Add/Edit Notes"
                      >
                        <MessageSquarePlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-1">
                      <button
                        onClick={() => onEdit(initiative)}
                        className="p-1 text-blue-600 hover:text-blue-900"
                      >
                        <Edit2Icon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteInitiative(initiative.id)}
                        className="p-1 text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedRow(expandedRow === initiative.id ? null : initiative.id)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                      >
                        <MoreHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === initiative.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-4 py-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Partner Owner:</span>{' '}
                          <span className="text-gray-900">{initiative.partnerOwner}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Partner Resource:</span>{' '}
                          <span className="text-gray-900">{initiative.partnerResource}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">HPE Resource:</span>{' '}
                          <span className="text-gray-900">{initiative.hpeResource}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Role:</span>{' '}
                          <span className="text-gray-900">{initiative.role}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {selectedInitiative && (
        <InitiativeNoteDialog
          initiative={selectedInitiative}
          onClose={() => setSelectedInitiative(null)}
        />
      )}
    </div>
  );
};