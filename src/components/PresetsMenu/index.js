import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import presets from "./presets";

const PresetsMenu = ({ anchorEl, setAnchorEl, onSelectPreset }) => {
  const theme = useTheme();
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      slotProps={{}}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {presets.map((preset, index) => (
        <MenuItem
          key={index}
          onClick={() => onSelectPreset(preset.value)}
          className="flex-col !items-stretch"
        >
          {preset.label}
          <Typography
            variant="caption"
            component="p"
            color={theme.palette.text.secondary}
            className="text-sm font-medium text-start"
          >
            L({preset.value.lengthRatios.join(" : ")})&nbsp; O(
            {preset.value.omegaRatios.join(" : ")})
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default PresetsMenu;
