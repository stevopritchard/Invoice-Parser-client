export default async function getSavedInvoices() {
  let requestDocs = await fetch('http://localhost:5000/getAllInvoices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let docList = await requestDocs.json();

  return docList;
}
