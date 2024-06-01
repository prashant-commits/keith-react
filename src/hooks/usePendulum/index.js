import { useEffect, useState } from "react";

const usePendulum = ({
  lengthRatios,
  omegaRatios,
  lengthConstant,
  omegaConstant,
  origin,
}) => {
  const [points, setPoints] = useState([]);
  const [svgPath, setSvgPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lengthRatios.length === 0 || omegaRatios.length === 0) return;
    setIsLoading(true);
    const worker = new Worker(
      new URL("./worker/getPathPointsWorker.js", import.meta.url)
    );
    worker.onmessage = (e) => {
      const { status, data, svgPath } = e.data;
      if (status === "success") {
        setPoints(data);
        setSvgPath(svgPath);
      } else {
        console.error(data);
      }
      setIsLoading(false);
    };

    worker.postMessage({
      lengthRatios,
      omegaRatios,
      lengthConstant,
      omegaConstant,
      originTransform: origin,
    });

    return () => worker.terminate();
  }, [lengthConstant, lengthRatios, omegaConstant, omegaRatios, origin]);

  return { points, svgPath, isLoading };
};

export default usePendulum;
