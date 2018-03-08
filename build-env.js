const fs = require('fs')

let env

try {
    env = { ...JSON.parse(fs.readFileSync('./.env.lambda')), ...process.env }
} catch (e) {
    env = process.env // eslint-disable-line prefer-destructuring
}

fs.writeFileSync('./src/lambda/util/env.json', JSON.stringify({
    PS_SERVER: env.PS_SERVER,
    STUDENT_EMAIL_DOMAIN: env.STUDENT_EMAIL_DOMAIN,
}))
