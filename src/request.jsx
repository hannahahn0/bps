import { getToken } from './auth'

const aborter = () => {
    let aborted = false
    return {
        abort: () => {
            aborted = true
        },
        abortCheck: wrapped => (promData) => {
            if (!aborted) {
                wrapped(promData)
            }
        },
    }
}

let cacheRes = {}

const clearCache = () => {
    cacheRes = {}
}

const setCache = ({ type, endpoint, res }) => {
    if (cacheRes[endpoint]) {
        cacheRes[endpoint][type] = res
    }
    cacheRes[endpoint] = {
        [type]: res,
    }
}

const getCache = ({ type, endpoint }) => {
    if (cacheRes[endpoint]) {
        return cacheRes[endpoint][type] || null
    }
    return null
}

export default ({
    type = 'GET',
    data,
    endpoint,
    includeToken,
    cached,
}) => {
    const initialCachedResult = getCache({ type, endpoint })
    if (cached && initialCachedResult) {
        return initialCachedResult
    }
    return new Promise(async (promResolve, promReject) => {
        let cachedResolve
        let cachedReject
        if (cached) {
            const cachedDataResult = new Promise((resolve, reject) => {
                cachedResolve = resolve
                cachedReject = reject
            })
            cachedDataResult.catch(() => {})
            setCache({ type, endpoint, res: cachedDataResult })
        }
        const resolve = (resData) => {
            promResolve({
                data: resData,
                cached: false,
            })
            if (cached) {
                cachedResolve({
                    data: resData,
                    cached: true,
                })
            }
        }
        const reject = (rejData) => {
            const promRejData = Error(rejData)
            promRejData.cached = false
            promReject(promRejData)
            if (cached) {
                const cachedRromRejData = Error(rejData)
                cachedRromRejData.cached = true
                cachedReject(cachedRromRejData)
            }
        }
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
            if (!jsonResult.code.startsWith('0-')) {
                reject(jsonResult.human)
            }
            resolve(jsonResult)
        } catch ({ message }) {
            reject(message || 'Could not connect to the server. Try again later.')
        }
    })
}

export { aborter, clearCache }
