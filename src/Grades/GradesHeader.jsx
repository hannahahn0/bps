import React from 'react'

export default ({ classes }) => (
    <h4 className={`${classes.row} ${classes.headerText}`}>
        <span className={classes.period}>Period</span>
        <span className={classes.course}>Course</span>
        <span className={classes.score}>Score</span>
    </h4>
)
