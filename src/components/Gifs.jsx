import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardMedia, Grid2, Modal, Stack, Typography } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import DeleteGifModal from './DeleteGifModal';

const getGifs = async () => {
  const querySnapshot =  await getDocs(collection(db, 'gifs'));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
}

export default function Gifs({ refreshGifs }) {
  const [gifs, setGifs] = useState([]);
  const [gifDeleting, setGifDeleting] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenModal = (gif) => {
    setOpenDeleteModal(true);
    setGifDeleting(gif);
  }

  const handleRefreshGifs = () => {
    getGifs()
      .then((res) => {
        setGifs(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getGifs()
      .then((res) => {
        setGifs(res);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [refreshGifs])
  
  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 3 }}>Mis GIFs: {gifs.length}</Typography>

      {gifs.length === 0 ? (
        <Typography>No hay GIFs disponibles</Typography>
      ) : (
        <Grid2 container spacing={2}>
          {gifs.map((gif, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card sx={{ p: 2 }}>
                <CardMedia
                  component="img"
                  image={gif.gif.src}
                  alt={gif.gif.title || 'GIF'}
                  sx={{ height: 200, objectFit: 'contain' }}
                />
              <CardActions sx={{ mt: 1 }}>
                <Button variant='contained' onClick={() => handleOpenModal(gif)}>Delete Gif</Button>
              </CardActions>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
      <DeleteGifModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        gif={gifDeleting}
        handleRefreshGifs={handleRefreshGifs}
      />
    </Box>
  )
}
