import React from 'react'
import Divider from 'material-ui/Divider'
import TextLoad from '../TextLoad/TextLoad'

export default ({
    classes,
    grades,
    cached,
    code,
    onDialogChange,
}) => (
    grades.map((grade, idx) => (
        /* eslint-disable-next-line react/no-array-index-key */
        <React.Fragment key={idx}>
            <Divider />
            {/* eslint-disable
                jsx-a11y/click-events-have-key-events,
                jsx-a11y/no-noninteractive-element-interactions
            */}
            <h4
                className={classes.row}
                onClick={() => onDialogChange(idx)}
            >
                {/* eslint-enable */}
                <span className={classes.period}>
                    <TextLoad
                        len={7}
                        text={grade.period}
                        noLoad={cached}
                    />
                </span>
                <span className={classes.course}>
                    <TextLoad
                        loadClasses={classes.clip}
                        textClasses={classes.clip}
                        len={18}
                        text={grade.course}
                        noLoad={cached}
                    />
                </span>
                <span className={classes.score}>
                    <TextLoad
                        loadClasses={classes.score}
                        textClasses={classes.score}
                        len={3}
                        text={(() => {
                            if (grade.scores.y1) {
                                return `${grade.scores.y1.percent}%`
                            }
                            if (code) {
                                return ''
                            }
                            return undefined
                        })()}
                        noLoad={cached}
                    />
                </span>
            </h4>
        </React.Fragment>
    ))
)
