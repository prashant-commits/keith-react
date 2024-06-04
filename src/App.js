import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "components/ColorMode";
import FiltersModal from "components/FiltersModal";
import useConfig from "hooks/useConfig";
import { useState } from "react";
import PendulumSvgAnimator from "./components/PendulumSvgAnimator";

function App() {
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();
  const [config, setConfig] = useConfig();
  const [openSettings, setOpenSettings] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  return (
    <div className="grid h-screen grid-rows-[min-content_auto]">
      <AppBar position="static">
        <Toolbar className="flex justify-end gap-4">
          <IconButton size="large" color="inherit" onClick={toggleColorMode}>
            {theme.palette.mode === "light" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
          <IconButton size="large" color="inherit" onClick={handleOpenSettings}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <PendulumSvgAnimator
        config={config}
        origin={origin}
        setOrigin={setOrigin}
        className="place-self-stretch"
      />
      <FiltersModal
        origin={origin}
        open={openSettings}
        setOpen={setOpenSettings}
        config={config}
        setConfig={setConfig}
      />
    </div>
  );
}

export default App;
