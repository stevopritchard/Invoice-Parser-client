import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles(() => ({
    dropzone: {
        paddingLeft: '10px',
        paddingRight: '10px'
    }
}))

function Dropzone({ uploadImage }) {
    const classes = useStyles()
    const onDrop = useCallback(acceptedFiles => { uploadImage(acceptedFiles) },[uploadImage])

    
    const { 
        getRootProps, 
        getInputProps, 
        isDragActive 
    } = useDropzone({
        multiple: true,
        onDrop
    })

    return (
        <div className={classes.dropzone} {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop or click to select</p>
            }
        </div>
    )
}

export default Dropzone;