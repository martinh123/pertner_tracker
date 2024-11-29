import { Note } from './notes';

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Initiative {
  id: string;
  partner: string;
  project: string;
  targetQuarter: Quarter;
  hpeOwner: string;
  partnerOwner: string;
  hpeResource: string;
  partnerResource: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeWithNotes extends Initiative {
  notes: Note[];
}