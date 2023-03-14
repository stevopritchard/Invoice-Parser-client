export default function validateFileFormat(formData, images, handleOpen) {
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
}
