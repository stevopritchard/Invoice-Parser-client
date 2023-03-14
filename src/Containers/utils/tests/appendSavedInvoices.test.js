import appendSavedInvoices from '../appendSavedInvoices';
import checkIfSaved from '../checkIfSaved';
import getInvoice from '../getInvoice';

//mock the return value of 'getInvoice' by passing the filepath, not the reference
const mockedInvoiceChecks = jest.fn();
// mockedInvoiceChecks.mockReturnValueOnce(false).mockReturnValueOnce(true);
jest.mock('../getInvoice', () => () => mockedInvoiceChecks);
// jest.mock('../getInvoice', () => () => Promise.resolve(true));

const mockSavedInvoices = [];

const mockInvoices = [
  {
    name: '2',
    candidateRefNumbers: [],
    validRefNumber: 12345,
    date: '16/02/2021',
    updated: false,
  },
  {
    name: '3',
    candidateRefNumbers: [],
    validRefNumber: 67891,
    date: '19/02/2021',
    updated: false,
  },
];

test('all invoices to be appended', async () => {
  mockedInvoiceChecks.mockImplementation();
  expect(await appendSavedInvoices(mockSavedInvoices, mockInvoices)).toEqual(
    mockInvoices
  );
});

test.only('only second invoice is appended', async () => {
  expect(await appendSavedInvoices(mockSavedInvoices, mockInvoices)).toEqual(
    mockInvoices[1]
  );
});
