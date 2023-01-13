export default async function getPurchaseOrder(invoiceNumber) {
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
}
