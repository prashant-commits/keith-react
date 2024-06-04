import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import presets from "./presets";

const PresetsMenu = ({ anchorEl, setAnchorEl, onSelectPreset }) => {
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
          <p className="text-sm font-medium text-gray-500 text-start">
            L({preset.value.lengthRatios.join(" : ")})&nbsp; O(
            {preset.value.omegaRatios.join(" : ")})
          </p>
          <p className="text-sm font-medium text-gray-500 text-start"></p>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default PresetsMenu;
