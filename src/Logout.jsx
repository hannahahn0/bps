import React from 'react'
import { Redirect } from 'react-router-dom'
import withStyles from 'material-ui/styles/withStyles'
import Card, { CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import { logOut } from './auth'

export default withStyles({
    root: {
        textAlign: 'center',
    },
})(class extends React.Component {
    state = {
        success: false,
    }

    handleButtonClick = () => {
        logOut()
        this.setState({
            success: true,
        })
    }

    render() {
        const { props: { classes }, state: { success }, handleButtonClick } = this
        return (
            <Card className={classes.root}>
                <CardContent>
                    <h2>Log Out of PowerSchool</h2>
                    <Button onClick={handleButtonClick}>
                        Log Out
                    </Button>
                </CardContent>
                {success && <Redirect to="/login" />}
            </Card>
        )
    }
})
