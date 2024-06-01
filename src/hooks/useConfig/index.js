import { FLOWER_RATIOS } from "components/PresetsMenu/presets";
import { useLocalStorage } from "usehooks-ts";

const DURATION = 10 * 1000;

const useConfig = () => {
  const [config, setConfig] = useLocalStorage("config", {
    lengthRatios: FLOWER_RATIOS.lengthRatios,
    omegaRatios: FLOWER_RATIOS.omegaRatios,
    duration: DURATION,
    lengthConstant: 50,
    omegaConstant: 4,
  });

    return [config, setConfig];
};

export default useConfig;
