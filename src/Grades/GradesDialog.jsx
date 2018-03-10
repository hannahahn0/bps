import React from 'react'
import Dialog from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import ScoreDisplay from './ScoreDisplay'

export default ({
    classes,
    grade,
    open,
    onDialogClose,
}) => (
    <Dialog
        open={open}
        onClose={onDialogClose}
    >
        <h4 className={classes.dialogContent}>
            <span className={classes.dialogText}>
                <span className={classes.label}>Period: </span>
                {grade.period || <span className={classes.none}>None</span>}
            </span>
            <span className={classes.dialogText}>
                <span className={classes.label}>Course: </span>
                {grade.course || <span className={classes.none}>None</span>}
            </span>
            <span className={classes.dialogText}>
                <span className={classes.label}>Room: </span>
                {grade.room || <span className={classes.none}>None</span>}
            </span>
            <span className={classes.dialogText}>
                <span className={classes.label}>Teacher: </span>
                {grade.teacher ? (
                    `${grade.teacher.givenName} ${grade.teacher.surName}`
                ) : (
                    <span className={classes.none}>None</span>
                )}
            </span>
            {!Object.keys(grade.scores).every(key => grade.scores[key] === null) && (
                <React.Fragment>
                    <span className={classes.dialogText}>
                        <span className={classes.label}>Scores</span>
                    </span>
                    <span className={`${classes.dialogText} ${classes.dialogScores}`}>
                        <ScoreDisplay classes={classes} name="Q1" value={grade.scores.q1} />
                        <ScoreDisplay classes={classes} name="Q2" value={grade.scores.q2} />
                        <ScoreDisplay classes={classes} name="S1" value={grade.scores.s1} />
                        <ScoreDisplay classes={classes} name="Q3" value={grade.scores.q3} />
                        <ScoreDisplay classes={classes} name="Q4" value={grade.scores.q4} />
                        <ScoreDisplay classes={classes} name="S2" value={grade.scores.s2} />
                        <ScoreDisplay classes={classes} name="Y1" value={grade.scores.y1} />
                    </span>
                </React.Fragment>
            )}
        </h4>
        <Button onClick={onDialogClose}>Close</Button>
    </Dialog>
)
