import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container, Button } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Dropzone from '../../Components/Dropzone/Dropzone';
import getPurchaseOrder from '../../getPurchaseOrder';
import validateInvoiceNumber from '../../validateInvoiceNumber';

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

function TextDetection({
  // readInvoice,
  clearText,
  handleOpen,
  setStatus,
  setInvoices,
}) {
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

    // readInvoice(Object.values(formResponseData));

    Promise.all(
      Object.values(formResponseData).map((invoice) => {
        return validateInvoiceNumber(invoice);
      })
    ).then((validInvoices) => {
      let currentInvoices = [...validInvoices];

      validInvoices.map(async (invoice, index) => {
        getPurchaseOrder(invoice.validNumber).then((alreadySaved) => {
          currentInvoices[index].updated = alreadySaved;
        });
      });
      setInvoices(currentInvoices);
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
