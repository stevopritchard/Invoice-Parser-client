import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    body: {
      background: theme.palette.background.default,
    },
  },
  mainArea: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 35,
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
  },
  lowerArea: {
    display: 'flex',
    justifyContent: 'center',
  },
  progress: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  footer: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
}));

export default useStyles;
