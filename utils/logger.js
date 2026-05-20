const logger={
    logRequest(method, url){
        console.log(`[REQUEST] ${method.toUpperCase()} ${url}`)
    },
    logResponse(status, url, duration){
        console.log(`[RESPONSE] ${status} ${url} (${duration}ms)`)
    },
    logError(url, error){
        console.error(`[ERROR] ${url} - ${error.message}`)
    }
}
module.exports=logger;