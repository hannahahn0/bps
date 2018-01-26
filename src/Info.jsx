import React from 'react'
import { Link } from 'react-router-dom'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import { getToken, logOut } from './auth'

export default withStyles({
    root: {
        textAlign: 'center',
    },
})(({ classes }) => (
    <Card className={classes.root}>
        <CardContent>
            <h3>Your PSAID token is: <br /> <br /> {getToken()}</h3>
            <Link to="/login">
                <Button onClick={logOut}>Log Out</Button>
            </Link>
        </CardContent>
    </Card>
))
