import { Container } from "@mui/material";
import DragAndDrop from "./components/DragAndDrop";
import Gifs from "./components/Gifs";
import { useState } from "react";


function App() {
  const [refreshGifs, setRefreshGifs] = useState(0);

  const handleGifSaved = () => {
    setRefreshGifs((prev) => prev + 1);
  }
  
  return (
    <Container sx={{ maxWidth: '2500px' }}>
      <DragAndDrop onGifSaved={handleGifSaved} />
      <Gifs refreshGifs={refreshGifs} />
    </Container>
  );
}

export default App;
