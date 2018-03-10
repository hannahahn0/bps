import React from 'react'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import TextLoad from '../TextLoad/TextLoad'
import request, { aborter } from '../request/request'
import RequestErrorHandler from '../request/RequestErrorHandler'

export default withStyles({
    root: {
        textAlign: 'left',
    },
    name: {
        float: 'left',
        marginTop: 3,
    },
    id: {
        float: 'right',
        marginTop: 3,
        marginLeft: 10,
    },
    spacer: {
        height: 44,
    },
    label: {
        color: '#616161',
    },
    username: {
        float: 'right',
        position: 'relative',
        bottom: 18,
        marginLeft: 10,
    },
    content: {
        paddingBottom: '16px !important',
    },
    error: {
        color: '#f44336',
        textAlign: 'center',
    },
})(class extends React.Component {
    state = {
        info: 0,
        error: null,
        cached: false,
    }

    componentDidMount() {
        request({
            endpoint: 'info',
            includeToken: true,
            aborter: this.aborter,
            cached: true,
        }).then(this.aborter.abortCheck((({ data: { data, code }, cached }) => this.setState({
            info: data,
            cached,
            code,
        }))), this.aborter.abortCheck(({ code, message, cached }) => this.setState({
            error: message,
            cached,
            code,
        })))
    }

    componentWillUnmount() {
        this.aborter.abort()
    }

    aborter = aborter()

    render() {
        const {
            state: {
                info, error, cached, code,
            },
            props: { classes },
        } = this
        return (
            <Card className={classes.root}>
                <CardContent className={classes.content}>
                    {error ? (
                        <h2 className={classes.error}>{error}</h2>
                    ) : (
                        <React.Fragment>
                            <h2 className={classes.name}>
                                <TextLoad len={10} text={info.givenName} noLoad={cached} />
                                {' '}
                                <TextLoad len={5} text={info.surName} noLoad={cached} />
                            </h2>
                            <h2 className={classes.id}>
                                #
                                <TextLoad len={7} text={info.id} noLoad={cached} />
                            </h2>
                            <div className={classes.spacer} />
                            <h3>
                                <span className={classes.label}>Grade: </span>
                                <TextLoad len={1} text={info.grade} noLoad={cached} />
                            </h3>
                            <h3>
                                <span className={classes.label}>Team: </span>
                                <TextLoad len={8} text={info.team} noLoad={cached} />
                            </h3>
                            <h3 className={classes.username}>
                                <TextLoad len={8} text={info.username} noLoad={cached} />
                            </h3>
                            <h3>
                                <span className={classes.label}>Homeroom: </span>
                                <TextLoad len={5} text={info.homeroom} noLoad={cached} />
                            </h3>
                        </React.Fragment>
                    )}
                </CardContent>
                <RequestErrorHandler code={code} />
            </Card>
        )
    }
})
