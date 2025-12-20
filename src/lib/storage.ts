/**
 * Storage utilities with limits and error handling
 */

// Configurable limits for storage protection
export const STORAGE_LIMITS = {
    // Import limits
    MAX_IMPORT_LINES: 500,
    MAX_LINE_LENGTH: 200,
    MAX_IMPORT_SIZE: 100 * 1024, // 100KB

    // Category mappings limits
    MAX_CATEGORY_MAPPINGS: 500,
    MAX_MAPPING_KEY_LENGTH: 100,
} as const;

/**
 * Check if an error is a QuotaExceededError
 */
export function isQuotaExceeded(error: unknown): boolean {
    if (error instanceof DOMException) {
        // Check for different browser implementations
        return (
            error.code === 22 || // Legacy Chrome
            error.code === 1014 || // Firefox
            error.name === 'QuotaExceededError' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        );
    }
    return false;
}

/**
 * Get approximate localStorage usage in bytes
 */
export function getStorageUsage(): number {
    let total = 0;
    for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            total += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
        }
    }
    return total;
}

/**
 * Estimate available localStorage space (approximate)
 * Most browsers allow ~5MB
 */
export function getAvailableStorage(): number {
    const MAX_STORAGE = 5 * 1024 * 1024; // 5MB typical limit
    return Math.max(0, MAX_STORAGE - getStorageUsage());
}

/**
 * Validate and sanitize text for import
 * Returns sanitized lines array
 */
export function sanitizeImportText(text: string): string[] {
    // Limit total size first
    const trimmedText = text.length > STORAGE_LIMITS.MAX_IMPORT_SIZE
        ? text.substring(0, STORAGE_LIMITS.MAX_IMPORT_SIZE)
        : text;

    return trimmedText
        .split('\n')
        .map(line => line.trim())
        .map(line => line.substring(0, STORAGE_LIMITS.MAX_LINE_LENGTH))
        .filter(line => line.length > 0)
        .slice(0, STORAGE_LIMITS.MAX_IMPORT_LINES);
}

/**
 * Normalize a category mapping key
 */
export function normalizeMappingKey(key: string): string {
    return key
        .toLowerCase()
        .trim()
        .substring(0, STORAGE_LIMITS.MAX_MAPPING_KEY_LENGTH);
}

/**
 * Check if we can add more category mappings
 */
export function canAddMapping(
    currentMappings: Record<string, string>,
    key: string
): boolean {
    const normalizedKey = normalizeMappingKey(key);
    // Allow if key already exists (update) or under limit
    return (
        normalizedKey in currentMappings ||
        Object.keys(currentMappings).length < STORAGE_LIMITS.MAX_CATEGORY_MAPPINGS
    );
}
