import appendSavedInvoices from '../appendSavedInvoices';
import getInvoice from '../getInvoice';

jest.mock('../getInvoice');

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

describe('appendSavedInvoices', () => {
  test('checking that getInvoice is mocked correctly', async () => {
    getInvoice.mockImplementation(() => {
      return Promise.resolve(true);
    });
    expect(await appendSavedInvoices(mockSavedInvoices, mockInvoices)).toEqual(
      mockInvoices
    );
    expect(getInvoice).toHaveBeenCalled();
  });

  test('only first invoice is appended to state array', async () => {
    expect.assertions(2);
    getInvoice
      .mockImplementationOnce(() => {
        return Promise.resolve(true);
      })
      .mockImplementationOnce(() => {
        return Promise.resolve(false);
      });

    const savedInvoices = await appendSavedInvoices(
      mockSavedInvoices,
      mockInvoices
    );

    expect(savedInvoices[0].updated).toEqual(true);
    expect(savedInvoices[1].updated).toEqual(false);
  });

  test('only second invoice is appended to state array', async () => {
    expect.assertions(2);
    getInvoice
      .mockImplementationOnce(() => {
        return Promise.resolve(false);
      })
      .mockImplementationOnce(() => {
        return Promise.resolve(true);
      });

    const savedInvoices = await appendSavedInvoices(
      mockSavedInvoices,
      mockInvoices
    );
    expect(savedInvoices[0].updated).toEqual(false);
    expect(savedInvoices[1].updated).toEqual(true);
  });

  test('no invoices are appended to state array', async () => {
    getInvoice
      .mockImplementationOnce(() => {
        return Promise.resolve(false);
      })
      .mockImplementationOnce(() => {
        return Promise.resolve(false);
      });

    const savedInvoices = await appendSavedInvoices(
      mockSavedInvoices,
      mockInvoices
    );

    expect(savedInvoices.find((invoice) => invoice.updated === true)).toEqual(
      undefined
    );
  });
});
