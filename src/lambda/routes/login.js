import request from 'request'
import cheerio from 'cheerio'

import withApiCb from '../with/withApiCb'
import withMethod from '../with/withMethod'
import withJsonParse from '../with/withJsonParse'
import { hex_hmac_md5 as hexHmacMd5 } from '../util/md5'
import env from '../util/env.json'

const loginEndpoint = `${env.PS_SERVER}/guardian/home.html`

const handler = withApiCb(withMethod('POST', withJsonParse((evt, ctx, cb) => {
    request(loginEndpoint, (err, res, body) => {
        if (!err && res.statusCode === 200) {
            // extract tokens from server response
            const $ = cheerio.load(body)
            const pstoken = $('input[name=pstoken]').attr('value')
            const contextData = $('input[name=contextData]').attr('value')
            // md5 the password to send to ps server
            const dbpw = hexHmacMd5(contextData, evt.body.password.toLowerCase())
            request({
                method: 'POST',
                url: loginEndpoint,
                form: {
                    pstoken,
                    dbpw,
                    ldappassword: evt.body.password,
                    account: evt.body.username,
                    pw: 'pw',
                },
            }, (loginErr, loginRes) => {
                if (loginErr) {
                    cb('psServerErr')
                    return
                }
                // see if server responds with a redirect to a guardian (not public) page
                if (loginRes.headers.location && loginRes.headers.location.includes('guardian')) {
                    // resolve promise with psaid cookie
                    cb('successLogin', {
                        token: loginRes.headers['set-cookie'].filter(c => c.includes('psaid'))[0].match(/=(.*?);/)[1],
                    })
                } else {
                    cb('badLogin')
                }
            })
        } else {
            cb('psServerErr')
        }
    })
})))

export { handler } // eslint-disable-line import/prefer-default-export
