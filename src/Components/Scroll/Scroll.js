import React from 'react';
import { makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
    scroll: {
        overflowY: 'scroll',
        maxHeight: 'calc(100vh - 150px)',
        height: '100%',
    }
}))

const Scroll = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.scroll}>
            {props.children}
        </div>
    )
}

export default Scroll