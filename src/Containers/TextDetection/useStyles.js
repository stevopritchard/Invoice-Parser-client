import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    margin: theme.spacing(1),
  },
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dropzoneCard: {
    // marginBottom: 40,
  },
  buttonArea: {
    display: 'flex',
    justifyContent: 'center',
  },
  toolbarButtons: {
    display: 'flex',
    marginLeft: 'auto',
  },
}));

export default useStyles;
