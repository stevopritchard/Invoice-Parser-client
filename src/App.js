import React, { useEffect, useReducer, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextDetection from './Containers/TextDetection/TextDetection';
import {
  BottomNavigation,
  CssBaseline,
  Divider,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';

import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import POList from './Components/Tables/POList';
import DocList from './Components/Tables/DocList';

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

async function searchBP(orderNumber) {
  let getOrderNumber = await fetch('http://localhost:5000/queryBp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ orderId: orderNumber }),
  });
  let foundOrder = await getOrderNumber.json();
  try {
    if (foundOrder !== null) {
      return foundOrder;
    }
  } catch (error) {
    console.log(error);
  }
}

const getInvoice = async (invoiceNumber) => {
  const response = await fetch('http://localhost:5000/queryInvoice', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ validNumber: invoiceNumber }),
  });
  const invoices = await response.json();
  console.log(invoices);
  try {
    if (invoices.length === 1) {
      if (
        'validNumber' in invoices[0] &&
        invoices[0].validNumber === parseInt(invoiceNumber)
      ) {
        console.log('truly valid');
        return true;
      } else {
        console.log('invalid');
        return false;
      }
    } else {
      throw new Error(`${invoiceNumber} is not a valid PO number`);
    }
  } catch (err) {
    console.log(err);
  }
};

function validateInvoiceNumber(invoice) {
  invoice.validNumber = invoice.purchaseOrders[0];
  return invoice;
}

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [savedDocs, setsavedDocs] = useState([]);
  const [open, setOpen] = useState();
  const [json, setJson] = useState({});
  const [searchStatus, setStatus] = useState('fulfilled');
  const snackText = useRef();

  useEffect(() => {
    console.log(json);
  }, [json]);

  async function getDocList() {
    let requestDocs = await fetch('http://localhost:5000/getAllInvoices', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let docList = await requestDocs.json();
    setsavedDocs(docList);
  }

  useEffect(() => {
    getDocList();
  }, []);

  const classes = useStyles();

  const theme = createTheme({
    palette: {
      // type: 'dark',
      primary: {
        main: '#03d1b2',
      },
      background: {
        default: '#292d2f',
      },
    },
    typography: {
      // fontFamily: 'Inter',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 300,
      fontWeightMedium: 300,
      fontWeightBold: 300,
    },
  });

  function clearText() {
    setInvoices([]);
  }

  const handleOpen = (isOpen, response) => {
    snackText.current = response;
    setOpen(isOpen);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const writeToFile = () => {
    invoices.forEach(async (invoice) => {
      let matchedNumbers = await getInvoice(invoice.validNumber);
      if (!matchedNumbers && invoice.validNumber) {
        const response = await fetch('http://localhost:5000/writeInvoice', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invoice),
        });
        const body = await response.json();
        invoice.updated = true;
        getDocList();
        return body;
      }
    });
    let checkAllUpdated = invoices.every((invoice) => {
      return invoice.updated === true;
    });
    if (checkAllUpdated) {
      handleOpen(true, `All documents updated successfully.`);
    } else {
      handleOpen(true, `Some records could not be updated.`);
    }
    setInvoices([]);
  };

  async function deleteInvoice(invoice) {
    await fetch('http://localhost:5000/deleteInvoice', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savedDocs[invoice]),
    });
    handleOpen(true, 'Record deleted.');
    getDocList();
  }

  //changes the above hook to useReducer
  const reducer = (state, action) => {
    switch (action.type) {
      case 'searchBP': {
        Promise.all(
          action.data.map((invoice) => {
            return validateInvoiceNumber(invoice);
          })
        ).then((valArr) => {
          let newArr = [...valArr];
          valArr.map(async (invoice, index) => {
            getInvoice(invoice.validNumber).then((alreadySaved) => {
              newArr[index].updated = alreadySaved;
            });
          });
          setInvoices(newArr);
        });
      }
      // eslint-disable-next-line no-fallthrough
      default:
        return state;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <div className={classes.root}>
          <Grid container spacing={3} className={classes.container}>
            <Grid item sm={2} />
            <Grid item sm={8}>
              <Paper variant="outlined">
                <Toolbar>
                  <Typography variant="h5" color="inherit">
                    Upload Invoice(s)
                  </Typography>
                </Toolbar>
                <Divider />
                <Grid container>
                  <TextDetection
                    keyDataToParent={dispatch}
                    clearText={clearText}
                    handleOpen={handleOpen}
                    setStatus={setStatus}
                  />
                </Grid>
                <main className={classes.mainArea}>
                  <Grid container spacing={3} className={classes.container}>
                    <Grid item sm={1} />
                    <Grid item sm={10}>
                      <Grid container>
                        {invoices.length > 0 ? (
                          <POList
                            invoices={invoices}
                            setJson={setJson}
                            searchBP={searchBP}
                            setInvoices={setInvoices}
                            checkDB={getInvoice}
                          />
                        ) : (
                          <DocList
                            savedDocs={savedDocs}
                            deleteInvoice={deleteInvoice}
                          />
                        )}
                      </Grid>
                    </Grid>
                    <Grid item sm={1} />
                  </Grid>
                  <Grid item sm={12} className={classes.lowerArea}>
                    <Snackbar
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      open={open}
                      autoHideDuration={6000}
                      onClose={handleClose}
                      message={snackText.current}
                    ></Snackbar>
                    <Button
                      variant="contained"
                      color="inherit"
                      type="button"
                      disableElevation
                      onClick={() => writeToFile()}
                      style={{
                        display: invoices.length > 0 ? '' : 'none',
                        backgroundColor: '#03d1b2',
                      }}
                    >
                      Save Documents
                    </Button>
                  </Grid>
                </main>
                <BottomNavigation>
                  {searchStatus === 'pending' ? (
                    <div className={classes.progress}>
                      <LinearProgress />
                    </div>
                  ) : null}
                </BottomNavigation>
              </Paper>
            </Grid>
            <Grid item sm={2} />
          </Grid>
        </div>
      </CssBaseline>
    </ThemeProvider>
  );
}
