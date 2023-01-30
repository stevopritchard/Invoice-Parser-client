export default async function getInvoice(invoiceNumber) {
  const response = await fetch('http://localhost:5000/queryInvoice', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ validRefNumber: invoiceNumber }),
  });
  const invoices = await response.json();

  try {
    if (invoices) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(`${invoiceNumber} is not a valid PO number`);
  }
}
