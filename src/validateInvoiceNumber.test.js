import { validateInvoiceNumber } from './validateInvoiceNumber';

test('refNumber "123456" is will return a test PO document', async () => {
  expect.assertions(1);
  const data = await validateInvoiceNumber(123456);
  expect(data).toBe(true);
});
