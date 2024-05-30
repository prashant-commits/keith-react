import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import { FLOWER_RATIOS, STAR_RATIOS } from "./constants";
import usePendulum from "./hooks/usePendulum";

const LENGTH_RATIOS = STAR_RATIOS.lengthRatios.map((ratio) => ratio * 100);
const OMEGA_RATIOS = STAR_RATIOS.omegaRatios.map((ratio) => ratio * 1);
// const LENGTH_RATIOS = [2, 1].map((ratio) => ratio * 100);
// const OMEGA_RATIOS = [4, -2].map((ratio) => ratio * 1);
const DURATION = 20 * 1000;

function inOutQuad(n) {
  n *= 2;
  if (n < 1) return 0.5 * n * n;
  return -0.5 * (--n * (n - 2) - 1);
}
function App() {
  const svgRef = useRef(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const { points, svgPath, isLoading } = usePendulum(
    LENGTH_RATIOS,
    OMEGA_RATIOS,
    origin
  );
  const lastPoint = points.at(-1);

  useLayoutEffect(() => {
    setOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);

  useEffect(() => {
    if (points.length === 0) return;
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const path = svg.querySelector("path");
    const lines = svg.querySelectorAll("line");
    let duration = DURATION;
    let startTime;
    let requestId;
    const playAnimation = (time) => {
      if (!startTime) startTime = time;
      const elapsedTime = time - startTime;
      const effectiveTime = inOutQuad(elapsedTime / duration);

      const index = Math.min(
        points.length - 1,
        Math.floor(points.length * effectiveTime)
      );

      const point = points[index];
      path.style.strokeDashoffset = lastPoint.pathLength - point.pathLength;
      lines.forEach((line, index) => {
        const pendulum = point.pendulums[index];
        line.setAttribute("x1", pendulum.x1);
        line.setAttribute("y1", pendulum.y1);
        line.setAttribute("x2", pendulum.x2);
        line.setAttribute("y2", pendulum.y2);
      });

      if (index !== points.length - 1)
        requestId = requestAnimationFrame(playAnimation);
    };

    requestId = requestAnimationFrame(playAnimation);

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [points, lastPoint]);

  return (
    <div className="App">
      <svg ref={svgRef} className="fixed inset-0 h-screen w-screen main-svg">
        <path
          d={svgPath}
          fill="none"
          className="text-blue-500"
          style={{
            "--pathLength": lastPoint?.pathLength ?? 0,
          }}
        />
        <circle cx={origin.x} cy={origin.y} r="2" className="fill-blue-500" />
        <g>
          {points[0]?.pendulums.map(({ x1, y1, x2, y2 }, index) => (
            <line
              strokeWidth={2}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              key={index}
              className="stroke-current text-blue-500"
            ></line>
          ))}
        </g>
      </svg>
      {isLoading && (
        <div className="fixed grid place-items-center inset-0 bg-gray-900/40">
          <Loader className="!size-12" />
        </div>
      )}
    </div>
  );
}

export default App;
