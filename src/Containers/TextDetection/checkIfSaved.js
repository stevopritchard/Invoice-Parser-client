export default function checkIfSaved(invoices, invoiceCheck) {
  let currentInvoices = [...invoices];

  invoices.forEach(async (invoice, index) => {
    invoiceCheck(invoice.validRefNumber).then((alreadySaved) => {
      currentInvoices[index].updated = alreadySaved;
    });
  });

  return currentInvoices;
}
