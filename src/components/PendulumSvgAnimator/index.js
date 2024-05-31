import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import { Button, ButtonGroup } from "@mui/material";
import Loader from "components/Loader";
import usePendulum from "hooks/usePendulum";
import { STAR_RATIOS } from "presets";
import { useLayoutEffect, useRef, useState } from "react";

const LENGTH_RATIOS = STAR_RATIOS.lengthRatios.map((ratio) => ratio * 100);
const OMEGA_RATIOS = STAR_RATIOS.omegaRatios.map((ratio) => ratio * 1);
// const LENGTH_RATIOS = [2, 5].map((ratio) => ratio * 100);
// const OMEGA_RATIOS = [4, -2].map((ratio) => ratio * 1);
const DURATION = 10 * 1000;

function inOutQuad(n) {
  n *= 2;
  if (n < 1) return 0.5 * n * n;
  return -0.5 * (--n * (n - 2) - 1);
}

export const STATUS = {
  idle: "idle",
  playing: "playing",
  paused: "paused",
  finished: "finished",
};
const PendulumSvgAnimator = ({ lengthRatios, omegaRatios }) => {
  const svgRef = useRef(null);
  const directionRef = useRef("forward");
  const durationRef = useRef(DURATION);
  const startTimeRef = useRef(null);
  const progressPercentRef = useRef(0);
  const requestIdRef = useRef(null);
  const [status, setStatus] = useState(STATUS.idle);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const { points, svgPath, isLoading } = usePendulum(
    LENGTH_RATIOS,
    OMEGA_RATIOS,
    origin
  );
  const lastPoint = points.at(-1);

  useLayoutEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setOrigin({
      x: rect.width / 2,
      y: rect.height / 2,
    });
  }, []);

  const startAnimation = (
    onComplete = () => {
      setStatus(STATUS.finished);
    }
  ) => {
    if (points.length === 0) return;
    if (!svgRef.current) return;
    console.log(points.length);
    console.log({ first: points[0], last: points[points.length - 1] });
    const svg = svgRef.current;
    const path = svg.querySelector("path");
    const lines = svg.querySelectorAll("line");
    setStatus(STATUS.playing);
    const playAnimation = (time) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time;
      }
      const _progressPercent = Math.max(
        0,
        Math.min((time - startTimeRef.current) / durationRef.current, 1)
      );
      progressPercentRef.current = _progressPercent;

      const effectiveProgressPercent =
        directionRef.current === "backward"
          ? 1 - _progressPercent
          : _progressPercent;

      const effectiveTime = inOutQuad(effectiveProgressPercent);

      const index = Math.floor((points.length - 1) * effectiveTime);

      const point = points[index];
      path.style.strokeDashoffset = lastPoint.pathLength - point.pathLength;
      lines.forEach((line, index) => {
        const pendulum = point.pendulums[index];
        line.setAttribute("x1", pendulum.x1);
        line.setAttribute("y1", pendulum.y1);
        line.setAttribute("x2", pendulum.x2);
        line.setAttribute("y2", pendulum.y2);
      });

      if (_progressPercent !== 1)
        requestIdRef.current = requestAnimationFrame(playAnimation);
      else onComplete?.();
    };
    requestIdRef.current = requestAnimationFrame(playAnimation);
  };

  const handlePause = () => {
    cancelRequestAnimationFrame();
    setStatus(STATUS.paused);
  };

  const handleReset = () => {
    const duration = 1000;
    durationRef.current = duration;
    directionRef.current = "backward";
    startTimeRef.current =
      performance.now() - (1 - progressPercentRef.current) * duration;

    cancelRequestAnimationFrame();
    startAnimation(() => {
      setStatus(STATUS.idle);
    });
  };

  const handleStart = () => {
    const duration = DURATION;
    durationRef.current = duration;
    directionRef.current = "forward";
    startTimeRef.current =
      status === STATUS.paused
        ? performance.now() - progressPercentRef.current * duration
        : null;
    cancelRequestAnimationFrame();
    startAnimation();
  };

  const cancelRequestAnimationFrame = () => {
    if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
    }
  };

  if (isLoading)
    return (
      <div className="fixed grid place-items-center inset-0 bg-gray-900/40">
        <Loader className="!size-12" />
      </div>
    );

  return (
    <div className="relative grid h-screen items-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${origin.x * 2} ${origin.y * 2}`}
        className="absolute inset-0 col-span-full row-span-full main-svg place-self-stretch"
      >
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
              strokeWidth={8}
              strokeLinecap="round"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              key={index}
              className="stroke-current text-blue-500/50"
            ></line>
          ))}
        </g>
      </svg>
      <ButtonGroup
        className="absolute bottom-4 justify-self-center"
        variant="contained"
        aria-label="Playback buttons"
      >
        <Button onClick={handleReset} disabled={status === STATUS.idle}>
          <ReplayIcon />
        </Button>
        {(status === STATUS.idle || status === STATUS.paused) && (
          <Button onClick={handleStart}>
            <PlayArrowIcon />
          </Button>
        )}
        {status === STATUS.playing && (
          <Button onClick={handlePause}>
            <PauseIcon />
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default PendulumSvgAnimator;
