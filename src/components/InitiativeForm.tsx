import React, { useEffect, useState } from 'react';
import { useInitiativeStore } from '../store/initiativeStore';
import { usePartnerStore } from '../store/partnerStore';
import { Initiative, Quarter } from '../types/initiative';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';

interface InitiativeFormProps {
  initiative?: Initiative | null;
  onCancel?: () => void;
}

const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];

export const InitiativeForm: React.FC<InitiativeFormProps> = ({
  initiative,
  onCancel,
}) => {
  const partners = usePartnerStore((state) => state.partners);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    partner: '',
    project: '',
    targetQuarter: 'Q1' as Quarter,
    hpeOwner: '',
    partnerOwner: '',
    hpeResource: '',
    partnerResource: '',
    role: '',
  });

  const { addInitiative, updateInitiative } = useInitiativeStore();

  useEffect(() => {
    if (initiative) {
      setFormData({
        partner: initiative.partner,
        project: initiative.project,
        targetQuarter: initiative.targetQuarter,
        hpeOwner: initiative.hpeOwner,
        partnerOwner: initiative.partnerOwner,
        hpeResource: initiative.hpeResource,
        partnerResource: initiative.partnerResource,
        role: initiative.role,
      });
      setIsExpanded(true);
    }
  }, [initiative]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (initiative) {
      updateInitiative(initiative.id, formData);
    } else {
      addInitiative(formData);
    }
    
    setFormData({
      partner: '',
      project: '',
      targetQuarter: 'Q1',
      hpeOwner: '',
      partnerOwner: '',
      hpeResource: '',
      partnerResource: '',
      role: '',
    });
    setIsExpanded(false);
    onCancel?.();
  };

  // Sort partners by name
  const sortedPartners = [...partners].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div 
        className="px-6 py-4 flex justify-between items-center cursor-pointer"
        onClick={() => !initiative && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5 mr-2" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 mr-2" />
          )}
          <h2 className="text-lg font-medium">
            {initiative ? 'Edit Initiative' : 'Add New Initiative'}
          </h2>
        </div>
        {!initiative && !isExpanded && (
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Initiative
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Partner
                </label>
                <select
                  value={formData.partner}
                  onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Partner</option>
                  {sortedPartners.map((partner) => (
                    <option key={partner.id} value={partner.name}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Quarter
                </label>
                <select
                  value={formData.targetQuarter}
                  onChange={(e) => setFormData({ ...formData, targetQuarter: e.target.value as Quarter })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  {QUARTERS.map((quarter) => (
                    <option key={quarter} value={quarter}>
                      {quarter}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  HPE Owner
                </label>
                <input
                  type="text"
                  value={formData.hpeOwner}
                  onChange={(e) => setFormData({ ...formData, hpeOwner: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Partner Owner
                </label>
                <input
                  type="text"
                  value={formData.partnerOwner}
                  onChange={(e) => setFormData({ ...formData, partnerOwner: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  HPE Resource
                </label>
                <input
                  type="text"
                  value={formData.hpeResource}
                  onChange={(e) => setFormData({ ...formData, hpeResource: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Partner Resource
                </label>
                <input
                  type="text"
                  value={formData.partnerResource}
                  onChange={(e) => setFormData({ ...formData, partnerResource: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              {(onCancel || !initiative) && (
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    onCancel?.();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {initiative ? 'Update Initiative' : 'Add Initiative'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};