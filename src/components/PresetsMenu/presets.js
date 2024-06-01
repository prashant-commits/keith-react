export const STAR_RATIOS = {
  lengthRatios: [1.9, 1.1],
  omegaRatios: [11, -17],
};

export const FLOWER_RATIOS = {
  lengthRatios: [1.6, 0.67, 0.73],
  omegaRatios: [11, -17, 27],
};

const presets = [
  { label: "Start preset 1", value: STAR_RATIOS, key: "star-1" },
  { label: "Flower preset 1", value: FLOWER_RATIOS, key: "flower-1" },
];

export default presets;
