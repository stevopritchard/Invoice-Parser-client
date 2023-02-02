import getInvoice from './getInvoice';
import getSavedInvoices from './getSavedInvoices';

const writeInvoice = async (invoice) => {
  const matchedNumbers = await getInvoice(invoice.validRefNumber);

  if (!matchedNumbers && invoice.validRefNumber) {
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
};

export default writeInvoice;
