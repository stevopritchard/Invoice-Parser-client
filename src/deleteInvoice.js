export default async function deleteInvoice(savedInvoices, invoice) {
  await fetch('http://localhost:5000/deleteInvoice', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(savedInvoices[invoice]),
  });
}
