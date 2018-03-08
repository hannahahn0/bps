import React from 'react'
import { Redirect } from 'react-router-dom'
import { logOut } from './auth'

const unauthCode = '2-2'

export default class extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.code !== this.props.code && nextProps.code === unauthCode) {
            logOut()
        }
    }

    render() {
        const { props: { code } } = this
        if (code === unauthCode) {
            return (
                <Redirect to="/login" />
            )
        }
        return null
    }
}
