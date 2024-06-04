import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import { useTheme } from "@mui/material/styles";
import clsx from "clsx";
import usePendulum from "hooks/usePendulum";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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
const PendulumSvgAnimator = ({ className, config, origin, setOrigin }) => {
  const theme = useTheme();
  const [sliderValue, setSliderValue] = useState(0);
  const [status, setStatus] = useState(STATUS.idle);
  const { points, svgPath, isLoading } = usePendulum({
    lengthRatios: config.lengthRatios,
    omegaRatios: config.omegaRatios,
    lengthConstant: config.lengthConstant,
    omegaConstant: config.omegaConstant,
    origin,
  });

  const svgRef = useRef(null);
  const progressSliderRef = useRef(null);
  const directionRef = useRef("forward");
  const durationRef = useRef(config.duration);
  const startTimeRef = useRef(null);
  const progressPercentRef = useRef(0);
  const requestIdRef = useRef(null);

  const lastPoint = points.at(-1);

  const resetAnimation = useCallback(() => {
    cancelRequestAnimationFrame();
    directionRef.current = "forward";
    startTimeRef.current = null;
    progressPercentRef.current = 0;
    durationRef.current = config.duration;
    setStatus(STATUS.idle);
    setSliderValue(0);
  }, [config]);

  useLayoutEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setOrigin({
      x: rect.width / 2,
      y: rect.height / 2,
    });
  }, [setOrigin]);

  useEffect(() => {
    resetAnimation();
  }, [config, resetAnimation]);

  const draw = (path, lines, dir, progressPercent) => {
    const effectiveProgressPercent =
      dir === "backward" ? 1 - progressPercent : progressPercent;

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
  };

  const startAnimation = (
    onComplete = () => {
      setStatus(STATUS.finished);
    }
  ) => {
    if (points.length === 0) return;
    if (!svgRef.current) return;
    console.log();
    console.log({
      first: points[0],
      last: points[points.length - 1],
      length: points.length,
    });
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
      // setSliderValue(Number(_progressPercent).toFixed(5));
      draw(path, lines, directionRef.current, _progressPercent);
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
    const duration = config.duration;
    durationRef.current = duration;
    directionRef.current = "forward";
    startTimeRef.current =
      status === STATUS.paused
        ? performance.now() - progressPercentRef.current * duration
        : null;
    cancelRequestAnimationFrame();
    startAnimation();
  };

  const handleChangeProgress = (e, value) => {
    if (!svgRef.current) return;
    cancelRequestAnimationFrame();
    setSliderValue(value);
    setStatus(STATUS.paused);
    progressPercentRef.current = value;
    const svg = svgRef.current;
    const path = svg.querySelector("path");
    const lines = svg.querySelectorAll("line");
    directionRef.current = "forward";
    draw(path, lines, directionRef.current, value);
  };

  const cancelRequestAnimationFrame = () => {
    if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
      requestIdRef.current = null;
    }
  };

  if (isLoading)
    return (
      <div className="fixed grid place-items-center inset-0 bg-gray-900/40">
        <CircularProgress disableShrink size={48} />
      </div>
    );

  return (
    <div className={clsx("relative grid items-center", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${origin.x * 2} ${origin.y * 2}`}
        className="absolute inset-0 col-span-full row-span-full main-svg place-self-stretch"
      >
        <path
          d={svgPath}
          fill="none"
          stroke={theme.palette.text.primary}
          // stroke="url(#linear)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            "--pathLength": lastPoint?.pathLength ?? 0,
          }}
        />

        {points[0]?.pendulums.map(({ x1, y1, x2, y2 }, index) => (
          <line
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.5}
            stroke={theme.palette.text.primary}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            key={index}
          ></line>
        ))}
        <circle
          cx={origin.x}
          cy={origin.y}
          r="2"
          fill={theme.palette.primary.contrastText}
        />
      </svg>
      <div className="fixed bottom-0 inset-x-0 p-10 text-center flex flex-col items-center">
        <Paper
          className="flex flex-col px-4  !rounded-full absolute backdrop-blur-sm !bg-transparent [div:hover>&]:opacity-100 [div:hover>&]:bottom-[calc(100%-30px)] -bottom-12 opacity-0  !transition-all"
          elevation={4}
        >
          <Slider
            ref={progressSliderRef}
            aria-label="progress"
            step={0.000001}
            min={0}
            max={1}
            value={sliderValue}
            onChange={handleChangeProgress}
            sx={{ width: 300 }}
          />
        </Paper>
        <ButtonGroup
          className="mx-auto"
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
    </div>
  );
};

export default PendulumSvgAnimator;
