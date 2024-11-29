import React from 'react';
import { StatsCard } from '../components/StatsCard';
import { PartnerPipelineTable } from '../components/PartnerPipelineTable';
import { PartnerOpportunitiesTable } from '../components/PartnerOpportunitiesTable';
import { ActionNotesList } from '../components/ActionNotesList';
import { ExportButton } from '../components/ExportButton';
import { usePipelineStore } from '../store/pipelineStore';
import { UploadIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const stats = usePipelineStore((state) => state.stats);
  const currentData = usePipelineStore((state) => state.currentData);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline Overview</h1>
          <p className="mt-2 text-sm text-gray-500">
            Track your pipeline metrics and performance
          </p>
        </div>
        {currentData.length > 0 && (
          <ExportButton type="opportunities" data={currentData} />
        )}
      </div>

      {currentData.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No pipeline data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading your pipeline data
          </p>
          <div className="mt-6">
            <Link
              to="/settings"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Pipeline Data
            </Link>
          </div>
        </div>
      ) : (
        <>
          <ActionNotesList />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Pipeline Value"
              value={stats.totalValue}
              change={
                (stats.changeFromLastUpload.totalValue / stats.totalValue) * 100 || 0
              }
              format={(v) => `$${v.toLocaleString()}`}
            />
            <StatsCard
              title="Active Deals"
              value={stats.activeDeals}
              change={
                (stats.changeFromLastUpload.activeDeals / stats.activeDeals) * 100 || 0
              }
            />
            <StatsCard
              title="Average Deal Size"
              value={stats.averageDealSize}
              change={
                (stats.changeFromLastUpload.averageDealSize / stats.averageDealSize) *
                  100 || 0
              }
              format={(v) => `$${v.toLocaleString()}`}
            />
          </div>
          <PartnerPipelineTable />
          <PartnerOpportunitiesTable />
        </>
      )}
    </div>
  );
};