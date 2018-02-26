const fs = require('fs')

fs.writeFileSync('./src/lambda/util/env.json', JSON.stringify({
    PS_SERVER: process.env.PS_SERVER,
    STUDENT_EMAIL_DOMAIN: process.env.STUDENT_EMAIL_DOMAIN,
}))
