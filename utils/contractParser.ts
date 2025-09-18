
/**
 * @file Contains utility functions for parsing and extracting details from raw contract markdown.
 */

/**
 * Parses the markdown content of a contract to extract key details for file naming.
 * This function is designed to be resilient to minor formatting variations from the AI.
 *
 * @param markdown - The full markdown/HTML string of the contract.
 * @returns An object containing the sanitized names of party1, party2, and the formatted contract date.
 */
export const parseContractDetails = (markdown: string): { party1: string; party2: string; contractDate: string; } => {
    
    /**
     * Cleans and sanitizes a raw party name string for use in a filename.
     * It strips HTML/Markdown, trims whitespace, and replaces invalid filename characters.
     * Preserves Unicode characters (e.g., Arabic script).
     *
     * @param rawName The raw string extracted from the contract.
     * @returns A sanitized string suitable for a filename, or 'UnknownParty' as a fallback.
     */
    const sanitizePartyName = (rawName: string): string => {
        // Strip any HTML tags (e.g., <b>, <span>)
        let cleanName = rawName.replace(/<[^>]*>?/gm, '');
        // Strip common Markdown formatting characters (bold, italics, etc.)
        cleanName = cleanName.replace(/(\*\*|__|\*|_|`|~)/g, '');
        // Trim whitespace from the start and end
        cleanName = cleanName.trim();
        
        // Replace spaces and invalid filename characters with a single underscore.
        // This regex avoids replacing Unicode letters (like Arabic) by not using \W,
        // which would incorrectly remove non-ASCII characters.
        cleanName = cleanName.replace(/[\\/:\*\?"<>\|\s_]+/g, '_');

        // Remove any leading or trailing underscores that might result from the replacement.
        cleanName = cleanName.replace(/^_|_$/g, '');
        
        return cleanName || 'UnknownParty';
    };

    let party1 = "UnknownParty";
    let party2 = "UnknownParty";
    
    // Regex for Party 1: Looks for the label "الطرف الأول", allowing for optional
    // Markdown bolding, surrounding whitespace, and a colon before capturing the name.
    const party1Regex = /(?:\*\*|__)?\s*الطرف الأول\s*(?:\*\*|__)?\s*:\s*([^\n\r<]+)/;
    const party1Match = markdown.match(party1Regex);
    if (party1Match && party1Match[1]) {
        party1 = sanitizePartyName(party1Match[1]);
    }

    // Regex for Party 2: Same logic as Party 1, but for "الطرف الثاني".
    const party2Regex = /(?:\*\*|__)?\s*الطرف الثاني\s*(?:\*\*|__)?\s*:\s*([^\n\r<]+)/;
    const party2Match = markdown.match(party2Regex);
    if (party2Match && party2Match[1]) {
        party2 = sanitizePartyName(party2Match[1]);
    }
    
    // Use the current date as a fallback if no date is found in the contract.
    let contractDateObj = new Date(); 
    
    // Regex for Date: Looks for common Gregorian date formats (e.g., "17 September 2025" or "September 17, 2025")
    // and allows for optional Markdown bolding around the date.
    const dateMatch = markdown.match(/(?:\*\*)?\b(?:\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2},\s+\d{4})\b(?:\*\*)?/);
    if (dateMatch && dateMatch[0]) {
        try {
            // The matched string could contain asterisks, so we clean it before parsing.
            const cleanDateString = dateMatch[0].replace(/\*\*/g, '');
            const parsedDate = new Date(cleanDateString);
            
            // Check if the parsed date is valid to avoid errors.
            if (!isNaN(parsedDate.getTime())) {
                contractDateObj = parsedDate;
            }
        } catch (e) {
            console.error("Could not parse date from contract:", dateMatch[0]);
        }
    }

    // Format the date into YYYYMMDD for the filename.
    const year = contractDateObj.getFullYear();
    const month = (contractDateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = contractDateObj.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;

    return { party1, party2, contractDate: formattedDate };
};