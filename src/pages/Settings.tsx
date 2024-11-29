import React from 'react';
import { PartnerList } from '../components/PartnerList';
import { FileUpload } from '../components/FileUpload';
import { DataManagement } from '../components/DataManagement';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your partner list and pipeline data
        </p>
      </div>

      <div className="space-y-8">
        {/* Data Management Section */}
        <DataManagement />

        {/* Pipeline Data Upload Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Pipeline Data Upload</h2>
          <p className="text-sm text-gray-500 mb-6">
            Upload your Excel file containing the latest pipeline data. The file should include all required columns.
          </p>
          <FileUpload />
        </div>

        {/* Partner Management Section */}
        <PartnerList />
      </div>
    </div>
  );
};