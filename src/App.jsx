import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import DragAndDrop from "./components/DragAndDrop";
import Gifs from "./components/Gifs";
import { useState } from "react";
import theme from "./theme";


function App() {
  const [refreshGifs, setRefreshGifs] = useState(0);

  const handleGifSaved = () => {
    setRefreshGifs((prev) => prev + 1);
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ maxWidth: '2500px', p: 4 }}>
        <DragAndDrop onGifSaved={handleGifSaved} />
        <Gifs refreshGifs={refreshGifs} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
