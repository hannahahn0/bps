import React from 'react'

export default ({ classes, name, value }) => {
    if (value === null) {
        return null
    }
    return (
        <span className={classes.dialogText}>
            <span className={classes.label}>
                {name}
                {': '}
            </span>
            {value.percent}% ({value.letter})
        </span>
    )
}
