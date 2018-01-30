import React from 'react'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import request, { aborter } from './request'
import TextLoad from './TextLoad'

export default withStyles(theme => ({
    root: {
        textAlign: 'left',
    },
    content: {
        paddingTop: 0,
        paddingBottom: '6px !important',
        position: 'relative',
    },
    error: {
        color: '#f44336',
        textAlign: 'center',
    },
    row: {
        marginTop: 5,
        marginBottom: 5,
    },
    period: {
        textAlign: 'left',
        background: 'white',
        position: 'relative',
        zIndex: 999,
        paddingLeft: 10,
    },
    course: {
        right: 25,
        position: 'absolute',
    },
    headerText: {
        color: '#616161',
        paddingTop: 10,
        marginBottom: 10,
    },
    [theme.breakpoints.down('sm')]: {
        hideSm: {
            display: 'none',
        },
    },
}))(class extends React.Component {
    state = {
        grades: [...Array(10)].fill({
            teacher: {},
            scores: {
                q1: {},
                q2: {},
                s1: {},
                q3: {},
                q4: {},
                s2: {},
                y1: {},
            },
        }),
        error: null,
        cached: null,
    }

    componentDidMount() {
        request({
            endpoint: 'grades',
            includeToken: true,
            aborter: this.aborter,
            cached: true,
        }).then(this.aborter.abortCheck((({ data: { data }, cached }) => this.setState({
            grades: data,
            cached,
        }))), this.aborter.abortCheck(({ error, cached }) => this.setState({
            error,
            cached,
        })))
    }

    componentWillUnmount() {
        this.aborter.abort()
    }

    aborter = aborter()

    render() {
        const { props: { classes }, state: { grades, error, cached } } = this
        return (
            <Card className={classes.root}>
                <CardContent className={classes.content}>
                    <div className={classes.grade}>
                        <h4 className={`${classes.row} ${classes.headerText}`}>
                            <span className={classes.period}>Period</span>
                            <span className={classes.course}>Course</span>
                        </h4>
                    </div>
                    {error ? (
                        <h2 className={classes.error}>{error.message}</h2>
                    ) : (
                        /* eslint-disable react/no-array-index-key */
                        grades.map((grade, idx) => (
                            <React.Fragment key={idx}>
                                <Divider />
                                <h4 className={classes.row}>
                                    <span className={classes.period}>
                                        <TextLoad
                                            len={7}
                                            text={grade.period}
                                            noLoad={cached}
                                        />
                                    </span>
                                    <span className={classes.course}>
                                        <TextLoad
                                            len={12}
                                            text={grade.course}
                                            noLoad={cached}
                                        />
                                    </span>
                                </h4>
                            </React.Fragment>
                        ))
                        /* eslint-enable */
                    )}
                </CardContent>
            </Card>
        )
    }
})
