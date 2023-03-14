import validateInvoiceNumber from "./validateInvoiceNumber";

global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => Promise.resolve({ some: "data" }),
  });
});

test('refNumber "123456" is will return an existing test PO document', async () => {
  expect.assertions(1);
  await expect(validateInvoiceNumber(123456)).resolves.toBeTruthy();
  // expect(data).toBeTruthy();
});
