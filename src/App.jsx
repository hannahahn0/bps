import React from 'react'
import { BrowserRouter as Router, Switch, Redirect, Link, Route } from 'react-router-dom'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import Login from './Login'
import Info from './Info'
import Settings from './Settings'
import Grades from './Grades'
import Nav from './Nav'
import { hasToken } from './auth'

const NotFound = withStyles({
    root: {
        textAlign: 'center',
    },
})(({ classes }) => (
    <Card className={classes.root}>
        <CardContent>
            <h2>404</h2>
            <h3>You seem a bit lost. Why not go to the main page?</h3>
            <Link to={hasToken() ? '/info' : '/login'}>
                <Button>Main Page</Button>
            </Link>
        </CardContent>
    </Card>
))

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            hasToken() ? (
                <Component {...props} />
            ) : (
                <Redirect to="/login" />
            )
        )}
    />
)

const PublicRoute = ({ component: Component, ...rest }) => (
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

const RootRedir = () => (
    <Redirect to={hasToken() ? '/info' : '/login'} />
)

export default withStyles({
    root: {
        transformStyle: 'preserve-3d',
        height: '100vh',
        width: '100vw',
    },
    contentRoot: {
        position: 'absolute',
        top: '43%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 10px)',
    },
    content: {
        position: 'relative',
        left: '50%',
        transform: 'translate(-50%, 0)',
    },
})(({ classes }) => (
    <Router>
        <div className={classes.root}>
            <div className={classes.contentRoot}>
                <Grid container>
                    <Grid item xs={12} sm={10} md={8} lg={6} className={classes.content}>
                        <Switch>
                            <Route path="/" exact component={RootRedir} />
                            <PublicRoute path="/login" component={Login} />
                            <PrivateRoute path="/info" component={Info} />
                            <PrivateRoute path="/settings" component={Settings} />
                            <PrivateRoute path="/grades" component={Grades} />
                            <Route path="/" component={NotFound} />
                        </Switch>
                    </Grid>
                </Grid>
            </div>
            <Route path="/" component={Nav} />
        </div>
    </Router>

))
