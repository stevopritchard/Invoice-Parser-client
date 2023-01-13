export default function validateInvoiceNumber(invoice) {
  invoice.validNumber = invoice.purchaseOrders[0];

  return invoice;
}
