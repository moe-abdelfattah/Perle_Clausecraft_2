// --- CORE DOCUMENT STRUCTURES --- //

export type DocumentType = 'contract' | 'letter' | 'agreement';
export type ContractPromptType = 'dyno' | 'revo';

export interface DocumentVersion {
  id: number;
  timestamp: string;
  markdown: string;
  versionNumber: number;
  party1: string; // Party1, Sender, etc.
  party2: string; // Party2, Recipient, etc.
  documentDate: string; // YYYYMMDD format
  feedbackSubmitted?: boolean;
  type: DocumentType;
}

export interface DocumentSeries {
    id: number;
    name: string;
    versions: DocumentVersion[];
    type: DocumentType;
}

// --- ASYNC & UI STATE --- //

export interface GenerationSession {
  type: 'new' | 'version';
  model: string;
  documentType: DocumentType;
  prompt?: ContractPromptType;
  originalMarkdown?: string;
  seriesId?: number;
  startTime: number;
  temperature: number;
}

export interface BulkProgress {
    current: number;
    total: number;
}

// --- REDUCER STATE & ACTIONS --- //

export interface AppState {
    documentSeries: DocumentSeries[];
    currentSeriesId: number | null;
    currentVersionId: number | null;
    loadingAction: 'new' | 'version' | 'final' | null;
    error: string;
    progress: number;
    progressStatus: string;
    lastGeneratedVersionId: number | null;
    bulkProgress: BulkProgress | null;
}

export type Action =
  | { type: 'LOAD_HISTORY_FROM_STORAGE' }
  | { type: 'START_GENERATION'; payload: { action: 'new' | 'version' | 'final' } }
  | { type: 'END_GENERATION' }
  | { type: 'GENERATION_SUCCESS'; payload: { type: 'new' | 'version' | 'final', markdowns: string[], docType: DocumentType, seriesId?: number } }
  | { type: 'GENERATION_FAILURE'; payload: { error: string } }
  | { type: 'UPDATE_PROGRESS'; payload: { progress: number; status: string } }
  | { type: 'SET_BULK_PROGRESS'; payload: BulkProgress | null }
  | { type: 'SET_CURRENT_DOCUMENT'; payload: { seriesId?: number; versionId?: number } }
  | { type: 'DELETE_SERIES'; payload: { seriesId: number } }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_FEEDBACK_SUBMITTED'; payload: { versionId: number } };
