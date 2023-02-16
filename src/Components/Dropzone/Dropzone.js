import React, { useCallback } from 'react';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles(() => ({
  dropzone: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
}));

function Dropzone({ uploadImage }) {
  const classes = useStyles();
  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles);
      uploadImage(acceptedFiles);
    },
    [uploadImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
  });

  return (
    <Card
      variant="outlined"
      style={{
        border: isDragActive ? '2px dashed #03d1b2' : '2px dashed gray',
      }}
      className={classes.dropzoneCard}
    >
      <div className={classes.dropzone} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop or click to select</p>
        )}
      </div>
    </Card>
  );
}

export default Dropzone;
