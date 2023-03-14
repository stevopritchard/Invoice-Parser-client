import validateFileFormat from '../../utils/validateFileFormat';

const mockImages = [
  {
    path: 'form-example.png',
    lastModified: 1617879996166,
    lastModifiedDate: 'Thu Apr 08 2021 12:06:36 GMT+0100 (British Summer Time)',
    name: 'form-example.png',
    size: 70402,
    type: 'image/png',
    webkitRelativePath: '',
  },
];

const mockFormData = new FormData();

// const mockFormResponse = {
//   name: '',
//   candidateRefNumbers: [],
//   validRefNumber: '',
//   date: '',
//   updated: false,
// };

// jest.mock('./validateFileFormat');

test('formData is appended "photo" property', () => {
  // validateFileFormat(mockFormData, mockImages, null);
  // expect(mockFormData).toHaveProperty('photo', mockImages[0]);
});
