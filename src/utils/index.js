/**
 * Checks condition and throws error
 *
 * @param {boolean|function|number|string|Array|Object} condition
 * @param {string} message
 * @throws {Error} condition must be positive
 */
export function assert(condition, message) {
    if (!condition) {
        throw new Error(`[bootstrap] ${message}`);
    }
}
