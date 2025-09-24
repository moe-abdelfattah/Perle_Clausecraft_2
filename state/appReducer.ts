import { parseDocumentDetails } from '../utils/documentParser';
import { sanitizeAndConvertToMarkdown } from '../utils/sanitizer';
import type { AppState, Action, DocumentSeries, DocumentVersion, DocumentType } from './types';

export const initialState: AppState = {
  documentSeries: [],
  currentSeriesId: null,
  currentVersionId: null,
  loadingAction: null,
  error: '',
  progress: 0,
  progressStatus: '',
  lastGeneratedVersionId: null,
  bulkProgress: null,
};

function handleNewDocumentSuccess(state: AppState, markdowns: string[], docType: 'contract' | 'letter' | 'agreement'): AppState {
    const newSeriesList: DocumentSeries[] = [];
    let lastNewVersionId: number | null = null;
    let lastNewSeriesId: number | null = null;
    
    markdowns.forEach((markdown, index) => {
        const timestamp = new Date().toLocaleString();
        const { party1, party2, documentDate, subject } = parseDocumentDetails(markdown, docType);
        
        const newVersion: DocumentVersion = {
            id: Date.now() + index,
            timestamp,
            markdown,
            versionNumber: 1,
            party1,
            party2,
            documentDate,
            subject,
            feedbackSubmitted: false,
            type: docType,
        };
        
        let seriesName: string;
        const typeTranslations: Record<DocumentType, string> = {
            contract: 'عقد',
            letter: 'خطاب',
            agreement: 'اتفاقية'
        };

        const hasParties = party1 !== 'UnknownParty' && party2 !== 'UnknownParty';

        if (docType === 'letter') {
            seriesName = subject !== 'Unknown' 
                ? subject 
                : `${typeTranslations.letter} ${timestamp}`;
        } else if (docType === 'agreement') {
            seriesName = hasParties
                ? `اتفاقية ${party1} و ${party2}`
                : `${typeTranslations.agreement} ${timestamp}`;
        } else { // 'contract'
            seriesName = hasParties
                ? `${party1} vs ${party2}`
                : `${typeTranslations.contract} ${timestamp}`;
        }

        const newSeries: DocumentSeries = {
            id: newVersion.id,
            name: seriesName,
            versions: [newVersion],
            type: docType
        };
        newSeriesList.push(newSeries);
        lastNewVersionId = newVersion.id;
        lastNewSeriesId = newSeries.id;
    });

    const updatedHistory = [...newSeriesList, ...state.documentSeries];
    localStorage.setItem('documentHistory', JSON.stringify(updatedHistory));
    
    return {
        ...state,
        documentSeries: updatedHistory,
        currentSeriesId: lastNewSeriesId,
        currentVersionId: lastNewVersionId,
        lastGeneratedVersionId: lastNewVersionId,
    };
}

