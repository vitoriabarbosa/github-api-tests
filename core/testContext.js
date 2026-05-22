class TestContext {
    constructor() {
        this.globalContext = new Map();
        this.suiteContext = new Map();
        this.testContext = new Map();
    }

    setGlobal(key, value) {
        this.globalContext.set(key, value);
    }

    getGlobal(key) {
        return this.globalContext.get(key);
    }

    setSuite(key, value) {
        this.suiteContext.set(key, value);
    }

    getSuite(key) {
        return this.suiteContext.get(key);
    }

    clearSuite() {
        this.suiteContext.clear();
    }

    setTest(key, value) {
        this.testContext.set(key, value);
    }

    getTest(key) {
        return this.testContext.get(key);
    }

    clearTest() {
        this.testContext.clear();
    }
}

module.exports = new TestContext();