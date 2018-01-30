/*
    Response codes are always a string, with a `-` seperating the code into two parts
    First digit - response category:
        0: success
        1: internal error
        2: authentication error
        3: upstream API error
        4: client error
    Second digit - specific response type
*/

export default Object.freeze({
    successLogin: {
        status: 200,
        code: '0-0',
        human: 'The login is successful.',
    },
    successInfo: {
        status: 200,
        code: '0-1',
        human: 'Info retreived successfuly.',
    },
    successGrades: {
        status: 200,
        code: '0-2',
        numan: 'Grades retreived successfully.',
    },
    passwordWrong: {
        status: 401,
        code: '2-0',
        human: 'The password is incorrect.',
    },
    wrongMethod: {
        status: 405,
        code: '4-0',
        human: 'This HTTP method is not allowed on this endpoint.',
    },
    psServerErr: {
        status: 502,
        code: '3-0',
        human: 'The PowerSchool server returned an error.',
    },
    jsonMalformed: {
        status: 400,
        code: '4-0',
        human: 'The JSON provided is malformed.',
    },
    wrongContentType: {
        status: 400,
        code: '4-1',
        human: 'The content type header in the request did not specify JSON.',
    },
    paramsMissing: {
        status: 400,
        code: '4-2',
        human: 'The necessary parameters for this endpoint were not provided.',
    },
    internalError: {
        status: 500,
        code: '1-0',
        human: 'An internal error has occurred. Try again later.',
    },
    googServerError: {
        status: 502,
        code: '3-1',
        human: 'The Google server username server returned an error.',
    },
    accountMissing: {
        status: 401,
        code: '2-1',
        human: 'The account was not found.',
    },
    tokenWrong: {
        status: 401,
        code: '2-2',
        human: 'The credentials provided are incorrect.',
    },
    noAuth: {
        status: 400,
        code: '2-3',
        human: 'The Bearer token is missing.',
    },
})
