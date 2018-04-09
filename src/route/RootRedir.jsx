import React from 'react'
import { Redirect } from 'react-router-dom'
import { hasToken } from '../auth/auth'

export default () => (
    <Redirect to={hasToken() ? '/info' : '/login'} />
)
