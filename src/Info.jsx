import React from 'react'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import { Link } from 'react-router-dom'
import Button from 'material-ui/Button'
import { logOut } from './auth'
import request, { aborter } from './request'

const BlurredText = withStyles({
    blur: {
        filter: 'blur(6px)',
    },
})(({ len, classes }) => (
    <span className={classes.blur}>{'2'.repeat(len)}</span>
))

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
})(class extends React.Component {
    state = {
        info: 0,
    }

    componentDidMount() {
        request({
            endpoint: 'info',
            includeToken: true,
            aborter: this.aborter,
        }).then((({ data }) => this.setState({
            info: data,
        })), error => this.setState({
            error,
        }))
    }

    aborter = aborter()

    render() {
        const { state: { info }, props: { classes } } = this
        return (
            <Card className={classes.root}>
                <CardContent className={classes.content}>
                    <h2 className={classes.name}>
                        {
                            info.givenName || (
                                <React.Fragment>
                                    <BlurredText len={5} />
                                    {' '}
                                    <BlurredText len={5} />
                                </React.Fragment>
                            )
                        } {
                            info.surName || <BlurredText len={5} />
                        }
                    </h2>
                    <h2 className={classes.id}>#{info.id || <BlurredText len={7} />}</h2>
                    <div className={classes.spacer} />
                    <h3>
                        <span className={classes.label}>Grade: </span>
                        {info.grade || <BlurredText len={1} />}
                    </h3>
                    <h3>
                        <span className={classes.label}>Team: </span>
                        {info.team || <BlurredText len={7} />}
                    </h3>
                    <h3 className={classes.username}>
                        {info.username || <BlurredText len={8} />}
                    </h3>
                    <h3>
                        <span className={classes.label}>Homeroom: </span>
                        {info.homeroom || <BlurredText len={5} />}
                    </h3>
                    <Link to="/login">
                        <Button onClick={logOut}>
                            Log Out
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }
})
