import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import PresetsMenu from "components/PresetsMenu";
import { useState } from "react";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickPreset = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
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
        <DialogTitle>Settings</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText>
            Change the settings of the animation or load a preset.
          </DialogContentText>

          <div className="mb-4 mt-6">
            <Typography
              variant="h6"
              component="h6"
              className="text-blue-600 !text-base !mb-3"
            >
              Length ratios
            </Typography>
            <FormControl fullWidth className="!mb-2">
              <TextField
                size="small"
                id="lengthRatios"
                label="Lengths"
                placeholder="1:2:3"
              />
            </FormControl>
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Auto"
              />
              <FormControl>
                <TextField
                  size="small"
                  type="number"
                  id="lengthConstant"
                  label="Length constant"
                  placeholder="100px"
                />
              </FormControl>
            </div>
          </div>

          <div className="mb-4">
            <Typography
              variant="h6"
              component="h6"
              className="text-blue-600 !text-base !mb-3"
            >
              Omega ratios
            </Typography>
            <FormControl fullWidth className="!mb-2">
              <TextField
                id="omegaRatios"
                label="Omegas"
                placeholder="1:2:3"
                size="small"
              />
            </FormControl>
            <FormControl>
              <TextField
                size="small"
                type="number"
                id="omegaConstant"
                label="Omega constant"
                placeholder="100px"
              />
            </FormControl>
          </div>
          <div className="mb-4">
            <Typography
              variant="h6"
              component="h6"
              className="text-blue-600 !text-base !mb-3"
            >
              Duration
            </Typography>
            <FormControl fullWidth>
              <TextField
                size="small"
                type="number"
                id="duration"
                label="Duration"
                placeholder="10s"
              />
              <FormHelperText>Duration in second(s)</FormHelperText>
            </FormControl>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="text" onClick={handleClickPreset}>
              Load a preset
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="text" className="">
            Reset to previous settings
          </Button>
          <Button variant="contained" type="submit">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      <PresetsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </>
  );
};

export default FiltersModal;
