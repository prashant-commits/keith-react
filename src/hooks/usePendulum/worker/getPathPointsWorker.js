/* eslint-disable no-restricted-globals */
const timePrecision = 0.001;
let time = 0;
const getTotalTime = (omegaConstant) => (2 * Math.PI) / omegaConstant;
const MAX_POINTS = 1000000;

const STATUS = {
  success: "success",
  error: "error",
  pending: "pending",
};

const getWorkerResponse = (status = STATUS.pending, data, svgPath) => {
  return { status, data, svgPath };
};

self.onmessage = function (e) {
  const {
    lengthRatios,
    omegaRatios,
    lengthConstant,
    omegaConstant,
    originTransform,
  } = e.data;

  const lengths = lengthRatios.map((length) => length * lengthConstant);
  const omegas = omegaRatios.map((omega) => omega * omegaConstant);
  const points = [];
  const totalTime = getTotalTime(omegaConstant);
  let currTime = 0;
  let svgPath = "";
  let pathLength = 0;
  let firstPoint = null;
  let lastPoint = null;
  if (
    Array.isArray(lengths) &&
    Array.isArray(omegas) &&
    lengths.length === omegas.length &&
    lengths.length > 0
  ) {
    do {
      if (MAX_POINTS <= points.length) {
        return self.postMessage(
          getWorkerResponse(STATUS.error, points, svgPath)
        );
      }
      currTime = time * timePrecision;
      const cords = getPendulumLastPointPosition(
        lengths,
        omegas,
        originTransform,
        currTime
      );
      const prevPoint = points.at(-1);
      let dt = 0,
        dx = 0,
        dy = 0,
        speed = 0;

      if (prevPoint) {
        dx = cords.x - prevPoint.x;
        dy = cords.y - prevPoint.y;
        dt = cords.t - prevPoint.t;
        speed = Math.sqrt(dx ** 2 + dy ** 2) / dt;
        pathLength += speed * dt;
      }

      const point = {
        ...cords,
        dx: dx,
        dy: dy,
        dt: dt,
        speed: speed,
        pathLength: pathLength,
      };
      if (points.length === 0) {
        firstPoint = point;
        svgPath += `M${point.x} ${point.y} `;
      } else {
        lastPoint = point;
        svgPath += `L${point.x} ${point.y} `;
      }
      points.push(point);
      time++;
    } while (currTime <= totalTime);
    firstPoint = points[0];
    lastPoint = points.at(-1);
    firstPoint.speed = lastPoint.speed;
    lastPoint.pendulums = firstPoint.pendulums;
    lastPoint.x = firstPoint.x;
    lastPoint.y = firstPoint.y;

    self.postMessage(getWorkerResponse(STATUS.success, points, svgPath));
  } else {
    self.postMessage(getWorkerResponse(STATUS.error, "Invalid data", svgPath));
  }
};

const getPendulumLastPointPosition = (
  lengths,
  omegas,
  origin = { x: 0, y: 0 },
  t = 0
) => {
  let x = origin.x;
  let y = origin.y;
  const pendulums = [];
  for (let i = 0; i < lengths.length; i++) {
    const pendulum = {
      x1: x,
      y1: y,
      x2: 0,
      y2: 0,
    };
    const length = lengths[i];
    const omega = omegas[i];
    const theta = omega * t;
    x += length * Math.sin(theta);
    y -= length * Math.cos(theta);
    pendulum.x2 = x;
    pendulum.y2 = y;
    pendulums.push(pendulum);
  }

  return { x, y, t, pendulums };
};

export {};
