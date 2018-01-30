import request from 'request'
import cheerio from 'cheerio'
import withApiCb from '../with/withApiCb'
import withMethod from '../with/withMethod'
import withToken from '../with/withToken'
import env from '../util/env.json'


const handler = withApiCb(withMethod('GET', withToken((evt, ctx, cb) => {
    request({
        method: 'GET',
        url: `${env.PS_SERVER}/guardian/gradesatt_sec.html`,
        headers: {
            cookie: `psaid=${evt.token};`,
        },
        followRedirect: false,
    }, (infoErr, infoRes, infoBody) => {
        if (infoErr) {
            cb('psServerErr')
            return
        }
        if (infoRes.statusCode !== 200) {
            cb('tokenWrong')
            return
        }
        try {
            const $ = cheerio.load(infoBody)
            const gradeEls = Array.from($('table.linkDescList.grid tbody tr.center:not(.th2)').map((idx, el) => $(el).children()))
                .map(els => Array.from(els))
            cb('successGrades', gradeEls.map((el) => {
                const courseField = $(el[11])[0].childNodes
                const teacher = $(courseField[courseField.length - 2])
                    .text()
                    .replace('Email ', '')
                    .split(', ')
                const getScore = (td) => {
                    if ($(td).hasClass('notInSession')) {
                        return null
                    }
                    const scoreNodes = $(td).find('a')[0].childNodes
                    const firstNode = scoreNodes[0].nodeValue
                    if (firstNode === '[ i ]' || firstNode === '0') {
                        return null
                    }
                    return {
                        letter: firstNode,
                        percent: parseInt(scoreNodes[2].nodeValue, 10),
                    }
                }
                return {
                    period: $(el[0]).html().trim() || null,
                    course: courseField[0].nodeValue.trim() || null,
                    teacher: teacher ? {
                        surName: teacher[0],
                        givenName: teacher[1],
                    } : null,
                    room: courseField[courseField.length - 1].nodeValue.replace(' - Rm: ', '').trim() || null,
                    scores: {
                        q1: getScore(el[12]),
                        q2: getScore(el[13]),
                        s1: getScore(el[14]),
                        q3: getScore(el[15]),
                        q4: getScore(el[16]),
                        s2: getScore(el[17]),
                        y1: getScore(el[18]),
                    },
                }
            }))
        } catch (e) {
            cb('psServerErr')
        }
    })
})))

export { handler } // eslint-disable-line import/prefer-default-export
