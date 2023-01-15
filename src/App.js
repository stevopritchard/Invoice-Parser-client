import React, { useEffect, useReducer, useRef, useState } from 'react';
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
import useStyles from './useStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import SavedInvoiceList from './Components/Tables/SavedInvoiceList';
import TextDetection from './Containers/TextDetection/TextDetection';
import getSavedInvoices from './getSavedInvoices';
import writeInvoice from './writeInvoice';
import deleteInvoice from './deleteInvoice';
import POList from './Components/Tables/POList';

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [savedInvoices, setsavedInvoices] = useState([]);
  const [open, setOpen] = useState();
  // const [json, setJson] = useState({});
  const [searchStatus, setStatus] = useState('fulfilled');
  const snackText = useRef();

  // useEffect(() => {
  //   console.log(json, invoices);
  // }, [json]);

  useEffect(() => {
    getSavedInvoices().then((res) => setsavedInvoices(res));
  }, [savedInvoices]);

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

  const clearText = () => {
    setInvoices([]);
  };

  const handleOpen = (isOpen, response) => {
    snackText.current = response;
    setOpen(isOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // //changes the above hook to useReducer
  // const reducer = (state, action) => {
  //   switch (action.type) {
  //     case 'NEW_INVOICES':
  //     // eslint-disable-next-line no-fallthrough
  //     default:
  //       return state;
  //   }
  // };

  // // eslint-disable-next-line no-unused-vars
  // const [state, dispatch] = useReducer(reducer, []);

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
                      onClick={() =>
                        invoices.forEach((invoice) => {
                          writeInvoice(invoice);
                          if (
                            invoices.every(
                              (invoice) => invoice.updated === true
                            )
                          ) {
                            handleOpen(
                              true,
                              `All documents updated successfully.`
                            );
                          } else {
                            handleOpen(
                              true,
                              `Some records could not be updated.`
                            );
                          }
                          setInvoices([]);
                        })
                      }
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
