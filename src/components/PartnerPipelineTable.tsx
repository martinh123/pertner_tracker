import React, { useMemo } from 'react';
import { usePartnerStore } from '../store/partnerStore';
import { usePipelineStore } from '../store/pipelineStore';
import { getCurrentFiscalQuarters, isDateInFiscalQuarter } from '../utils/fiscalUtils';

interface QuarterlyAmount {
  [quarter: string]: number;
}

interface PartnerGroup {
  partner: string;
  opportunities: number;
  quarterlyAmounts: QuarterlyAmount;
  totalAmount: number;
}

export const PartnerPipelineTable: React.FC = () => {
  const partners = usePartnerStore((state) => state.partners);
  const currentData = usePipelineStore((state) => state.currentData);
  const fiscalQuarters = useMemo(() => getCurrentFiscalQuarters(), []);

  // Create a case-insensitive map of partner names
  const partnerMap = useMemo(() => {
    const map = new Map<string, string>();
    partners.forEach(partner => {
      map.set(partner.name.toLowerCase(), partner.name);
    });
    return map;
  }, [partners]);

  const groupedData = useMemo(() => {
    const groups: { [key: string]: PartnerGroup } = {};
    
    // Initialize groups with partners
    [...partners.map(p => p.name), 'Other'].forEach(partner => {
      groups[partner] = {
        partner,
        opportunities: 0,
        quarterlyAmounts: {},
        totalAmount: 0
      };
      
      // Initialize quarters with 0
      fiscalQuarters.forEach(q => {
        groups[partner].quarterlyAmounts[q.quarter] = 0;
      });
    });

    // Group pipeline data
    currentData.forEach(item => {
      const closeDate = new Date(item.closeDate);
      const partnerNameLower = item.coSellingWith.trim().toLowerCase();
      const targetGroup = partnerMap.get(partnerNameLower) || 'Other';

      if (groups[targetGroup]) {
        groups[targetGroup].opportunities++;
        groups[targetGroup].totalAmount += item.amount;
        
        // Find the matching fiscal quarter for this close date
        const matchingQuarter = fiscalQuarters.find(q => 
          isDateInFiscalQuarter(closeDate, q)
        );
        
        if (matchingQuarter) {
          groups[targetGroup].quarterlyAmounts[matchingQuarter.quarter] += item.amount;
        }
      }
    });

    // Convert to array and sort by total amount
    return Object.values(groups)
      .filter(group => group.opportunities > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [partners, currentData, fiscalQuarters, partnerMap]);

  const totals = useMemo(() => {
    const quarterTotals: QuarterlyAmount = {};
    fiscalQuarters.forEach(q => {
      quarterTotals[q.quarter] = groupedData.reduce(
        (sum, group) => sum + (group.quarterlyAmounts[q.quarter] || 0),
        0
      );
    });

    return {
      opportunities: groupedData.reduce((sum, group) => sum + group.opportunities, 0),
      quarterlyAmounts: quarterTotals,
      totalAmount: groupedData.reduce((sum, group) => sum + group.totalAmount, 0)
    };
  }, [groupedData, fiscalQuarters]);

  if (currentData.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Pipeline by Partner</h2>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opps
                </th>
                {fiscalQuarters.map(q => (
                  <th
                    key={q.quarter}
                    className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {q.quarter}
                  </th>
                ))}
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedData.map((group) => (
                <tr key={group.partner} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">
                    {group.partner}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {group.opportunities}
                  </td>
                  {fiscalQuarters.map(q => (
                    <td
                      key={q.quarter}
                      className="px-4 py-2 text-sm text-gray-900 text-right"
                    >
                      ${(group.quarterlyAmounts[q.quarter] || 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                    ${group.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2 text-sm text-gray-900">
                  Total
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {totals.opportunities}
                </td>
                {fiscalQuarters.map(q => (
                  <td
                    key={q.quarter}
                    className="px-4 py-2 text-sm text-gray-900 text-right"
                  >
                    ${(totals.quarterlyAmounts[q.quarter] || 0).toLocaleString()}
                  </td>
                ))}
                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                  ${totals.totalAmount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};