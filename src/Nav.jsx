import React from 'react'
import { Link } from 'react-router-dom'
import withStyles from 'material-ui/styles/withStyles'
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation'
import InfoIcon from 'material-ui-icons/Info'
import GradeIcon from 'material-ui-icons/Grade'
import SettingsIcon from 'material-ui-icons/Settings'
import { hasToken } from './auth'

const NavButton = ({ value, classes, ...rest }) => (
    <Link to={value} tabIndex={-1}>
        <BottomNavigationAction {...rest} value={value} className={`${classes.navButton} ${classes.navButtonSm}`} />
    </Link>
)

const Nav = withStyles(theme => ({
    navButton: {
        width: 160,
    },
    [theme.breakpoints.down('xs')]: {
        navButtonSm: {
            width: 130,
        },
    },
    root: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100vw',
    },
}))(({ classes, location: { pathname } }) => {
    if (!hasToken()) {
        return null
    }
    return (
        <BottomNavigation
            value={pathname}
            showLabels={window.innerWidth > 380}
            className={classes.root}
        >
            <NavButton value="/grades" label="Grades" icon={<GradeIcon />} classes={classes} />
            <NavButton value="/info" label="Info" icon={<InfoIcon />} classes={classes} />
            <NavButton value="/settings" label="Settings" icon={<SettingsIcon />} classes={classes} />
        </BottomNavigation>
    )
})

export default Nav
