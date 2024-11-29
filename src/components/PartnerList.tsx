import React, { useState } from 'react';
import { PlusIcon, Edit2Icon, TrashIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { usePartnerStore } from '../store/partnerStore';
import { Partner } from '../types';

export const PartnerList: React.FC = () => {
  const { partners, addPartner, updatePartner, deletePartner } = usePartnerStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Partner>>({
    name: '',
    category: '',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;

    if (isEditing && isEditing !== 'new') {
      updatePartner(isEditing, formData);
    } else {
      addPartner(formData as Omit<Partner, 'id' | 'dateAdded'>);
    }
    setIsEditing(null);
    setFormData({ name: '', category: '', status: 'active' });
  };

  const handleEdit = (partner: Partner) => {
    setIsEditing(partner.id);
    setFormData({
      name: partner.name,
      category: partner.category,
      status: partner.status
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ name: '', category: '', status: 'active' });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Partners</h2>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing('new')}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Partner
            </button>
          )}
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Partner Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="focus">Focus</option>
                <option value="incubate">Incubate</option>
                <option value="reference">Reference</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing === 'new' ? 'Add Partner' : 'Update Partner'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="p-3 hover:bg-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{partner.name}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {partner.category}
                    </span>
                    <span className={`inline-flex items-center text-xs ${
                      partner.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {partner.status === 'active' ? (
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircleIcon className="w-3 h-3 mr-1" />
                      )}
                      {partner.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleEdit(partner)}
                  className="p-1 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
                >
                  <Edit2Icon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deletePartner(partner.id)}
                  className="p-1 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {partners.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              No partners added yet. Click the "Add Partner" button to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};