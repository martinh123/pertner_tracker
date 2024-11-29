import React, { useState } from 'react';
import { Download, Upload, Trash2, History } from 'lucide-react';
import { usePartnerStore } from '../store/partnerStore';
import { usePipelineStore } from '../store/pipelineStore';
import { useInitiativeStore } from '../store/initiativeStore';
import { useNoteStore } from '../store/noteStore';

interface DataSnapshot {
  timestamp: string;
  partners: any[];
  pipelineData: any[];
  initiatives: any[];
  notes: { [key: string]: any[] };
}

export const DataManagement: React.FC = () => {
  const partners = usePartnerStore((state) => state.partners);
  const { currentData: pipelineData } = usePipelineStore();
  const initiatives = useInitiativeStore((state) => state.initiatives);
  const { notes, importNotes } = useNoteStore();
  const clearPartners = usePartnerStore((state) => state.clearPartners);
  const clearPipeline = usePipelineStore((state) => state.clearData);
  const clearInitiatives = useInitiativeStore((state) => state.clearInitiatives);
  const clearNotes = useNoteStore((state) => state.clearNotes);

  const [lastSnapshot, setLastSnapshot] = useState<DataSnapshot | null>(null);

  const createSnapshot = (): DataSnapshot => ({
    timestamp: new Date().toISOString(),
    partners: [...partners],
    pipelineData: [...pipelineData],
    initiatives: [...initiatives],
    notes: { ...notes }
  });

  const handleExport = () => {
    const data = {
      _comment: `This data was exported from the Partner Pipeline Tracker on Bolt: ${window.location.href}`,
      partners,
      pipelineData,
      initiatives,
      notes,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create snapshot before import
    setLastSnapshot(createSnapshot());

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.partners || !data.pipelineData || !data.initiatives || !data.notes) {
          throw new Error('Invalid data format');
        }

        // Import data into stores
        usePartnerStore.setState({ partners: data.partners });
        usePipelineStore.getState().uploadData(data.pipelineData);
        useInitiativeStore.setState({ initiatives: data.initiatives });
        importNotes(data.notes);

        alert('Data imported successfully');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleRollback = () => {
    if (!lastSnapshot) {
      alert('No rollback point available');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to roll back to the previous state? This will undo all changes since the last import.'
    );

    if (confirmed) {
      usePartnerStore.setState({ partners: lastSnapshot.partners });
      usePipelineStore.getState().uploadData(lastSnapshot.pipelineData);
      useInitiativeStore.setState({ initiatives: lastSnapshot.initiatives });
      importNotes(lastSnapshot.notes);
      setLastSnapshot(null);
      alert('Successfully rolled back to previous state');
    }
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all data? This action cannot be undone. Please export your data first if you want to keep a backup.'
    );

    if (confirmed) {
      // Create snapshot before clearing
      setLastSnapshot(createSnapshot());
      
      clearPartners();
      clearPipeline();
      clearInitiatives();
      clearNotes();
      alert('All data has been cleared successfully');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Data Management</h2>
      <p className="text-sm text-gray-500 mb-6">
        Export your current data for backup, import previously exported data, or clear all data.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
        
        <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Import Data
          <input
            type="file"
            className="hidden"
            accept=".json"
            onChange={handleImport}
          />
        </label>

        <button
          onClick={handleRollback}
          disabled={!lastSnapshot}
          className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
            lastSnapshot
              ? 'border-transparent text-white bg-yellow-600 hover:bg-yellow-700'
              : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
        >
          <History className="w-4 h-4 mr-2" />
          Rollback Changes
        </button>

        <button
          onClick={handleClearData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All Data
        </button>
      </div>

      {lastSnapshot && (
        <div className="mt-4 text-sm text-gray-500">
          Rollback point available from: {new Date(lastSnapshot.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
};