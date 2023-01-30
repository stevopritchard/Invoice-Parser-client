import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
}));

const StyledTableCell = withStyles((theme) => ({
  head: { backgroundColor: '#e0e0e0' },
  body: {
    fontSize: 11,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-ot-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      fontSize: 11,
    },
  },
}))(TableRow);

export default function SavedInvoiceList({
  savedInvoices,
  deleteInvoice,
  handleOpen,
}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table
        stickyHeader
        aria-label="sticky table"
        style={{ display: savedInvoices.length > 0 ? '' : 'none' }}
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>Saved Document</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Ref #</StyledTableCell>
            <StyledTableCell>Options</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {savedInvoices ? (
            savedInvoices.map((invoice, index) => {
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
                      value={invoice.validRefNumber}
                    ></TextField>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div>
                      <Button
                        type="button"
                        onClick={() =>
                          deleteInvoice(savedInvoices, index).then(
                            handleOpen(true, 'Record deleted.')
                          )
                        }
                        style={{ fontSize: 11 }}
                      >
                        Delete
                      </Button>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })
          ) : (
            <div></div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
