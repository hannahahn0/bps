# bps
A Better PowerSchool

## Premise

The PowerSchool site is terrible. This project aims to fix that.

There are two main components to this project:
 * The server (lambda functions)
 * The client (React)

The server scrapes the PowerSchool site and it's SOAP (:sob:), and provides a RESTful API to the React client.

## Deployment

This project has been configured to be deployed on [Netlify](https://www.netlify.com). However, this project makes use of their server-side lambda functions, which are currently in a private beta. If you have access to those, you can click this button.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ginkoid/bps)

However, with a bit of finagling, you can also deploy this on any other platform. The lambda functions are in `src/lambda/routes`, and must be compiled with `yarn build:lambda` before being deployed. However, `yarn build:env` must be run before `build:lambda`.

`build:env` requires environment variables `PS_SERVER` and `STUDENT_EMAIL_DOMAIN` to be set.
* `PS_SERVER` is the url of the PowerSchool server, including the protocol.
* `STUDENT_EMAIL_DOMAIN` is the FQDN of domain where all the students have emails.

The React frontend is in `src`, and must be compiled with `yarn build:react`.

Or, you can build everything with `yarn build`. Just make sure the environment variables are set.

## Development

Start watching the lambda functions with `yarn start:lambda`.

However, `yarn build:env` must be run before this. For development, you can create the file `.env.lambda` instead of having to specify environment variables every time. This file should look something like this:

```json
{
    "PS_SERVER": "https://ps.example.com",
    "STUDENT_EMAIL_DOMAIN": "example.net"
}
```

Start watching the React with `yarn start:react`.

Or, start everything with `yarn start`.

## Server API

The server currently has three endpoints, `login`, `info`, and `grades`. If you have deployed to Netlify, you can send requests to `/.netlify/functions/ENDPOINT`.

### Authentication

All endpoints except `login` require bearer token authentication, in the `Authorization` header.

You can get a bearer token from sending a request to the `login` endpoint.

### Responses

The current responses are listed in the [responses file](https://github.com/ginkoid/bps/blob/master/src/lambda/with/responses.js). A response would look like

```json
{
    // code for that response (responses[i].code)
    "code": "0-0",
    // human readable description of response (responses[i].code)
    "human": "The login is successful",
    // specific data about the response (documented in individual endpoints)
    "data": {
        "token": "..."
    }
}
```

### Client Error Responses

These errors may be returned for any request, and are not documented on the individual endpoint sections.

Codes `4-0`, `4-1`, `4-2`, and `4-3` are all client errors.

### Authentication Error Responses

These errors may be returned for any request which requires authentication, and are not documented on the individual endpoint sections.

Codes `2-1`, `2-2`, and `2-3` are all authentication errors.

### Server Error Responses

The code `1-0` may be returned when an internal server error occurs.

### `login` (`POST`)

This endpoint logs users into bps by returning a bearer token necessary for later requests if the credentials provided are valid.

`login` requires fields `username` and `password`, and will return codes `0-0`, `2-0`, `2-1`, `3-0`, or `3-1`.

If the code is `0-0`, the `data.token` field will be the bearer token necessary to authenticate later requests.

### `info` (`GET`)

This endpoint retreives information about the student when authentication is provided.

`info` will return codes `0-1` or `3-0`.

If the code is `0-1`, the `data` field will contain the fields `email`, `givenName`, `grade`, `homeroom`, `id`, `surName`, `team`, and `username`. These fields all contain information about the student.

### `grades` (`GET`)

This endpoint retreives overall grade information for the student when authentication is provided.

`grades` will return codes `0-2` or `3-0`.

If the code is `0-2`, the `data` field will be an array, each element containing the fields `course`, `period`, `room`, `scores`, and `teacher`.

`scores` will contain the fields `q1`, `q2`, `s1`, `q3`, `q4`, `s2`, `y1` (Quarter 1,2,3,4 & Semester 1,2 & Year 1). If scores are found for these timeframes, each score will contain the fields `letter` and `percent`. Otherwise, the score will be `null`.

`teacher` will contain two fields if the teacher is found, `givenName` and `surName`. Otherwise, the teacher will be `null`.

## React Client

The React client is a simple frontend to the server API.

Once the user is logged in, it stores the bearer token in the `token` field in `localStorage`.

When logged in, the user can navigate to the various pages, while the client loads data from the API as the user navigates. The client uses response caching to prevent unnecessary requests while navigating between pages.

The client uses skeleton screens to make loading times appear faster to the user.

###### Made by [Philip Papurt](https://github.com/ginkoid) and licensed with [MIT](https://raw.githubusercontent.com/ginkoid/bps/master/LICENSE)
