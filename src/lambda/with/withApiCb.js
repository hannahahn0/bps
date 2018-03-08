import responses from './responses'

export default wrapped => (evt, ctx, lambdaCb) => wrapped(evt, ctx, (result, data) => {
    const response = responses[result]
    return lambdaCb(null, {
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
})
