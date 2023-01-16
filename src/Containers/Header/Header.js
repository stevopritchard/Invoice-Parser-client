import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function Header({ darkState, handleDarkMode }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="absolute">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          ></IconButton>
          <Typography variant="h6" color="inherit">
            Image Character Recognition
          </Typography>
          {/* <Switch checked={darkState} onChange={handleDarkMode}/> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
