import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Container, Card, Button } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Dropzone from '../../Components/Dropzone/Dropzone';

const useStyles = makeStyles((theme) => ({
  root:{
    display: 'flex',
    flexGrow: 1,
    margin: theme.spacing(1)
  },
  dropzone:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
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

function TextDetection({ keyDataToParent, clearText, handleOpen, setStatus }) {
  const classes = useStyles()

  var dummyData = [
    {
      name: 'Naylor 81091331 .jpg',
      purchaseOrders: [ '342010','146499' ],
      date: '19/02/2021',
      updated: false
    },
    {
      name: 'Eccles 61275.jpg',
      purchaseOrders: [ '146865' ],
      date: '16/02/2021',
      updated: false
    },
    {
      name: 'no-po.jpg',
      purchaseOrders: [ '999999' ],
      date: '01/01/2021',
      updated: false
    }
  ]
  
  const uploadImage = async (images) => {
    setStatus("pending")
    var formData = new FormData();
    images.forEach(image => {
      if (image.path.split('.').pop() === 'jpg' || image.path.split('.').pop() === 'png') {
        formData.append('photo', image)
      } else {
        handleOpen(true, 'One or more files is of an invalid format.')
        return
      }
    })
    const formResponse = await fetch('https://tranquil-yellowstone-86058.herokuapp.com/getFormData', {
      method: "post",
      body: formData
    })
    const formResponseData = await formResponse.json();
    // const tableResponse = await fetch('/getTableData', {
    //   method: "post",
    //   body: formData
    // })

    // const tableResponseData = await tableResponse.json();
    // console.log(tableResponseData)
    keyDataToParent({type: 'searchBP', data: Object.values(formResponseData)})

    // keyDataToParent2(Object.values(formResponseData))
    setStatus("fulfilled")
  }

  return (
    // <Grid className={classes.root}>
    <Toolbar className={classes.root} variant="dense">
      <Grid item xs={5}>
        Dashboard
      </Grid>
      <Grid item xs={3} className={classes.dropzone}>
        <Card 
          variant="outlined" 
          style={{border: '2px dashed gray'}}
          className={classes.dropzoneCard}
        >
          <Dropzone uploadImage = {uploadImage}/>
        </Card>
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
        {/* <Container className={classes.buttonArea}>
          <Button 
            variant="outlined" 
            type="button" 
            disableElevation 
            onClick={() => keyDataToParent({type: 'searchBP', data: dummyData})}
          >
            Static
          </Button>
        </Container> */}
        {/* <Container className={classes.buttonArea}>
          <Button
            variant="contained"
            color="default"
            type="button"
            disableElevation 
          >
            Logout
          </Button>
        </Container> */}
      </Grid>
    </Toolbar>
    // </Grid>
  );
}

export default TextDetection;
