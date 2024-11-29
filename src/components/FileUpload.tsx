import React, { useState } from 'react';
import { UploadIcon, AlertCircleIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { usePipelineStore } from '../store/pipelineStore';
import { PipelineData } from '../types/pipeline';
import { mapColumnToField } from '../utils/columnMapping';
import { parseExcelDate } from '../utils/dateUtils';

export const FileUpload: React.FC = () => {
  const uploadData = usePipelineStore((state) => state.uploadData);
  const [error, setError] = useState<string | null>(null);

  const processExcelData = (jsonData: any[]): PipelineData[] => {
    return jsonData.map((row: any) => {
      const processedRow: any = {};
      
      // Process each field in the row
      Object.entries(row).forEach(([key, value]) => {
        const fieldName = mapColumnToField(key);
        
        if (fieldName === 'amount') {
          // Remove currency symbols and convert to number
          const numericValue = typeof value === 'string' 
            ? Number(value.replace(/[^0-9.-]+/g, ''))
            : Number(value);
          processedRow[fieldName] = Math.round(numericValue); // Remove decimals
        } else if (fieldName === 'closeDate') {
          processedRow[fieldName] = parseExcelDate(value as string);
        } else {
          processedRow[fieldName] = value;
        }
      });

      return {
        ...processedRow,
        id: crypto.randomUUID(),
        uploadDate: new Date().toISOString(),
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const pipelineData = processExcelData(jsonData);
          uploadData(pipelineData);
        } catch (err) {
          setError('Error processing file. Please check the file format.');
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Error reading file. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-8 h-8 mb-4 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls)</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />
      </label>
      {error && (
        <div className="mt-4 flex items-center text-red-600">
          <AlertCircleIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};