function handleNewVersionSuccess(state: AppState, markdowns: string[], targetSeriesId: number): AppState {
    const seriesToUpdate = state.documentSeries.find(s => s.id === targetSeriesId);
    if (!seriesToUpdate) return state;

    const newVersions: DocumentVersion[] = markdowns.map((markdown, index) => {
        const { party1, party2, documentDate, subject } = parseDocumentDetails(markdown, seriesToUpdate.type);
        return {
            id: Date.now() + index,
            timestamp: new Date().toLocaleString(),
            markdown,
            versionNumber: seriesToUpdate.versions.length + index + 1,
            party1,
            party2,
            documentDate,
            subject,
            feedbackSubmitted: false,
            type: seriesToUpdate.type,
        };
    });

    const updatedSeriesList = state.documentSeries.map(series => 
        series.id === targetSeriesId 
            ? { ...series, versions: [...series.versions, ...newVersions] } 
            : series
    );

    localStorage.setItem('documentHistory', JSON.stringify(updatedSeriesList));

    const lastNewVersion = newVersions[newVersions.length - 1];
    
    return {
        ...state,
        documentSeries: updatedSeriesList,
        currentSeriesId: targetSeriesId,
        currentVersionId: lastNewVersion ? lastNewVersion.id : state.currentVersionId,
        lastGeneratedVersionId: lastNewVersion ? lastNewVersion.id : null,
    };
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_HISTORY_FROM_STORAGE': {
        try {
            const finalHistoryKey = 'documentHistory';
            const historyToParse = localStorage.getItem(finalHistoryKey);
            if (historyToParse) {
                const parsedHistory: DocumentSeries[] = JSON.parse(historyToParse);
                return { ...state, documentSeries: parsedHistory };
            }
            return state;
        } catch (e) {
            console.error("Failed to load document history from localStorage", e);
            localStorage.removeItem('documentHistory');
            return { ...state, documentSeries: [] };
        }
    }
    case 'START_GENERATION':
      return {
        ...state,
        loadingAction: action.payload.action,
        error: '',
        progress: 0,
        progressStatus: '',
        bulkProgress: null
      };
    case 'END_GENERATION':
        return { ...state, loadingAction: null, bulkProgress: null };
    case 'GENERATION_SUCCESS': {
        const { type, markdowns, docType, seriesId } = action.payload;
        // Sanitize all incoming markdown from the AI before it enters the application state.
        const cleanMarkdowns = markdowns.map(md => sanitizeAndConvertToMarkdown(md));

        if (type === 'new') {
            return handleNewDocumentSuccess(state, cleanMarkdowns, docType);
        }
        if ((type === 'version' || type === 'final') && seriesId) {
            return handleNewVersionSuccess(state, cleanMarkdowns, seriesId);
        }
        return state;
    }
    case 'GENERATION_FAILURE':
      return {
        ...state,
        error: action.payload.error,
        loadingAction: null,
        progress: 0,
        progressStatus: '',
        bulkProgress: null
      };
    case 'UPDATE_PROGRESS':
        return { 
            ...state,
            progress: action.payload.progress > state.progress ? action.payload.progress : state.progress,
            progressStatus: action.payload.status
        };
    case 'SET_BULK_PROGRESS':
        return { ...state, bulkProgress: action.payload };
    case 'SET_CURRENT_DOCUMENT': {
        const { seriesId, versionId } = action.payload;
        const newState = { ...state, error: '' };
        if (seriesId !== undefined) {
            newState.currentSeriesId = seriesId;
            const seriesToLoad = state.documentSeries.find(s => s.id === seriesId);
            if (seriesToLoad) {
                newState.currentVersionId = seriesToLoad.versions[seriesToLoad.versions.length - 1].id;
            }
        }
        if (versionId !== undefined) {
            newState.currentVersionId = versionId;
        }
        return newState;
    }
    case 'DELETE_SERIES': {
        const updatedHistory = state.documentSeries.filter(s => s.id !== action.payload.seriesId);
        localStorage.setItem('documentHistory', JSON.stringify(updatedHistory));
        return {
            ...state,
            documentSeries: updatedHistory,
            currentSeriesId: state.currentSeriesId === action.payload.seriesId ? null : state.currentSeriesId,
            currentVersionId: state.currentSeriesId === action.payload.seriesId ? null : state.currentVersionId
        };
    }
    case 'CLEAR_HISTORY': {
        localStorage.setItem('documentHistory', JSON.stringify([]));
        return {
            ...state,
            documentSeries: [],
            currentSeriesId: null,
            currentVersionId: null
        };
    }
    case 'SET_FEEDBACK_SUBMITTED': {
        const newSeries = state.documentSeries.map(series => ({
            ...series,
            versions: series.versions.map(version => 
              version.id === action.payload.versionId 
                ? { ...version, feedbackSubmitted: true } 
                : version
            )
        }));
        localStorage.setItem('documentHistory', JSON.stringify(newSeries));
        return { ...state, documentSeries: newSeries, lastGeneratedVersionId: null };
    }
    default:
      return state;
  }
}