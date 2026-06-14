/**
 * Global test context for sharing state across suites and tests.
 */
class TestContext {
    constructor() {
        this.globalContext = new Map()
        this.suiteContext = new Map()
        this.testContext = new Map()
    }

    /**
     * Store a value in the global context.
     * @param {string} key - Context key.
     * @param {*} value - Context value.
     */
    setGlobal(key, value) {
        this.globalContext.set(key, value)
    }

    /**
     * Retrieve a value from the global context.
     * @param {string} key - Context key.
     * @returns {*} Stored value or undefined.
     */
    getGlobal(key) {
        return this.globalContext.get(key)
    }

    /**
     * Store a value in the current suite context.
     * @param {string} key - Context key.
     * @param {*} value - Context value.
     */
    setSuite(key, value) {
        this.suiteContext.set(key, value)
    }

    /**
     * Retrieve a value from the current suite context.
     * @param {string} key - Context key.
     * @returns {*} Stored value or undefined.
     */
    getSuite(key) {
        return this.suiteContext.get(key)
    }

    /**
     * Clear the current suite context.
     */
    clearSuite() {
        this.suiteContext.clear()
    }

    /**
     * Store a value in the current test context.
     * @param {string} key - Context key.
     * @param {*} value - Context value.
     */
    setTest(key, value) {
        this.testContext.set(key, value)
    }

    /**
     * Retrieve a value from the current test context.
     * @param {string} key - Context key.
     * @returns {*} Stored value or undefined.
     */
    getTest(key) {
        return this.testContext.get(key)
    }

    /**
     * Clear the current test context.
     */
    clearTest() {
        this.testContext.clear()
    }
}

module.exports = new TestContext()
