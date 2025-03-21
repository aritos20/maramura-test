import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { db } from '../firebase';
import { collection, addDoc } from "firebase/firestore";
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  IconButton,
  Snackbar,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  Card,
  TextField
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import GIF from 'gif.js';
import { uploadGifToFirebaseStorage } from '../helpers/uploadGifToStorage';

export default function DragAndDrop({ onGifSaved }) {
  const [images, setImages] = useState([]);
  const [gifBlob, setGifBlob] = useState(null);
  const [gifTitle, setGifTitle] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingToDb, setIsLoadingToDb] = useState(false);
  const [gif, setGif] = useState(null);
  let counter = 0;
  
  const getUniqueId = () => counter++;

  const handleGifSave = async () => {
    if (!gifBlob) return;
    setIsLoadingToDb(true);
    try {
      const gifUrl = await uploadGifToFirebaseStorage(gifBlob);
      await addDoc(collection(db, 'gifs'), {
        gif: {
          src: gifUrl,
          title: gifTitle || 'Nuevo Gif',
        },
        imagenes: images.map((img) => img.preview)
      })

      onGifSaved();
      setOpenSuccessSnackbar(true);
    } catch (error) {
      console.log(error);
      setOpenSnackbar(true);
    } finally {
      setIsLoadingToDb(false);
    }
  }

  const loadImage = (image) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = image;
    })
  }

  const handleGifCreation = async () => {
    if (images.length === 0) return;
    try {
      setIsLoading(true);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      canvas.width = 500;
      canvas.height = 500;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: '/gif.worker.js',
        repeat: 0,
        background: 'black'
      });

      for (const img of images) {
        const image = await loadImage(img.preview);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        gif.addFrame(ctx, { copy: true, delay: 400 });
      }

      gif.on('finished', async (blob) => {
        setGifBlob(blob);
        const gifUrl = URL.createObjectURL(blob);
        setGif(gifUrl);
        if (gifUrl === "error" || !gifUrl) {
          setOpenSnackbar(true);
        } else {
          setGif(gifUrl);
        }
      })

      gif.render();
    } catch (error) {
      setOpenSnackbar(true);
      console.log(error);
    } finally {
      setIsLoading(false);;
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
    setOpenSnackbar(false);
  }
  
  const onDrop = useCallback(acceptedFiles => {
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      id: getUniqueId(),
      preview: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop
  });
  
  const removeImage = (imageToRemove) => {
    URL.revokeObjectURL(imageToRemove.preview);
    setImages(images.filter((img) => img.id !== imageToRemove.id));
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(gifBlob);
    }
  }, [gifBlob])

  return (
    <>
      <Box sx={{ width: '100%', p: 2 }}>
        <Paper
          {...getRootProps()}
          sx={{
            p: 3,
            border: '2px dashed',
            borderColor: isDragActive ? 'background.paper' : 'grey.400',
            borderRadius: 4,
            backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.1)' : 'background.paper',
            textAlign: 'center',
            cursor: 'pointer',
            mb: 2
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Suelta las imágenes aquí' : 'Arrastra imágenes aquí, o haz clic para seleccionar'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sólo archivos de imagen (JPG, PNG, GIF)
          </Typography>
        </Paper>
        
        {images.length > 0 && (
          <>
            <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
            <TextField
              label='Titulo del Gif'
              placeholder='Porfavor inserte el titulo de su Gif'
              value={gifTitle}
              onChange={(e) => setGifTitle(e.target.value)}
              sx={{ width: 600 }}
            />
              </Stack>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 5 }}>
              <Typography variant="h6" gutterBottom>
                Imágenes seleccionadas ({images.length})
              </Typography>
              <Button variant="contained" onClick={() => setImages([])}>
                Remover las imagenes seleccionadas
              </Button>
            </Stack>

            <Card>
              <ImageList
                sx={{ width: '100%', height: 'auto' }}
                cols={4}
                rowHeight={200}
                gap={12}
              >
                {images.map((img, index) => (
                  <ImageListItem key={index}>
                    <img 
                      src={img.preview}
                      loading="lazy"
                      style={{ objectFit: 'cover', height: '100%' }}
                    />
                    <ImageListItemBar 
                      sx={{ opacity: 0.5 }}
                      position='bottom'
                      actionPosition='right'
                      actionIcon={
                        <IconButton
                          sx={{ color: 'white' }}
                          onClick={() => removeImage(img)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Card>
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 3 }}>
              <Button
                loading={isLoading}
                variant="contained"
                color="primary" 
                sx={{ mt: 2 }}
                onClick={handleGifCreation}
              >
                Procesar imágenes
              </Button>
              
              {gif && (
                <Button
                  loading={isLoadingToDb}
                  variant='contained'
                  color='primary'
                  onClick={handleGifSave}
                  sx={{ mt: 2, ml: 3 }}
                >
                  Guardar GIF en la base de datos
                </Button>
              )}
            </Stack>
          </>
        )}

        {gif && (
          <Box sx={{ mt: 3 }}>
            <Typography variant='h6' gutterBottom>
              GIF generado
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Box
                component="img"
                src={gif}
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  mx: 'auto'
                }}
              />
            </Paper>
          </Box>
        )}
      </Box>
      <Snackbar 
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Ups! hubo un error al crear el GIF, porfavor intentelo de nuevo
        </Alert>
      </Snackbar>
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
          GIF exitosamente guardado!
        </Alert>
      </Snackbar>
    </>
  )
}
