import React from 'react';
import useStyles from './useStyles';
import { Grid, Container, Button } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Dropzone from '../../Components/Dropzone/Dropzone';
import getInvoice from '../../getInvoice';
import validateFileFormat from './validateFileFormat';
import checkIfSaved from './checkIfSaved';

function TextDetection({ clearText, handleOpen, setStatus, setInvoices }) {
  const classes = useStyles();

  const uploadImage = async (images) => {
    setStatus('pending');

    var formData = new FormData();

    validateFileFormat(formData, images, handleOpen);

    const formResponse = await fetch('http://localhost:5000/getFormData', {
      method: 'post',
      body: formData,
    });

    const validInvoices = await formResponse.json();

    setInvoices((previousInvoices) =>
      [...previousInvoices].concat(checkIfSaved(validInvoices, getInvoice))
    );

    setStatus('fulfilled');
  };

  return (
    <Toolbar className={classes.root} variant="dense">
      <Grid item xs={4}></Grid>
      <Grid item xs={4} className={classes.dropzone}>
        <Dropzone uploadImage={uploadImage} />
      </Grid>
      <Grid item xs={4} className={classes.toolbarButtons}>
        <Container className={classes.buttonArea}>
          <Button
            variant="contained"
            color="default"
            type="button"
            disableElevation
            onClick={() => clearText()}
          >
            Clear
          </Button>
        </Container>
      </Grid>
    </Toolbar>
  );
}

export default TextDetection;
