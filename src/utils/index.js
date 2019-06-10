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

/**
 * Inheritance
 *
 * You should remember about calling of parent constructor
 *
 * ```javascript
 * function Child() {
 *     Parent.call(this);
 * }
 * ```
 *
 * @param {function} child
 * @param {function} parent
 */
export function extend(child, parent) {
    const proto = Object.create(parent.prototype);

    Object.entries(child.prototype).forEach(([name, prop]) => {
        proto[name] = prop;
    });
    proto.constructor = child;  // override constructor if exists
    child.prototype = proto;

    return child;
}
