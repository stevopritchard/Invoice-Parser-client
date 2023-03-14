import getInvoice from '../../utils/getInvoice';

const testRefNumber = 146499;

// Test that a given invoice has already been uploaded
test('given invoice has already been uploaded', async () => {
  // expect.assertions(1);
  await expect(getInvoice(testRefNumber)).resolves.toBeTruthy();
});
