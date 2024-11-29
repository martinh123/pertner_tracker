import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { exportOpportunitiesToExcel, exportInitiativesToExcel } from '../utils/excelExport';
import { PipelineData } from '../types/pipeline';
import { Initiative } from '../types/initiative';

interface ExportButtonProps {
  type: 'opportunities' | 'initiatives';
  data: PipelineData[] | Initiative[];
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ type, data, className = '' }) => {
  const handleExport = () => {
    if (type === 'opportunities') {
      exportOpportunitiesToExcel(data as PipelineData[]);
    } else {
      exportInitiativesToExcel(data as Initiative[]);
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      <FileSpreadsheet className="w-4 h-4 mr-2" />
      Export to Excel
    </button>
  );
};