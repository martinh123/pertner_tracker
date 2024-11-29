export interface Partner {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  dateAdded: string;
}

export interface PipelineData {
  id: string;
  partnerId: string;
  projectName: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  uploadDate: string;
}

export interface PipelineStats {
  totalValue: number;
  activePartners: number;
  averageDealSize: number;
  changeFromLastUpload: {
    totalValue: number;
    activePartners: number;
    averageDealSize: number;
  };
}