import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasToken } from '../auth/auth'

export default ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            !hasToken() ? (
                <Component {...props} />
            ) : (
                <Redirect to="/info" />
            )
        )}
    />
)
