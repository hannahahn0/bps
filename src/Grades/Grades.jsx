import React from 'react'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import request, { aborter } from '../request/request'
import RequestErrorHandler from '../request/RequestErrorHandler'
import GradesDialog from './GradesDialog'
import GradesHeader from './GradesHeader'
import GradesContent from './GradesContent'

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
        margin: 0,
        paddingTop: 5,
        paddingBottom: 5,
        cursor: 'pointer',
    },
    period: {
        textAlign: 'left',
        position: 'relative',
        paddingLeft: 10,
    },
    course: {
        position: 'absolute',
        left: 100,
        width: 'calc(100% - 140px)',
    },
    score: {
        right: 0,
        position: 'absolute',
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
        cursor: 'initial !important',
    },
    label: {
        color: '#616161',
    },
    dialogText: {
        display: 'block',
        marginBottom: 10,
    },
    dialogContent: {
        padding: 20,
    },
    dialogScores: {
        marginLeft: 15,
    },
    none: {
        fontStyle: 'italic',
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
            scores: {},
        }),
        error: null,
        cached: null,
        code: null,
        openGrade: null,
        dialogOpen: false,
    }

    componentDidMount() {
        request({
            endpoint: 'grades',
            includeToken: true,
            aborter: this.aborter,
            cached: true,
        }).then(this.aborter.abortCheck((({ data: { code, data }, cached }) => this.setState({
            grades: data,
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

    handleDialogChange = (idx) => {
        if (!this.state.code) {
            return
        }
        this.setState({
            openGrade: idx,
            dialogOpen: true,
        })
    }

    handleDialogClose = () => this.setState({
        dialogOpen: false,
    })

    render() {
        const {
            state: {
                grades, error, cached, code, openGrade, dialogOpen,
            },
            props: { classes },
        } = this
        const dialogGrade = grades[openGrade]
        return (
            <React.Fragment>
                <Card className={classes.root}>
                    <CardContent className={`${classes.content} ${!error ? classes.contentLoaded : ''}`}>
                        {error ? (
                            <h2 className={classes.error}>{error}</h2>
                        ) : (
                            <div className={classes.table}>
                                <GradesHeader classes={classes} />
                                <GradesContent
                                    classes={classes}
                                    grades={grades}
                                    cached={cached}
                                    code={code}
                                    onDialogChange={this.handleDialogChange}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
                {dialogGrade && (
                    <GradesDialog
                        classes={classes}
                        grade={dialogGrade}
                        open={dialogOpen}
                        onDialogClose={this.handleDialogClose}
                    />
                )}
                <RequestErrorHandler code={code} />
            </React.Fragment>
        )
    }
})
