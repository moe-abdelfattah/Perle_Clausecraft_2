import { DocumentType } from "../state/types";

/**
 * Sanitizes a string to make it suitable for use in a filename.
 * Replaces illegal characters, markdown, and whitespace with underscores.
 * @param rawName - The string to sanitize.
 * @returns A path-safe string.
 */
export const sanitizeForFilename = (rawName: string): string => {
    if (!rawName) return 'Unknown';
    // First, remove any remaining HTML/Markdown that might have slipped through.
    let cleanName = rawName.replace(/<[^>]*>?/gm, ''); 
    cleanName = cleanName.replace(/(\*\*|__|\*|_|`|~|#)/g, '');
    cleanName = cleanName.trim();
    // Now, replace illegal characters for filenames.
    cleanName = cleanName.replace(/[\\/:\*\?"<>\|\s_]+/g, '_');
    cleanName = cleanName.replace(/^_|_$/g, '');
    return cleanName || 'Unknown';
};

/**
 * Parses the markdown content of a document to extract key details for identification.
 * Adapts its parsing strategy based on the document type for accuracy.
 *
 * @param markdown - The full markdown string of the document.
 * @param docType - The type of document being parsed ('contract', 'letter', 'agreement').
 * @returns An object containing parsed and sanitized details.
 */
export const parseDocumentDetails = (markdown: string, docType: DocumentType): { party1: string; party2:string; documentDate: string; subject: string; title: string; } => {
    
    const sanitizeForDisplay = (rawName: string): string => {
        if (!rawName) return 'Unknown';
        let cleanName = rawName.replace(/<[^>]*>?/gm, ''); // Strip any accidental HTML tags
        cleanName = cleanName.replace(/(\*\*|__|\*|_|`|~|#)/g, ''); // Strip Markdown formatting
        cleanName = cleanName.trim();
        return cleanName || 'Unknown';
    };

    let party1 = "UnknownParty";
    let party2 = "UnknownParty";
    let subject = "Unknown";
    let title = "Unknown";

    // For all types, we no longer expect an H1 title from the AI.
    // The main identifier will be derived from parties or subject.
    title = "Unknown"; // Explicitly set to Unknown.

    if (docType === 'letter') {
        const subjectRegex = /^##\s+الموضوع:\s*(.*)/im;
        const subjectMatch = markdown.match(subjectRegex);
        if (subjectMatch && subjectMatch[1]) {
            subject = sanitizeForDisplay(subjectMatch[1]);
        }
        
        const senderRegex = /(?:\*\*|__)?\s*المرسل\s*(?:\*\*|__)?\s*:\s*([^\n\r]+)/;
        const senderMatch = markdown.match(senderRegex);
        if(senderMatch && senderMatch[1]) party1 = sanitizeForDisplay(senderMatch[1]);
        
        const recipientRegex = /(?:\*\*|__)?\s*إلى\s*(?:\*\*|__)?\s*:\s*([^\n\r]+)/;
        const recipientMatch = markdown.match(recipientRegex);
        if (recipientMatch && recipientMatch[1]) party2 = sanitizeForDisplay(recipientMatch[1]);

    } else { // For contracts and agreements
        const party1Regex = /(?:\*\*|__)?\s*الطرف الأول\s*(?:\*\*|__)?\s*:\s*([^\n\r]+)/;
        const party1Match = markdown.match(party1Regex);
        if (party1Match && party1Match[1]) {
            party1 = sanitizeForDisplay(party1Match[1]);
        }

        const party2Regex = /(?:\*\*|__)?\s*الطرف الثاني\s*(?:\*\*|__)?\s*:\s*([^\n\r]+)/;
        const party2Match = markdown.match(party2Regex);
        if (party2Match && party2Match[1]) {
            party2 = sanitizeForDisplay(party2Match[1]);
        }
    }
    
    let documentDateObj = new Date(); 
    const dateMatch = markdown.match(/(?:\*\*)?\b(?:\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2},\s+\d{4})\b(?:\*\*)?/);
    if (dateMatch && dateMatch[0]) {
        try {
            const cleanDateString = dateMatch[0].replace(/\*\*/g, '');
            const parsedDate = new Date(cleanDateString);
            if (!isNaN(parsedDate.getTime())) {
                documentDateObj = parsedDate;
            }
        } catch (e) {
            console.error("Could not parse date from document:", dateMatch[0]);
        }
    }

    const year = documentDateObj.getFullYear();
    const month = (documentDateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = documentDateObj.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;

    return { party1, party2, documentDate: formattedDate, subject, title };
};
