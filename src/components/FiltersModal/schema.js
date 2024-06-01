import * as yup from "yup";

const RatioSchema = yup
  .string()
  .required("Ratio is required")
  .matches(/^-?\d+(\.\d+)?(?::-?\d+(\.\d+)?)*$/, "Invalid ratios");

const ConstantSchema = yup
  .number()
  .required("Constant is required")
  .positive("Constant must be positive")
  .moreThan(0, "Constant must be more than 0");

export const FiltersSchema = yup.object().shape({
  lengthRatios: RatioSchema.test(
    "lengthRatios",
    "Number of ratio items should match",
    (value, testContext) => {
      if (!value) return true;
      const { omegaRatios } = testContext.parent;
      const lengthRatios = value.split(":");
      return lengthRatios.length === omegaRatios?.split(":").length;
    }
  ),
  omegaRatios: RatioSchema.test(
    "omegaRatios",
    "Number of ratio items should match",
    (value, testContext) => {
        if (!value) return true;
        const { lengthRatios } = testContext.parent;
        const omegaRatios = value.split(":");
        return omegaRatios.length === lengthRatios?.split(":").length;
    }
  ),
  duration: yup
    .number()
    .min(1, "Duration must be at least 1")
    .required("Duration is required")
    .positive("Duration must be positive"),
  lengthConstant: ConstantSchema,
  omegaConstant: ConstantSchema,
  autoLength: yup.boolean(),
});
