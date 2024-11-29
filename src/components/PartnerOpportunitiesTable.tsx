import React, { useMemo, useState } from 'react';
import { usePartnerStore } from '../store/partnerStore';
import { usePipelineStore } from '../store/pipelineStore';
import { useNoteStore } from '../store/noteStore';
import { formatDate } from '../utils/dateUtils';
import { getFiscalQuarter, compareFiscalQuarters } from '../utils/fiscalUtils';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { NoteDialog } from './NoteDialog';
import { NoteIndicator } from './NoteIndicator';
import { PipelineData } from '../types/pipeline';

interface OpportunityData extends PipelineData {
  displayName: string;
}

interface QuarterlyOpportunities {
  [quarter: string]: OpportunityData[];
}

interface PartnerData {
  partner: string;
  opportunities: QuarterlyOpportunities;
  totalAmount: number;
}

interface QuarterNoteIndicatorProps {
  opportunities: OpportunityData[];
}

const QuarterNoteIndicator: React.FC<QuarterNoteIndicatorProps> = ({ opportunities }) => {
  const getNotesByOpportunityId = useNoteStore((state) => state.getNotesByOpportunityId);
  
  const notesInfo = useMemo(() => {
    let totalNotes = 0;
    let hasAction = false;
    
    opportunities.forEach(opp => {
      const notes = getNotesByOpportunityId(opp.id);
      totalNotes += notes.length;
      if (!hasAction && notes.some(note => note.hasAction)) {
        hasAction = true;
      }
    });
    
    return { totalNotes, hasAction };
  }, [opportunities, getNotesByOpportunityId]);
  
  if (notesInfo.totalNotes === 0) return null;
  
  return (
    <div className={`inline-flex items-center ml-2 ${
      notesInfo.hasAction ? 'text-amber-500' : 'text-blue-500'
    }`}>
      <span className="text-xs">
        ({notesInfo.totalNotes} note{notesInfo.totalNotes !== 1 ? 's' : ''})
      </span>
    </div>
  );
};

export const PartnerOpportunitiesTable: React.FC = () => {
  const partners = usePartnerStore((state) => state.partners);
  const currentData = usePipelineStore((state) => state.currentData);
  const [selectedOpportunity, setSelectedOpportunity] = useState<PipelineData | null>(null);
  const [expandedQuarters, setExpandedQuarters] = useState<Set<string>>(new Set());

  // Create a case-insensitive map of partner names
  const partnerMap = useMemo(() => {
    const map = new Map<string, string>();
    partners.forEach(partner => {
      map.set(partner.name.toLowerCase(), partner.name);
    });
    return map;
  }, [partners]);

  const groupedData = useMemo(() => {
    const groups: { [key: string]: PartnerData } = {};
    
    // Initialize groups with partners
    [...partners.map(p => p.name), 'Other'].forEach(partner => {
      groups[partner] = {
        partner,
        opportunities: {},
        totalAmount: 0
      };
    });

    // Group pipeline data
    currentData.forEach(item => {
      const partnerNameLower = item.coSellingWith.trim().toLowerCase();
      const targetGroup = partnerMap.get(partnerNameLower) || 'Other';
      const quarter = getFiscalQuarter(new Date(item.closeDate));

      if (groups[targetGroup]) {
        if (!groups[targetGroup].opportunities[quarter]) {
          groups[targetGroup].opportunities[quarter] = [];
        }

        groups[targetGroup].opportunities[quarter].push({
          ...item,
          displayName: item.opportunityName.substring(0, 15) + 
                      (item.opportunityName.length > 15 ? '...' : '')
        });

        groups[targetGroup].totalAmount += item.amount;
      }
    });

    // Sort opportunities within each quarter by amount
    Object.values(groups).forEach(group => {
      Object.keys(group.opportunities).forEach(quarter => {
        group.opportunities[quarter].sort((a, b) => b.amount - a.amount);
      });
    });

    // Convert to array and sort by total amount
    return Object.values(groups)
      .filter(group => Object.keys(group.opportunities).length > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [partners, currentData, partnerMap]);

  const toggleQuarter = (quarterKey: string) => {
    setExpandedQuarters(prev => {
      const next = new Set(prev);
      if (next.has(quarterKey)) {
        next.delete(quarterKey);
      } else {
        next.add(quarterKey);
      }
      return next;
    });
  };

  const sortQuarters = (quarters: string[]): string[] => {
    return [...quarters].sort(compareFiscalQuarters);
  };

  if (currentData.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Partner Opportunities Detail</h2>
      <div className="space-y-6">
        {groupedData.map((group) => (
          <div key={group.partner} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {group.partner}
                </h3>
                <span className="text-sm font-medium text-gray-500">
                  Total: ${group.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortQuarters(Object.keys(group.opportunities)).map((quarter) => {
                    const opportunities = group.opportunities[quarter];
                    const quarterTotal = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
                    const isExpanded = expandedQuarters.has(`${group.partner}-${quarter}`);
                    const partnerQuarter = `${group.partner}-${quarter}`;

                    return (
                      <React.Fragment key={quarter}>
                        <tr 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleQuarter(partnerQuarter)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              {isExpanded ? (
                                <ChevronDownIcon className="w-4 h-4 mr-2" />
                              ) : (
                                <ChevronRightIcon className="w-4 h-4 mr-2" />
                              )}
                              <span>{quarter}</span>
                              <QuarterNoteIndicator opportunities={opportunities} />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {opportunities.length} opportunities
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            ${quarterTotal.toLocaleString()}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={3} className="px-0 py-0">
                              <div className="bg-gray-50">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">
                                        Opportunity
                                      </th>
                                      <th className="px-6 py-2 text-right text-xs font-medium text-gray-500">
                                        Amount
                                      </th>
                                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">
                                        Close Date
                                      </th>
                                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">
                                        Stage
                                      </th>
                                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">
                                        Region
                                      </th>
                                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500">
                                        Notes
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {opportunities.map((opp) => (
                                      <tr key={opp.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                          {opp.displayName}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-900 text-right">
                                          ${opp.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-500">
                                          {formatDate(opp.closeDate)}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-500">
                                          {opp.stage}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-500">
                                          {opp.rsmRegion}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-center">
                                          <div className="flex justify-center space-x-2">
                                            <NoteIndicator
                                              opportunityId={opp.id}
                                              onClick={(e) => {
                                                e?.stopPropagation();
                                                setSelectedOpportunity(opp);
                                              }}
                                            />
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedOpportunity(opp);
                                              }}
                                              className="text-gray-400 hover:text-gray-500"
                                            >
                                              Add/Edit
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      
      {selectedOpportunity && (
        <NoteDialog
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </div>
  );
};