import React from 'react'
import withStyles from 'material-ui/styles/withStyles'
import { Link } from 'react-router-dom'
import Card, { CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import { hasToken } from '../auth/auth'

export default withStyles({
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
