import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  format?: (value: number) => string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  format = (v) => v.toLocaleString(),
}) => {
  const isPositive = change > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{format(value)}</p>
        <span
          className={`ml-2 flex items-center text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};