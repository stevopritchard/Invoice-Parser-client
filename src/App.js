import React, { useEffect, useReducer, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
import SavedInvoiceList from './Components/Tables/SavedInvoiceList';
import TextDetection from './Containers/TextDetection/TextDetection';
import getPurchaseOrder from './getPurchaseOrder';
import getSavedInvoices from './getSavedInvoices';
import deleteInvoice from './deleteInvoice';
import POList from './Components/Tables/POList';

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

function validateInvoiceNumber(invoice) {
  invoice.validNumber = invoice.purchaseOrders[0];

  return invoice;
}

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [savedInvoices, setsavedInvoices] = useState([]);
  const [open, setOpen] = useState();
  const [json, setJson] = useState({});
  const [searchStatus, setStatus] = useState('fulfilled');
  const snackText = useRef();

  // useEffect(() => {
  //   console.log(json, invoices);
  // }, [json]);

  useEffect(() => {
    getSavedInvoices().then((res) => setsavedInvoices(res));
  }, [invoices]);

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
      let matchedNumbers = await getPurchaseOrder(invoice.validNumber);

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

        getSavedInvoices();

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

  const readInvoice = (response) => {
    Promise.all(
      response.map((invoice) => {
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
  };
  //changes the above hook to useReducer
  const reducer = (state, action) => {
    switch (action.type) {
      case 'NEW_INVOICES':
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
                    readInvoice={readInvoice}
                    clearText={clearText}
                    handleOpen={handleOpen}
                    setStatus={setStatus}
                    setInvoices={setInvoices}
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
                            // setJson={setJson}
                            setInvoices={setInvoices}
                            // checkDB={getPurchaseOrder}
                          />
                        ) : (
                          <SavedInvoiceList
                            savedInvoices={savedInvoices}
                            deleteInvoice={deleteInvoice}
                            handleOpen={handleOpen}
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
