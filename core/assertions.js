const {expect} = require('@playwright/test')

class Assertions{
    assertStatus(response, expectedStatus){
        expect(response.status()).toBe(expectedStatus)
    }
    assertContentType(response, type='application/json'){
        expect(response.headers()['content-type']).toContain(type)
    }
    assertPagination(body, maxItems){
        expect(Array.isArray(body)).toBeTruthy()
        expect(body.length).toBeLessThanOrEqual(maxItems)
    }
    assertOwner(body, expectedOwner){
        body.forEach(item => {
            expect(item.owner.login.toLowerCase()).toBe(expectedOwner.toLowerCase())
        });
    }
    assertNotFound(body){
        expect(body.message).toBe('Not Found')
    }
}
module.exports=Assertions