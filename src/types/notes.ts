import { PipelineData } from './pipeline';
import { Initiative } from './initiative';

export interface Note {
  id: string;
  opportunityId?: string;
  initiativeId?: string;
  content: string;
  hasAction: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteWithOpportunity extends Note {
  opportunity: PipelineData;
}

export interface NoteWithInitiative extends Note {
  initiative: Initiative;
}