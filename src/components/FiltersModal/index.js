import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const FiltersModal = ({
  open,
  setOpen,
  lengthRatios,
  omegaRatios,
  duration,
  setLengthRatios,
  setOmegaRatios,
  setDuration,
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Settings
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItemButton>
          <ListItemText primary="Phone ringtone" secondary="Titania" />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText
            primary="Default notification ringtone"
            secondary="Tethys"
          />
        </ListItemButton>
      </List>
    </Dialog>
  );
};

export default FiltersModal;
