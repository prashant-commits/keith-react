import { Menu, MenuItem } from "@mui/material";

const PresetsMenu = ({ anchorEl, setAnchorEl }) => {
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
      <MenuItem>Profile</MenuItem>
    </Menu>
  );
};

export default PresetsMenu;
