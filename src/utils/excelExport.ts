import * as XLSX from 'xlsx';
import { PipelineData } from '../types/pipeline';
import { Initiative } from '../types/initiative';
import { getFiscalQuarter } from './fiscalUtils';

interface ExcelExportOptions {
  sheetName?: string;
  fileName?: string;
}

export function exportOpportunitiesToExcel(
  data: PipelineData[],
  options: ExcelExportOptions = {}
) {
  const {
    sheetName = 'Partner Opportunities',
    fileName = `partner-opportunities-${new Date().toISOString().split('T')[0]}.xlsx`
  } = options;

  // Group data by partner and quarter
  const groupedData = data.reduce((acc, item) => {
    const partner = item.coSellingWith.trim();
    const quarter = getFiscalQuarter(new Date(item.closeDate));
    
    if (!acc[partner]) {
      acc[partner] = {};
    }
    if (!acc[partner][quarter]) {
      acc[partner][quarter] = [];
    }
    acc[partner][quarter].push(item);
    return acc;
  }, {} as Record<string, Record<string, PipelineData[]>>);

  // Create worksheet data
  const wsData: any[][] = [
    ['Partner Pipeline Opportunities'], 
    [],
    ['Partner', 'Quarter', 'Opportunity', 'Amount', 'Close Date', 'Stage', 'Region', 'Account']
  ];

  // Add data rows
  Object.entries(groupedData).forEach(([partner, quarters]) => {
    Object.entries(quarters).forEach(([quarter, opportunities]) => {
      opportunities.forEach((opp, idx) => {
        wsData.push([
          idx === 0 ? partner : '',
          idx === 0 ? quarter : '',
          opp.opportunityName,
          opp.amount,
          new Date(opp.closeDate).toLocaleDateString(),
          opp.stage,
          opp.rsmRegion,
          opp.accountName
        ]);
      });
    });
    // Add empty row between partners
    wsData.push([]);
  });

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Style configuration
  ws['!cols'] = [
    { wch: 30 }, // Partner
    { wch: 15 }, // Quarter
    { wch: 40 }, // Opportunity
    { wch: 15 }, // Amount
    { wch: 12 }, // Close Date
    { wch: 15 }, // Stage
    { wch: 15 }, // Region
    { wch: 30 }, // Account
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Save file
  XLSX.writeFile(wb, fileName);
}

export function exportInitiativesToExcel(
  initiatives: Initiative[],
  options: ExcelExportOptions = {}
) {
  const {
    sheetName = 'Partner Initiatives',
    fileName = `partner-initiatives-${new Date().toISOString().split('T')[0]}.xlsx`
  } = options;

  // Group initiatives by quarter
  const groupedInitiatives = initiatives.reduce((acc, initiative) => {
    if (!acc[initiative.targetQuarter]) {
      acc[initiative.targetQuarter] = [];
    }
    acc[initiative.targetQuarter].push(initiative);
    return acc;
  }, {} as Record<string, Initiative[]>);

  // Create worksheet data
  const wsData: any[][] = [
    ['Partner Initiatives'],
    [],
    [
      'Quarter',
      'Partner',
      'Project',
      'HPE Owner',
      'Partner Owner',
      'HPE Resource',
      'Partner Resource',
      'Role'
    ]
  ];

  // Add data rows
  Object.entries(groupedInitiatives).forEach(([quarter, quarterInitiatives]) => {
    quarterInitiatives
      .sort((a, b) => a.partner.localeCompare(b.partner))
      .forEach((initiative, idx) => {
        wsData.push([
          idx === 0 ? quarter : '',
          initiative.partner,
          initiative.project,
          initiative.hpeOwner,
          initiative.partnerOwner,
          initiative.hpeResource,
          initiative.partnerResource,
          initiative.role
        ]);
      });
    // Add empty row between quarters
    wsData.push([]);
  });

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Style configuration
  ws['!cols'] = [
    { wch: 15 }, // Quarter
    { wch: 30 }, // Partner
    { wch: 40 }, // Project
    { wch: 25 }, // HPE Owner
    { wch: 25 }, // Partner Owner
    { wch: 25 }, // HPE Resource
    { wch: 25 }, // Partner Resource
    { wch: 30 }, // Role
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Save file
  XLSX.writeFile(wb, fileName);
}