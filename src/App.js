import React, { useCallback, useEffect, useReducer, useRef, useState }from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import TextDetection from './Containers/TextDetection/TextDetection';
import { green } from '@material-ui/core/colors'
import { BottomNavigation } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';

import { createMuiTheme , ThemeProvider } from '@material-ui/core/styles'
import {
  orange,
  lightBlue,
  deepPurple,
  deepOrange
} from "@material-ui/core/colors";
import POList from './Components/Tables/POList';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  mainArea:{
    display: 'flex',
    flexDirection: 'column',
    marginTop: 35,
    // height: 'calc(100vh-35px)',
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
    justifyContent: 'center'
  },
  progress: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    }
  },
  footer: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  }
}))

export default function App() {
  const [darkState, setDarkState ] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen ] = useState() 
  const [json, setJson] = useState({})
  const [searchStatus, setStatus] = useState("fulfilled")
  const snackText = useRef()

  useEffect(() => {
    console.log(json)
  }, [json])

  const classes = useStyles()

  const palletType = darkState ? "dark" : "light";
  const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
  const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];

  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
    },
    primary: {
      main: mainPrimaryColor
    },
    secondary: {
      main: mainSecondaryColor
    },
    sendToBP: {
      palette: green
    }
  });

  const handleThemeChange = () => {
    setDarkState(!darkState)
  };

  function clearText() {
    // setInvoices([{
    //   name: invoices[0].originalname || '',
    //   purchaseOrders: [],
    //   validNumber: '',
    //   date: '',
    // }])
    setInvoices([])
  }

  async function searchBP (orderNumber) {
    let findOrder = await fetch('https://tranquil-yellowstone-86058.herokuapp.com/queryBp', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({orderId: orderNumber})
    })
    let foundOrder = await findOrder.json()
    try {
      if (foundOrder !== null) {
        return foundOrder
      } 
      // else {
      //   throw new Error(`Could not find matching order for ref ${orderNumber}`)
      // }
    }
    catch (err) {
      console.log(err)
    }
  }

  //above function wrapped in a useCallback hook
  const checkDB = useCallback(
    async (invoiceNumber) => {
      const checkInvoice = await fetch('https://tranquil-yellowstone-86058.herokuapp.com/queryInvoice', {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({validNumber: invoiceNumber})
      })
      const checkComplete = await checkInvoice.json()
      console.log(checkComplete)
      try {
        if (checkComplete.length === 1) {
          if('validNumber' in checkComplete[0] && checkComplete[0].validNumber === parseInt(invoiceNumber)) {
            return true 
          } else {
            return false
          }
        } else {
          throw new Error(`${invoiceNumber} is not a valid PO number`)
        }
      } catch (err) {
        console.log(err)
      }
    },
    []
  )

  const handleOpen = (isOpen, response) => {
    snackText.current = response
    setOpen(isOpen)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const writeToFile = () => {
    invoices.forEach(async (invoice) => {
      let matchedNumbers = await checkDB(invoice.validNumber)
      console.log(matchedNumbers)
      if (!matchedNumbers && invoice.validNumber) {
        const response = await fetch('https://tranquil-yellowstone-86058.herokuapp.com/writeInvoice', {
          method: "post",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(invoice)
        })
        const body = await response.json()
        invoice.updated = true
        return body
      }
    })
    let checkAllUpdated = invoices.every((invoice) => {
      return invoice.updated === true
    })
    if (checkAllUpdated) {
      handleOpen(true, `All documents updated successfully.`)
    } else {
      handleOpen(true, `Some records could not be updated.`)
    }
  }

  function validateNum(invoice) {
    return Promise.all(invoice.purchaseOrders.map(purchaseOrder => {
      return searchBP(purchaseOrder)
    })).then(validatedArr => {
      let validatedNum = validatedArr.filter((num) => {
        return num !== undefined
      })
      if (validatedNum.length > 0) {
        invoice.validNumber = validatedNum[0].id
      }
      return invoice
    })
  }

  //changes the above hook to useReducer
  const reducer = (state, action) => {
    switch(action.type) {
      case "searchBP": {
        Promise.all(action.data.map((invoice) => {
          return validateNum(invoice)
        })).then((valArr) => {
          let newArr = [...valArr]
          valArr.map(async (invoice, index) => {
            checkDB(invoice.validNumber).then((alreadySaved) => {
              newArr[index].updated = alreadySaved
            })
          })
          setInvoices(newArr)
        })
      }
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, [])


  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <Grid>
          <TextDetection 
            keyDataToParent={dispatch} 
            clearText={clearText}
            handleOpen={handleOpen}
            setStatus={setStatus}
          />
        </Grid>
        <main className={classes.mainArea}>
          <Grid container spacing={3} className={classes.container}>
            <Grid item sm={1}/>
            <Grid item sm={10}>
              <Grid container >
                <POList 
                  invoices={invoices}
                  setJson={setJson}
                  searchBP={searchBP}
                  setInvoices={setInvoices}
                  checkDB={checkDB}
                />
              </Grid>
            </Grid>
            <Grid item sm={1}/>
          </Grid>
          <Grid item sm={12} className={classes.lowerArea}>
            <Snackbar 
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              message={snackText.current}
            >
            </ Snackbar>
            <Button variant="contained" type="button" disableElevation onClick={() => writeToFile()}>Send to BrightPearl</Button>
          </Grid>
        </main>
        <Grid item sm={12} className={classes.footer} >
          <BottomNavigation>
            {searchStatus === "pending" ? 
              <div className={classes.progress}>
                <LinearProgress /> 
              </div>
              : 
              null 
            }
          </BottomNavigation>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

