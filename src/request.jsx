import { getToken } from './auth'

const aborter = () => ({
    abort() {
        this.aborted = true
    },
    aborted: false,
})

export default async ({
    type = 'GET',
    data,
    endpoint,
    abort = {},
    includeToken,
}) => { // eslint-disable-line consistent-return
    try {
        const fetchResult = await fetch(`/.netlify/functions/${endpoint}`, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                Authorization: includeToken ? `Bearer ${getToken()}` : undefined,
            },
            body: data !== undefined ? JSON.stringify(data) : undefined,
        })
        const jsonResult = await fetchResult.json()
        if (!abort.aborted) {
            if (!jsonResult.code.startsWith('0-')) {
                throw Error(jsonResult.human)
            }
            return jsonResult
        }
    } catch ({ message }) {
        if (!abort.aborted) {
            throw Error(message || 'Could not connect to the server. Try again later.')
        }
    }
}

export { aborter }
