import request from 'request'
import cheerio from 'cheerio'
import withApiCb from '../with/withApiCb'
import withMethod from '../with/withMethod'
import withJsonParse from '../with/withJsonParse'
import withBodyArgs from '../with/withBodyArgs'
import { hex_hmac_md5 as hexHmacMd5 } from '../util/md5'
import env from '../util/env.json'

const loginEndpoint = `${env.PS_SERVER}/guardian/home.html`

const handler = withApiCb(withMethod('POST', withJsonParse(withBodyArgs({ username: 'string', password: 'string' }, (evt, ctx, cb) => {
    const username = evt.body.username.trim()
    const password = evt.body.password.trim()
    request({
        method: 'POST',
        url: 'https://accounts.google.com/InputValidator',
        qs: {
            resource: 'SignUp',
        },
        json: {
            email: {
                Input: 'EmailAddress',
                EmailAddress: `${username}@${env.STUDENT_EMAIL_DOMAIN}`,
            },
        },
    }, (googErr, googRes, googBody) => {
        if (googErr || googRes.statusCode !== 200) {
            cb('googServerError')
            return
        }
        const { email: { Valid: missingEmail } } = googBody
        if (missingEmail === 'true') {
            cb('accountMissing')
            return
        }
        request(loginEndpoint, (contextErr, contextRes, contextBody) => {
            if (contextErr || contextRes.statusCode !== 200) {
                cb('psServerErr')
                return
            }
            try {
                const $ = cheerio.load(contextBody)
                request({
                    method: 'POST',
                    url: loginEndpoint,
                    form: {
                        pstoken: $('input[name=pstoken]').attr('value'),
                        dbpw: hexHmacMd5($('input[name=contextData]').attr('value'), password.toLowerCase()),
                        ldappassword: password,
                        account: username,
                        pw: 'pw',
                    },
                }, (loginErr, loginRes) => {
                    if (loginErr) {
                        cb('psServerErr')
                        return
                    }
                    if (loginRes.statusCode === 302) {
                        cb('successLogin', {
                            token: loginRes.headers['set-cookie'].filter(c => c.includes('psaid'))[0].match(/=(.*?);/)[1],
                        })
                    } else {
                        cb('passwordWrong')
                    }
                })
            } catch (e) {
                cb('psServerErr')
            }
        })
    })
}))))

export { handler } // eslint-disable-line import/prefer-default-export
