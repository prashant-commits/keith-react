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
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (lengthRatios.length === 0 || omegaRatios.length === 0) return;
    setIsLoading(true);
    const worker = new Worker(
      new URL("./worker/getPathPointsWorker.js", import.meta.url)
    );
    worker.onmessage = (e) => {
      const { status, data, svgPath } = e.data;

      status === "error" && console.error(data);
      setIsError(status === "error");

      Array.isArray(data) && setPoints(data);
      svgPath && setSvgPath(svgPath);
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

  return { points, svgPath, isLoading, isError };
};

export default usePendulum;
