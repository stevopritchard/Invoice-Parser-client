import React, { useState, useRef } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: 10,
    marginRight: 10,
    maxHeight: 'calc(100vh - 150px)',
    height: '100%',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  TextField: {
    InputProps: {
      style: {
        fontSize: 11,
      },
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#03d1b2',
    // color: '#03d1b2',
  },
  body: {
    fontSize: 11,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-ot-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function POList({
  invoices,
  setJson,
  searchBP,
  setInvoices,
  checkDB,
}) {
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const modalRefs = useRef([]);

  if (modalRefs.current !== invoices.length) {
    modalRefs.current = Array(invoices.length)
      .fill()
      .map((_, i) => (modalRefs.current[i] = ''));
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (i, e) => {
    modalRefs.current[i] = e.target.value;
  };

  const replaceOrderId = (i) => {
    // searchBP(modalRefs.current[i]).then((response) => {
    //   if (response.id) {
    //     let newArr = [...invoices];
    //     newArr[i].validNumber = response.id;
    //     setInvoices(newArr);
    //     handleClose();
    //   }
    // });
    let newArr = [...invoices];
    newArr[i].validNumber = modalRefs.current[i];
    setInvoices(newArr);
    handleClose();
  };

  const body = (key) => {
    return (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Try another PO number</h2>
        <p id="simple-modal-description">
          There wasn't a PO number available in your document.
        </p>
        <TextField onChange={handleChange.bind(this, key)} />
        <Button onClick={() => replaceOrderId(key)}>Confirm PO #</Button>
      </div>
    );
  };

  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table
        stickyHeader
        aria-label="sticky table"
        style={{ display: invoices.length > 0 ? '' : 'none' }}
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>Document</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Ref #</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Options</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices ? (
            invoices.map((invoice, index) => {
              return (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    <TextField
                      InputProps={{ style: { fontSize: 12 } }}
                      value={invoice.name}
                    ></TextField>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      InputProps={{ style: { fontSize: 12 } }}
                      value={invoice.date}
                    ></TextField>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      InputProps={{ style: { fontSize: 12 } }}
                      value={invoice.validNumber}
                    ></TextField>
                  </StyledTableCell>
                  <StyledTableCell>
                    {invoice.validNumber ? 'Saved' : 'Not Saved'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {invoice.validNumber ? (
                      invoice.updated === true ? (
                        'Record already uploaded'
                      ) : (
                        'Ready to upload'
                      )
                    ) : (
                      <div>
                        <Button
                          type="button"
                          onClick={handleOpen}
                          style={{ fontSize: 11 }}
                        >
                          Enter details...
                        </Button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="simple-modal-title"
                          aria-describedby="simple-modal-description"
                        >
                          {body(index)}
                        </Modal>
                      </div>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })
          ) : (
            // <StyledTableRow>
            //     <StyledTableCell></StyledTableCell>
            //     <StyledTableCell></StyledTableCell>
            //     <StyledTableCell></StyledTableCell>
            //     <StyledTableCell></StyledTableCell>
            //     <StyledTableCell></StyledTableCell>
            // </StyledTableRow>
            <div></div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
