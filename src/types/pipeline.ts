export interface PipelineData {
  id: string;
  opportunityName: string;
  amount: number;
  closeDate: string;
  opportunityOwner: string;
  coSellingWith: string;
  rsmRegion: string;
  stage: string;
  parentRegion: string;
  aggregatedRegion: string;
  accountName: string;
  registeredPartner: string;
  endPartner: string;
  publicCloudTarget: string;
  platformTarget: string;
  currentStatus: string;
  fiscalPeriod: string;
  uploadDate: string;
}

export interface PipelineStats {
  totalValue: number;
  activeDeals: number;
  averageDealSize: number;
  changeFromLastUpload: {
    totalValue: number;
    activeDeals: number;
    averageDealSize: number;
  };
}