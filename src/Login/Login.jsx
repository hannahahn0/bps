import React from 'react'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import LinearProgress from 'material-ui/Progress/LinearProgress'
import { Redirect } from 'react-router-dom'
import request, { aborter, clearCache } from '../request/request'
import { setToken } from '../auth/auth'

export default withStyles({
    root: {
        textAlign: 'center',
    },
    button: {
        marginTop: 0,
    },
    password: {
        marginTop: 15,
    },
    shaking: {
        animation: 'shake 0.8s cubic-bezier(.36, .07, .19, .97) both',
    },
    '@keyframes shake': {
        '10%, 90%': {
            transform: 'translate3d(-4px, 0, 0)',
        },
        '20%, 80%': {
            transform: 'translate3d(8px, 0, 0)',
        },
        '30%, 50%, 70%': {
            transform: 'translate3d(-17px, 0, 0)',
        },
        '40%, 60%': {
            transform: 'translate3d(17px, 0, 0)',
        },
    },
    error: {
        color: '#f44336',
        marginTop: 18,
        marginBottom: 13,
    },
    errorSpacer: {
        height: 48,
    },
    loader: {
        height: 6,
    },
    content: {
        paddingBottom: '20px !important',
        paddingTop: 5,
    },
})(class extends React.Component {
    state = {
        username: '',
        password: '',
        error: '',
        success: false,
        shaking: false,
        loading: false,
    }

    componentWillMount() {
        clearCache()
    }

    componentWillUnmount() {
        this.aborter.abort()
    }

    aborter = aborter()

    handleUsernameChange = ({ target: { value } }) => this.setState({
        username: value,
    })

    handlePasswordChange = ({ target: { value } }) => this.setState({
        password: value,
    })

    handleFormSubmit = (evt) => {
        evt.preventDefault()
        this.setState({
            loading: true,
        })
        request({
            type: 'POST',
            endpoint: 'login',
            data: { username: this.state.username, password: this.state.password },
            aborter: this.aborter,
        }).then(this.aborter.abortCheck(({ data: { data: { token } } }) => {
            setToken(token)
            this.setState({
                success: true,
            })
        }), this.aborter.abortCheck((error) => {
            this.setState({
                loading: false,
            })
            if (error.code === '2-1') {
                this.usernameInputRef.focus()
                this.usernameInputRef.select()
            } else if (error.code === '2-0') {
                this.passwordInputRef.focus()
                this.passwordInputRef.select()
            }
            if (this.state.shaking) return
            this.setState({
                error: error.message,
                shaking: true,
            })
            setTimeout(() => this.setState({
                shaking: false,
            }), 800)
        }))
    }

    handlePasswordInputRef = (el) => {
        this.passwordInputRef = el
    }

    handleUsernameInputRef = (el) => {
        this.usernameInputRef = el
    }

    render() {
        const {
            handleUsernameChange,
            handlePasswordChange,
            handleFormSubmit,
            state: {
                username,
                password,
                success,
                shaking,
                error,
                loading,
            },
            props: { classes },
        } = this
        return (
            <Card className={`${classes.root} ${shaking ? classes.shaking : ''}`}>
                {loading ? (
                    <LinearProgress className={classes.loader} />
                ) : (
                    <div className={classes.loader} />
                )}
                <CardContent className={classes.content}>
                    <h2>Log in to PowerSchool</h2>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            onChange={handleUsernameChange}
                            value={username}
                            fullWidth
                            autoFocus
                            label="Username"
                            autoComplete="username"
                            required
                            type="text"
                            InputLabelProps={{ required: false }}
                            inputRef={this.handleUsernameInputRef}
                        />
                        <TextField
                            onChange={handlePasswordChange}
                            value={password}
                            fullWidth
                            label="Password"
                            autoComplete="current-password"
                            required
                            type="password"
                            InputLabelProps={{ required: false }}
                            className={classes.password}
                            inputRef={this.handlePasswordInputRef}
                        />
                        {error ? (
                            <h4 className={classes.error}>{error}</h4>
                        ) : (
                            <div className={classes.errorSpacer} />
                        )}
                        <Button type="submit" className={classes.button} disabled={loading}>Log In</Button>
                    </form>
                </CardContent>
                {success && <Redirect to="/info" />}
            </Card>
        )
    }
})
