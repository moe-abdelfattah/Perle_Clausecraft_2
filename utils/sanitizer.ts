import { decodeHtmlEntities } from './htmlUtils';

/**
 * Cleans the content of a table cell by removing inner HTML and trimming whitespace.
 * @param cellContent The raw HTML content of a <th> or <td>.
 * @returns The cleaned text content.
 */
function cleanCellContent(cellContent: string): string {
    // Replace <br> tags with a space for single-line cells, strip other tags, and trim.
    return cellContent.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim();
}


/**
 * Takes a raw string response from the AI and forces it into clean, standard Markdown.
 * This function is the core of the new defensive data-cleaning strategy.
 * @param rawText The potentially mixed-format string from the AI.
 * @returns A string containing only clean, valid Markdown.
 */
export function sanitizeAndConvertToMarkdown(rawText: string): string {
    // Step 1: Decode any HTML entities (e.g., &lt;p&gt; -> <p>).
    let text = decodeHtmlEntities(rawText);

    // Step 2: Convert block-level HTML tags to Markdown equivalents.
    
    // Handle Tables separately as they are complex and require multi-pass parsing.
    text = text.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (tableHtml) => {
        let markdownTable = '';
        const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
        
        if (rows.length === 0) return '';

        let headerProcessed = false;

        for (const row of rows) {
            const headerCells = [...row[1].matchAll(/<th[^>]*>(.*?)<\/th>/gi)];
            const dataCells = [...row[1].matchAll(/<td[^>]*>(.*?)<\/td>/gi)];

            if (!headerProcessed) {
                let cellsToProcess = [];
                // Prioritize <th> for headers, but fall back to <td> in the first row
                if (headerCells.length > 0) {
                    cellsToProcess = headerCells;
                } else if (dataCells.length > 0) {
                    cellsToProcess = dataCells;
                }

                if (cellsToProcess.length > 0) {
                    const headers = cellsToProcess.map(cell => cleanCellContent(cell[1]));
                    markdownTable += `| ${headers.join(' | ')} |\n`;
                    markdownTable += `| ${headers.map(() => '---').join(' | ')} |\n`;
                    headerProcessed = true;
                    // If we used a data row as a header, don't process it again as a data row
                    if (headerCells.length === 0) continue;
                }
            }
            
            // Process data rows (only those with <td> tags)
            if (dataCells.length > 0) {
                const cells = dataCells.map(cell => cleanCellContent(cell[1]));
                markdownTable += `| ${cells.join(' | ')} |\n`;
            }
        }
        
        // Return with surrounding newlines to ensure it's treated as a block element
        return `\n\n${markdownTable}\n`;
    });

    // Handle other block-level elements
    text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
    text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
    text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
    text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '\n* $1');
    text = text.replace(/<br\s*\/?>/gi, '\n');

    // Step 3: Convert common inline HTML tags to Markdown.
    text = text.replace(/<(strong|b)>(.*?)<\/(strong|b)>/gi, '**$2**');
    text = text.replace(/<(em|i)>(.*?)<\/(em|i)>/gi, '*$2*');

    // Step 4: Strip any remaining HTML tags (like <ul>, <div>, etc.) that weren't converted.
    text = text.replace(/<[^>]+>/g, '');

    // Step 5: Clean up excessive newlines created during conversion.
    // Replace 3 or more newlines with just two (which represents a single blank line in Markdown).
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
}