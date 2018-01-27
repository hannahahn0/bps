import request from 'request'
import cheerio from 'cheerio'
import withApiCb from '../with/withApiCb'
import withMethod from '../with/withMethod'
import withToken from '../with/withToken'
import env from '../util/env.json'


const handler = withApiCb(withMethod('GET', withToken((evt, ctx, cb) => {
    request({
        method: 'GET',
        url: `${env.PS_SERVER}/guardian/stuinfo.html`,
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
            const info = cheerio.load(infoBody)('#content-main span')
                .html()
                .split('<br>')
                .filter(str => str.trim())
                .map(str => str.trim().split(': ')[1])
            const name = info[0].split(', ')
            cb('successInfo', {
                surName: name[0],
                givenName: name[1],
                id: parseInt(info[1], 10),
                grade: parseInt(info[2], 10),
                homeroom: info[3],
                email: info[4],
                username: info[4].replace('@mtlstudents.net', ''),
                team: info[5],
            })
        } catch (e) {
            cb('psServerErr')
        }
    })
})))

export { handler } // eslint-disable-line import/prefer-default-export
