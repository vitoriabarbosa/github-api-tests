const { expect } = require('@playwright/test')

/**
 * Assertion helpers for API response validation.
 */
class Assertions {
    /**
     * Assert the response status code.
     * @param {object} response - Playwright response object.
     * @param {number} expectedStatus - Expected HTTP status.
     */
    assertStatus(response, expectedStatus) {
        expect(response.status()).toBe(expectedStatus)
    }

    /**
     * Assert response content-type using a soft expectation.
     * @param {object} response - Playwright response object.
     * @param {string} [type='application/json'] - Expected content type substring.
     */
    assertContentTypeSoft(response, type = 'application/json') {
        expect.soft(response.headers()['content-type']).toContain(type)
    }

    /**
     * Assert response content-type.
     * @param {object} response - Playwright response object.
     * @param {string} [type='application/json'] - Expected content type substring.
     */
    assertContentType(response, type = 'application/json') {
        expect(response.headers()['content-type']).toContain(type)
    }

    /**
     * Assert pagination result shape.
     * @param {Array} body - Response body array.
     * @param {number} maxItems - Maximum expected items.
     */
    assertPagination(body, maxItems) {
        expect(Array.isArray(body)).toBeTruthy()
        expect(body.length).toBeLessThanOrEqual(maxItems)
    }

    /**
     * Assert every item owner matches the expected owner.
     * @param {Array} body - Response body array.
     * @param {string} expectedOwner - Expected owner login.
     */
    assertOwner(body, expectedOwner) {
        body.forEach((item) => {
            expect(item.owner.login.toLowerCase()).toBe(expectedOwner.toLowerCase())
        })
    }

    /**
     * Assert a not found error message.
     * @param {object} body - Response JSON body.
     */
    assertNotFound(body) {
        expect(body.message).toBe('Not Found')
    }
}
module.exports = Assertions
