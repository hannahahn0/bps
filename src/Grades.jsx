import React from 'react'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import request, { aborter } from './request'
import TextLoad from './TextLoad'
import RequestErrorHandler from './RequestErrorHandler'

export default withStyles(theme => ({
    root: {
        textAlign: 'left',
    },
    content: {
        paddingBottom: '16px !important',
        position: 'relative',
    },
    contentLoaded: {
        paddingBottom: '0 !important',
    },
    table: {
        position: 'relative',
        bottom: 15,
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
        position: 'relative',
        paddingLeft: 10,
    },
    course: {
        position: 'absolute',
        left: 170,
        width: 'calc(100% - 186px)',
    },
    clip: {
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
        display: 'block',
        overflow: 'hidden',
        width: '100%',
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
                grades, error, cached, code,
            },
            props: { classes },
        } = this
        return (
            <Card className={classes.root}>
                <CardContent className={`${classes.content} ${classes.contentLoaded}`}>
                    {error ? (
                        <h2 className={classes.error}>{error}</h2>
                    ) : (
                        <div className={classes.table}>
                            <div className={classes.grade}>
                                <h4 className={`${classes.row} ${classes.headerText}`}>
                                    <span className={classes.period}>Period</span>
                                    <span className={classes.course}>Course</span>
                                </h4>
                            </div>

                            {grades.map((grade, idx) => (
                                /* eslint-disable-next-line react/no-array-index-key */
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
                                                textClasses={classes.clip}
                                                loadClasses={classes.clip}
                                                len={15}
                                                text={grade.course}
                                                noLoad={cached}
                                            />
                                        </span>
                                    </h4>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </CardContent>
                <RequestErrorHandler code={code} />
            </Card>
        )
    }
})
