export async function validateInvoiceNumber(refNumber) {
  const response = await fetch('http://localhost:5000/queryPurchaseOrder', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refNumber: refNumber }),
  });

  const matchedPO = await response.json();

  if (matchedPO) {
    return true;
  } else {
    console.log(
      `Invoice number ${refNumber} doesn't match any purchase orders.`
    );
    return false;
  }
}
