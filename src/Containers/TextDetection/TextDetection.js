import React from 'react';
import useStyles from './useStyles';
import { Grid, Container, Button } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Dropzone from '../../Components/Dropzone/Dropzone';
import getInvoice from '../../getInvoice';
import validateInvoiceNumber from '../../validateInvoiceNumber';

function TextDetection({ clearText, handleOpen, setStatus, setInvoices }) {
  const classes = useStyles();

  const uploadImage = async (images) => {
    setStatus('pending');
    var formData = new FormData();

    images.forEach((image) => {
      if (
        image.path.split('.').pop() === 'jpg' ||
        image.path.split('.').pop() === 'png'
      ) {
        formData.append('photo', image);
      } else {
        handleOpen(true, 'One or more files is of an invalid format.');
        return;
      }
    });

    const formResponse = await fetch('http://localhost:5000/getFormData', {
      method: 'post',
      body: formData,
    });

    const formResponseData = await formResponse.json();

    Promise.all(
      Object.values(formResponseData).map((invoice) => {
        return {
          ...invoice,
          validRefNumber: invoice.candidateRefNumbers.find((refNumber) => {
            return validateInvoiceNumber(refNumber);
          }),
        };
      })
    ).then((validInvoices) => {
      let currentInvoices = [...validInvoices];

      validInvoices.forEach(async (invoice, index) => {
        getInvoice(invoice.validRefNumber).then((alreadySaved) => {
          currentInvoices[index].updated = alreadySaved;
        });
      });
      setInvoices((previousInvoices) =>
        [...previousInvoices].concat(currentInvoices)
      );
    });
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
