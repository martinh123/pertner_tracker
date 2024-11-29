import React, { useState } from 'react';
import { InitiativeForm } from '../components/InitiativeForm';
import { InitiativeTable } from '../components/InitiativeTable';
import { ExportButton } from '../components/ExportButton';
import { Initiative } from '../types/initiative';
import { useInitiativeStore } from '../store/initiativeStore';

export const Initiatives: React.FC = () => {
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const initiatives = useInitiativeStore((state) => state.initiatives);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Initiatives</h1>
          <p className="mt-2 text-sm text-gray-500">
            Track and manage partner initiatives and projects
          </p>
        </div>
        {initiatives.length > 0 && (
          <ExportButton type="initiatives" data={initiatives} />
        )}
      </div>

      <div className="space-y-8">
        <InitiativeForm
          initiative={editingInitiative}
          onCancel={() => setEditingInitiative(null)}
        />
        <InitiativeTable
          onEdit={setEditingInitiative}
        />
      </div>
    </div>
  );
};