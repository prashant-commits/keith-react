import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const ColorModeContext = createContext({ toggleColorMode: () => {} });
const matchDark = `(prefers-color-scheme: dark)`;

const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() =>
    window.matchMedia && window.matchMedia(matchDark).matches ? "dark" : "light"
  );
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const matches = useMediaQuery(matchDark);

  useEffect(() => {
    if (matches) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, [matches]);

  return (
    <ColorModeContext.Provider
      value={{
        toggleColorMode: () => {
          setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);

export default ColorModeProvider;
