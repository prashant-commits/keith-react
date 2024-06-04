import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PresetsMenu from "components/PresetsMenu";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FiltersSchema } from "./schema";

const PADDING = 200;

const FiltersModal = ({ origin, open, config, setOpen, setConfig }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      lengthRatios: config.lengthRatios?.join(":") ?? "",
      omegaRatios: config.omegaRatios?.join(":") ?? "",
      duration: config.duration / 1000 ?? 0,
      lengthConstant: config.lengthConstant ?? 100,
      omegaConstant: config.omegaConstant ?? 4,
      autoLength: false,
    },
    validationSchema: FiltersSchema,
    onSubmit: (values) => {
      console.log(values);
      setConfig({
        lengthRatios: values.lengthRatios.split(":").map(parseFloat),
        omegaRatios: values.omegaRatios.split(":").map(parseFloat),
        duration: values.duration * 1000,
        lengthConstant: values.lengthConstant,
        omegaConstant: values.omegaConstant,
      });
      setOpen(false);
    },
  });

  useEffect(() => {
    if (!values.autoLength) return;
    const autoLengthConstant = Math.floor(
      (Math.min(origin.x, origin.y) - PADDING) /
        values.lengthRatios
          .split(":")
          .map(parseFloat)
          .reduce((a, b) => a + b, 0)
    );
    autoLengthConstant && setFieldValue("lengthConstant", autoLengthConstant);
  }, [
    origin.x,
    origin.y,
    values.autoLength,
    values.lengthRatios,
    setFieldValue,
  ]);

  const handleClickPreset = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSelectPreset = ({ lengthRatios, omegaRatios }) => {
    setFieldValue("lengthRatios", lengthRatios.join(":"));
    setFieldTouched("lengthRatios", true);
    setFieldValue("omegaRatios", omegaRatios.join(":"));
    setFieldTouched("omegaRatios", true);
    setAnchorEl(null);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Settings</DialogTitle>
          <IconButton
            aria-label="close"
            type="button"
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
                  type="text"
                  name="lengthRatios"
                  value={values.lengthRatios}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lengthRatios && Boolean(errors.lengthRatios)}
                  helperText={touched.lengthRatios && errors.lengthRatios}
                />
              </FormControl>
              <div className="flex items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="autoLength"
                      checked={values.autoLength}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  }
                  label="Auto"
                />
                <FormControl>
                  <TextField
                    size="small"
                    type="number"
                    id="lengthConstant"
                    label="Length constant"
                    placeholder="100"
                    inputProps={{ step: 0.1 }}
                    name="lengthConstant"
                    disabled={values.autoLength}
                    value={values.lengthConstant}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                  type="text"
                  size="small"
                  name="omegaRatios"
                  value={values.omegaRatios}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl>
                <TextField
                  size="small"
                  type="number"
                  id="omegaConstant"
                  label="Omega constant"
                  placeholder="100"
                  inputProps={{ step: 0.1 }}
                  name="omegaConstant"
                  value={values.omegaConstant}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText="Lower value calculates more points on the path, may affect performance."
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
                  name="duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText>Duration in second(s)</FormHelperText>
              </FormControl>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="text" onClick={handleClickPreset}>
                Load a preset
              </Button>
            </div>
          </DialogContent>
          <DialogActions>
            {dirty && (
              <Button
                type="reset"
                variant="text"
                className=""
                onClick={resetForm}
              >
                Reset to previous settings
              </Button>
            )}
            <Button
              variant="contained"
              type="submit"
              disabled={!dirty || !isValid}
            >
              Apply
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <PresetsMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        onSelectPreset={handleSelectPreset}
      />
    </>
  );
};

export default FiltersModal;
