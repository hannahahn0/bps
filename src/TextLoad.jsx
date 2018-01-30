import React from 'react'
import withStyles from 'material-ui/styles/withStyles'

export default withStyles({
    blur: {
        filter: 'blur(6px)',
    },
    blurIn: {
        animation: 'blur-in 0.33s linear',
    },
    fadeOut: {
        opacity: 0,
        transition: 'opacity 0.33s linear',
        position: 'absolute',
    },
    '@keyframes blur-in': {
        '0%': {
            filter: 'blur(6px)',
        },
        '100%': {
            filter: 'blur(0px)',
        },
    },
})(({
    text,
    len,
    noLoad,
    classes,
}) => (
    <React.Fragment>
        {!noLoad && <span className={`${text ? classes.fadeOut : ''} ${classes.blur}`}>{'2'.repeat(len)}</span>}
        {text && <span className={noLoad ? '' : classes.blurIn}>{text}</span>}
    </React.Fragment>
))
