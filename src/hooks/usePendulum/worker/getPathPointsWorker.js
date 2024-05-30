/* eslint-disable no-restricted-globals */
const speedOffset = 0.00005;
let time = 0;

const STATUS = {
  success: "success",
  error: "error",
  pending: "pending",
};

const getWorkerResponse = (status = STATUS.pending, data, svgPath) => {
  return { status, data, svgPath };
};

self.onmessage = function (e) {
  const { lengthRatios, omegaRatios, originTransform } = e.data;
  const points = [];
  let svgPath = "";
  let pathLength = 0;
  if (
    Array.isArray(lengthRatios) &&
    Array.isArray(omegaRatios) &&
    lengthRatios.length === omegaRatios.length &&
    lengthRatios.length > 0
  ) {
    while (
      points.length < 50 ||
      points.at(0).x.toFixed(0) !== points.at(points.length - 1).x.toFixed(0) ||
      points.at(0).y.toFixed(0) !== points.at(points.length - 1).y.toFixed(0)
    ) {
      const cords = getPendulumLastPointPosition(
        lengthRatios,
        omegaRatios,
        originTransform,
        time * speedOffset
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

      points.push({
        ...cords,
        dx: dx,
        dy: dy,
        dt: dt,
        speed: speed,
        pathLength: pathLength,
      });
      if (points.length === 1) {
        svgPath += `M${cords.x} ${cords.y} `;
      } else {
        svgPath += `L${cords.x} ${cords.y} `;
      }
      time++;
    }
    const lastPoint = points.at(-1);
    points[0].speed = lastPoint.speed;

    self.postMessage(getWorkerResponse(STATUS.success, points, svgPath));
  } else {
    self.postMessage(getWorkerResponse(STATUS.error, "Invalid data", svgPath));
  }
};

const getPendulumLastPointPosition = (
  lengthRatios,
  omegaRatios,
  origin = { x: 0, y: 0 },
  t = 0
) => {
  let x = origin.x;
  let y = origin.y;
  const pendulums = [];
  for (let i = 0; i < lengthRatios.length; i++) {
    const pendulum = {
      x1: x,
      y1: y,
      x2: 0,
      y2: 0,
    };
    const length = lengthRatios[i];
    const omega = omegaRatios[i];
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