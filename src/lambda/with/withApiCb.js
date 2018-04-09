import responses from './responses'

const sendResponse = lambdaCb => (result, data = null) => {
    const response = responses[result]
    lambdaCb(null, {
        statusCode: response.status,
        headers: {
            'Content-Type': 'application/json',
            'Referrer-Policy': 'origin',
            'X-Content-Type-Options': 'nosniff',
            'X-Dns-Prefetch-Control': 'off',
            'X-Download-Options': 'noopen',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Xss-Protection': '1; mode=block',
        },
        body: JSON.stringify({
            code: response.code,
            human: response.human,
            data,
        }),
    })
}

export default wrapped => (evt, ctx, lambdaCb) => {
    const cb = sendResponse(lambdaCb)
    try {
        wrapped(evt, ctx, cb)
    } catch (e) {
        cb('internalError')
    }
}
