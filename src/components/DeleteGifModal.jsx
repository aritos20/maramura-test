import React, { useState } from 'react';
import { Alert, Box, Button, Modal, Snackbar, Stack, Typography } from '@mui/material';
import { deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from '../firebase';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

export default function DeleteGifModal({ open, setOpen, gif, handleRefreshGifs }) {
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setOpen(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnackbar(false);
    setOpenSuccessSnackbar(false);
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      console.log(gif)
      const storage = getStorage();
      const filePath = gif.gif.src.split(`https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`)[1].split("?")[0];
      const fileRef = ref(storage, decodeURIComponent(filePath));
      await deleteObject(fileRef);
      await deleteDoc(doc(db, 'gifs', gif.id));
      handleRefreshGifs();
      setOpenSuccessSnackbar(true);
    } catch (error) {
      console.log(error);
      setOpenErrorSnackbar(true);
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h6" textAlign="center">
            Are you sure that you want to delete this Gif?
          </Typography>

          <Stack direction="row" justifyContent="center" gap={2} sx={{ mt: 3 }}>
            <Button variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
            <Button loading={isLoading} variant='contained' onClick={handleDelete}>
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Snackbar 
        open={openSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Gif eliminado correctamente
        </Alert>
      </Snackbar>
      <Snackbar 
        open={openErrorSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Hubo un error al intentar eliminar el Gif, por favor intentelo de nuevo
        </Alert>
      </Snackbar>
    </>
  )
}
