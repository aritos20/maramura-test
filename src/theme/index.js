import { createTheme } from "@mui/material";
import { typography } from "./typography";
import { components } from "./components";
import { palette } from "./palette";

const theme = createTheme({
  palette,
  typography,
  components,
})

export default theme