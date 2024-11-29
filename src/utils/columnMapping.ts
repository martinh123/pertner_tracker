interface ColumnMap {
  [key: string]: string;
}

export const columnMappings: ColumnMap = {
  'opportunity name': 'opportunityName',
  'amount (converted)': 'amount',
  'close date': 'closeDate',
  'opportunity owner': 'opportunityOwner',
  'co-selling with': 'coSellingWith',
  'rsm region': 'rsmRegion',
  'stage': 'stage',
  'parent region': 'parentRegion',
  'aggregated region': 'aggregatedRegion',
  'account name': 'accountName',
  'registered partner': 'registeredPartner',
  'end-partner': 'endPartner',
  'public cloud target': 'publicCloudTarget',
  'platform target': 'platformTarget',
  'current status': 'currentStatus',
  'fiscal period': 'fiscalPeriod'
};

export function normalizeColumnName(columnName: string): string {
  return columnName.toLowerCase().trim();
}

export function mapColumnToField(columnName: string): string {
  const normalizedName = normalizeColumnName(columnName);
  return columnMappings[normalizedName] || normalizedName;
}