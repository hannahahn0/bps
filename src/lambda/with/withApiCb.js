import responses from './responses'

export default wrapped => (evt, ctx, lambdaCb) => wrapped(evt, ctx, (result, data) => {
    const response = responses[result]
    return lambdaCb(null, {
        statusCode: response.status,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code: response.code,
            human: response.human,
            data,
        }),
    })
})
