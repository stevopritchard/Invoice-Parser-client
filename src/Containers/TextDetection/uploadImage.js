import getInvoice from '../../getInvoice';
import validateInvoiceNumber from '../../validateInvoiceNumber';

const uploadImage = async (images, setStatus, handleOpen, setInvoices) => {
  setStatus('pending');
  console.log(images[0].lastModifiedDate);
  var formData = new FormData();
  console.log(formData);

  images.forEach((image) => {
    if (
      image.path.split('.').pop() === 'jpg' ||
      image.path.split('.').pop() === 'png'
    ) {
      formData.append('photo', image);
    } else {
      handleOpen(true, 'One or more files is of an invalid format.');
      return;
    }
  });

  const formResponse = await fetch('http://localhost:5000/getFormData', {
    method: 'post',
    body: formData,
  });

  const formResponseData = await formResponse.json();

  Promise.all(
    Object.values(formResponseData).map((invoice) => {
      return {
        ...invoice,
        validRefNumber: invoice.candidateRefNumbers.find((refNumber) => {
          return validateInvoiceNumber(refNumber);
        }),
      };
    })
  ).then((validInvoices) => {
    let currentInvoices = [...validInvoices];

    validInvoices.forEach(async (invoice, index) => {
      getInvoice(invoice.validRefNumber).then((alreadySaved) => {
        currentInvoices[index].updated = alreadySaved;
      });
    });
    setInvoices((previousInvoices) =>
      [...previousInvoices].concat(currentInvoices)
    );
  });
  setStatus('fulfilled');
};

export default uploadImage;
