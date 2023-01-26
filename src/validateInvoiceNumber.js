export default function validateInvoiceNumber(invoice) {
  invoice.validRefNumber = invoice.candidateRefNumbers[0];

  return invoice;
}
