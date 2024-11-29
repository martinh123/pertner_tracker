export interface FiscalQuarter {
  quarter: string;
  startDate: Date;
  endDate: Date;
}

export function getFiscalYear(date: Date): number {
  const month = date.getMonth();
  const year = date.getFullYear();
  // If month is November or December, it's part of the next fiscal year
  return month >= 10 ? year + 1 : year;
}

export function getFiscalQuarter(date: Date): string {
  const month = date.getMonth();
  const fiscalYear = getFiscalYear(date);
  
  // Fiscal quarters based on months (0-based):
  // Q1: Nov (10), Dec (11), Jan (0)
  // Q2: Feb (1), Mar (2), Apr (3)
  // Q3: May (4), Jun (5), Jul (6)
  // Q4: Aug (7), Sep (8), Oct (9)
  
  if (month >= 10) { // Nov-Dec
    return `Q1 FY${fiscalYear}`;
  } else if (month >= 7) { // Aug-Oct
    return `Q4 FY${fiscalYear}`;
  } else if (month >= 4) { // May-Jul
    return `Q3 FY${fiscalYear}`;
  } else if (month >= 1) { // Feb-Apr
    return `Q2 FY${fiscalYear}`;
  } else { // Jan
    return `Q1 FY${fiscalYear}`;
  }
}

export function getCurrentFiscalQuarters(): FiscalQuarter[] {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const quarters: FiscalQuarter[] = [];
  
  // Find the start of the current fiscal quarter
  let startMonth: number;
  let startYear = currentYear;
  
  if (currentMonth >= 10) { // Nov-Dec
    startMonth = 10; // November
  } else if (currentMonth >= 7) { // Aug-Oct
    startMonth = 7; // August
  } else if (currentMonth >= 4) { // May-Jul
    startMonth = 4; // May
  } else if (currentMonth >= 1) { // Feb-Apr
    startMonth = 1; // February
  } else { // Jan
    startMonth = 10; // Previous November
    startYear--; // Previous year
  }
  
  // Generate 4 quarters starting from the current quarter
  for (let i = 0; i < 4; i++) {
    const quarterStartMonth = (startMonth + i * 3) % 12;
    const yearOffset = Math.floor((startMonth + i * 3) / 12);
    const quarterYear = startYear + yearOffset;
    
    const startDate = new Date(quarterYear, quarterStartMonth, 1);
    const endDate = new Date(quarterYear, quarterStartMonth + 3, 0);
    
    quarters.push({
      quarter: getFiscalQuarter(startDate),
      startDate,
      endDate
    });
  }
  
  return quarters;
}

// Helper function to check if a date falls within a fiscal quarter
export function isDateInFiscalQuarter(date: Date, quarter: FiscalQuarter): boolean {
  const timestamp = date.getTime();
  return timestamp >= quarter.startDate.getTime() && 
         timestamp <= quarter.endDate.getTime();
}

// Helper function to compare fiscal quarters chronologically
export function compareFiscalQuarters(a: string, b: string): number {
  const [q1, fy1] = a.split(' ');
  const [q2, fy2] = b.split(' ');
  
  // Compare fiscal years first
  const year1 = parseInt(fy1.substring(2));
  const year2 = parseInt(fy2.substring(2));
  
  if (year1 !== year2) {
    return year1 - year2;
  }
  
  // If same year, compare quarters
  const quarterNum1 = parseInt(q1.substring(1));
  const quarterNum2 = parseInt(q2.substring(1));
  
  return quarterNum1 - quarterNum2;
}