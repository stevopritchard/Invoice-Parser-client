import checkIfSaved from './checkIfSaved';
import getInvoice from './getInvoice';

export default function appendSavedInvoices(previousInvoices, validInvoices) {
  return [...previousInvoices].concat(checkIfSaved(validInvoices, getInvoice));
}
