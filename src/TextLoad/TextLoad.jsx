import React from 'react'
import withStyles from 'material-ui/styles/withStyles'

export default withStyles({
    blur: {
        filter: 'blur(6px)',
    },
    blurIn: {
        animation: 'bps-blur-in 0.33s linear',
    },
    fadeOut: {
        opacity: 0,
        transition: 'opacity 0.33s linear',
        position: 'absolute',
    },
    '@keyframes bps-blur-in': {
        '0%': {
            filter: 'blur(6px)',
        },
        '100%': {
            filter: 'blur(0px)',
        },
    },
})(class extends React.Component {
    state = {
        blurDone: false,
    }

    componentDidMount() {
        if (this.props.text) {
            this.blurRemoveTimeout = setTimeout(this.blurRemoveTimeoutFunc, 330)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.text && this.props.text !== nextProps.text) {
            this.blurRemoveTimeout = setTimeout(this.blurRemoveTimeoutFunc, 330)
        }
    }

    componentWillUnmount() {
        if (this.blurRemoveTimeout) {
            clearTimeout(this.blurRemoveTimeout)
        }
    }

    blurRemoveTimeoutFunc = () => this.setState({
        blurDone: true,
    })

    blurRemoveTimeout = null

    render() {
        const {
            props: {
                text,
                len,
                noLoad,
                classes,
                loadClasses = '',
                textClasses = '',
            },
            state: {
                blurDone,
            },
        } = this
        const textLoaded = text !== undefined
        return (
            <React.Fragment>
                {!noLoad && !blurDone && (
                    <span className={`${textLoaded ? classes.fadeOut : ''} ${classes.blur} ${loadClasses}`}>
                        {'2'.repeat(len)}
                    </span>
                )}
                {textLoaded && (
                    <span className={`${noLoad ? '' : classes.blurIn} ${textClasses}`}>
                        {text}
                    </span>
                )}
            </React.Fragment>
        )
    }
})
