const fs = require('fs')
const path = require('path')

const logFilePath = path.join(__dirname, 'logs', 'test-execution.log')
const reportPath = path.join(__dirname, 'logs', 'execution-report.html')

function generateReport() {
    if (!fs.existsSync(logFilePath)) {
        console.log('Log file not found. Please run the tests first.')
        return
    }

    const logs = fs.readFileSync(logFilePath, 'utf-8').split('\n').filter(Boolean)

    let errorCount = 0
    const logRows = logs
        .map((log) => {
            if (log.includes('ERROR')) errorCount++
            const rowClass = log.includes('ERROR')
                ? 'error'
                : log.includes('WARN')
                  ? 'warn'
                  : 'info'
            return `<div class="log-entry ${rowClass}">${log}</div>`
        })
        .join('')

    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Execution Logs Report</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px; color: #333; }
                .summary { background: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 5px solid #2196F3; }
                .logs-container { background: white; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden; }
                .log-entry { padding: 10px 15px; border-bottom: 1px solid #eee; font-family: 'Courier New', monospace; font-size: 14px; }
                .log-entry:last-child { border-bottom: none; }
                .error { color: #d32f2f; background: #ffebee; font-weight: bold; }
                .warn { color: #f57c00; background: #fff3e0; }
                .info { color: #424242; }
            </style>
        </head>
        <body>
            <h2>Logs Report - Test Automation</h2>
            <div class="summary">
                <p><strong>Total Logs:</strong> ${logs.length}</p>
                <p><strong>Total Errors:</strong> <span style="color: ${errorCount > 0 ? 'red' : 'green'};">${errorCount}</span></p>
            </div>
            <div class="logs-container">
                ${logRows}
            </div>
        </body>
        </html>
    `

    fs.writeFileSync(reportPath, htmlTemplate)
    console.log(`\nHTML report successfully generated at: ${reportPath}`)
}

generateReport()
