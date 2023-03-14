import validateInvoiceNumber from '../../utils/validateInvoiceNumber';

test('refNumber "123456" is will return an existing test PO document', async () => {
  expect.assertions(1);
  await expect(validateInvoiceNumber(123456)).resolves.toBeTruthy();
  // expect(data).toBeTruthy();
});
