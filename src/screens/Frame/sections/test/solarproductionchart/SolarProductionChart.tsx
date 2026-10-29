import React, { useEffect, useMemo, useRef, useState } from "react";
import "./SolarProductionChart.css";

type SolarProductionChartProps = {
  startHour?: number;
  endHour?: number;

  /** Ora iniziale della simulazione */
  initialHour?: number;

  /** Velocità: 1 = tempo reale, 60 = 1 minuto simulato ogni secondo */
  simulationSpeed?: number;

  /** Se false, il pallino non avanza automaticamente */
  autoPlay?: boolean;

  /** Potenza massima dell'impianto in kW */
  maxPower?: number;
};

const DEFAULT_START = 6;
const DEFAULT_END = 20;
const DEFAULT_MAX_POWER = 9.6;

export default function SolarProductionChart ({
  startHour = DEFAULT_START,
  endHour = DEFAULT_END,
  initialHour = startHour,
  simulationSpeed = 60,
  autoPlay = true,
  maxPower = DEFAULT_MAX_POWER,
}: SolarProductionChartProps) {
  const [currentHour, setCurrentHour] = useState(initialHour);
  const [accumulatedWh, setAccumulatedWh] = useState(0);
  const [running, setRunning] = useState(autoPlay);

  const lastTimestampRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  /*
   * Normalizza l'orario nell'intervallo [0, 1].
   *
   * 06:00 -> 0
   * 13:00 -> 0.5
   * 20:00 -> 1
   */
  const getProgress = (hour: number) => {
    return Math.min(
      1,
      Math.max(0, (hour - startHour) / (endHour - startHour))
    );
  };

  /*
   * Potenza istantanea.
   *
   * P(s) = sin(πs)^1.4 × 9.6 kW
   */
  const getPower = (s: number) => {
    if (s <= 0 || s >= 1) return 0;

    return Math.pow(Math.sin(Math.PI * s), 1.4) * maxPower;
  };

  /*
   * Animation loop.
   */
  useEffect(() => {
    if (!running) {
      lastTimestampRef.current = null;
      return;
    }

    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const realDtSeconds =
        (timestamp - lastTimestampRef.current) / 1000;

      lastTimestampRef.current = timestamp;

      /*
       * simulationSpeed:
       *
       * 1   = tempo reale
       * 60  = 60 volte più veloce
       * 360 = 360 volte più veloce
       */
      const simulatedDtSeconds =
        realDtSeconds * simulationSpeed;

      const simulatedDtHours = simulatedDtSeconds / 3600;

      setCurrentHour((previousHour) => {
        const nextHour =
          previousHour + simulatedDtHours;

        /*
         * Se arriviamo al tramonto:
         * - fermiamo il tempo
         * - il punto resta a 20:00
         */
        if (nextHour >= endHour) {
          setRunning(false);
          return endHour;
        }

        /*
         * Calcolo della potenza nel punto attuale.
         */
        const s = getProgress(previousHour);
        const powerKw = getPower(s);

        /*
         * Energia:
         *
         * Wh += P(kW) × dt(h) × 1000
         *
         * equivalente a:
         *
         * Wh += P(kW) × dt(seconds) × 1000 / 3600
         */
        const addedWh =
          powerKw * simulatedDtHours * 1000;

        accumulatedRef.current += addedWh;

        setAccumulatedWh(accumulatedRef.current);

        return nextHour;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [
    running,
    simulationSpeed,
    startHour,
    endHour,
    maxPower,
  ]);

  /*
   * Progressione attuale.
   */
  const progress = getProgress(currentHour);

  /*
   * Potenza attuale.
   */
  const currentPower = getPower(progress);

  /*
   * Coordinate SVG.
   */
  const chart = useMemo(() => {
    const width = 1100;
    const height = 280;

    const paddingLeft = 30;
    const paddingRight = 30;
    const paddingTop = 25;
    const paddingBottom = 42;

    const graphWidth =
      width - paddingLeft - paddingRight;

    const graphHeight =
      height - paddingTop - paddingBottom;

    const baseline =
      paddingTop + graphHeight;

    const x = (s: number) =>
      paddingLeft + s * graphWidth;

    const y = (power: number) =>
      baseline -
      (power / maxPower) * graphHeight;

    return {
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      graphWidth,
      graphHeight,
      baseline,
      x,
      y,
    };
  }, [maxPower]);

  /*
   * Generiamo la curva.
   */
  const curvePoints = useMemo(() => {
    const points: string[] = [];

    const numberOfPoints = 240;

    for (let i = 0; i <= numberOfPoints; i++) {
      const s = i / numberOfPoints;

      const power = getPower(s);

      points.push(
        `${chart.x(s)},${chart.y(power)}`
      );
    }

    return points.join(" ");
  }, [chart, maxPower]);

  /*
   * Barre verticali rosse dietro al pallino.
   */
  const bars = useMemo(() => {
    const result = [];

    const numberOfBars = 150;

    for (let i = 0; i <= numberOfBars; i++) {
      const s = i / numberOfBars;

      if (s > progress) break;

      const power = getPower(s);

      result.push({
        x: chart.x(s),
        y: chart.y(power),
        height: chart.baseline - chart.y(power),
      });
    }

    return result;
  }, [chart, progress]);

  /*
   * Coordinate del pallino.
   */
  const dotX = chart.x(progress);
  const dotY = chart.y(currentPower);

  /*
   * Formattazione Wh.
   *
   * 31657 -> 31,657 Wh
   */
  const formattedWh = Math.round(
    accumulatedWh
  ).toLocaleString("en-US");

  /*
   * Formattazione ora.
   */
  const formattedHour = Math.floor(currentHour);
  const formattedMinutes = Math.floor(
    (currentHour - formattedHour) * 60
  );

  const timeLabel =
    `${String(formattedHour).padStart(2, "0")}:` +
    `${String(formattedMinutes).padStart(2, "0")}`;

  /*
   * Reset.
   */
  const reset = () => {
    accumulatedRef.current = 0;
    setAccumulatedWh(0);
    setCurrentHour(initialHour);
    lastTimestampRef.current = null;
    setRunning(autoPlay);
  };

  return (
    <div className="solar-chart">

      {/* HEADER */}
      <div className="solar-chart__header">

        <div className="solar-chart__accumulated">
          <span className="solar-chart__red-square" />

          <span>
            ACCUMULATED{" "}
            <strong>{formattedWh} Wh</strong>
          </span>
        </div>

        <div className="solar-chart__power">
          LATTICE ARRAY · {maxPower.toFixed(1)} kWp
        </div>

      </div>

      {/* CHART */}
      <div className="solar-chart__viewport">

        <svg
          className="solar-chart__svg"
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          preserveAspectRatio="none"
        >

          {/* GRID VERTICAL */}
          {Array.from({ length: 8 }).map((_, index) => {
            const s = index / 7;
            const x = chart.x(s);

            return (
              <line
                key={`grid-${index}`}
                x1={x}
                x2={x}
                y1={chart.paddingTop}
                y2={chart.baseline}
                className="solar-chart__grid"
              />
            );
          })}

          {/* BASELINE */}
          <line
            x1={chart.paddingLeft}
            x2={
              chart.width -
              chart.paddingRight
            }
            y1={chart.baseline}
            y2={chart.baseline}
            className="solar-chart__baseline"
          />

          {/* ACCUMULATED BARS */}
          {bars.map((bar, index) => (
            <line
              key={index}
              x1={bar.x}
              x2={bar.x}
              y1={chart.baseline}
              y2={bar.y}
              className="solar-chart__bar"
            />
          ))}

          {/* CURVA TRATTEGGIATA */}
          <polyline
            points={curvePoints}
            fill="none"
            className="solar-chart__curve"
          />

          {/* PUNTO ATTUALE */}
          <circle
            cx={dotX}
            cy={dotY}
            r="9"
            className="solar-chart__dot-outer"
          />

          <circle
            cx={dotX}
            cy={dotY}
            r="5"
            className="solar-chart__dot-inner"
          />

        </svg>

      </div>

      {/* TIME AXIS */}
      <div className="solar-chart__axis">

        {Array.from({ length: 8 }).map((_, index) => {
          const hour =
            startHour +
            ((endHour - startHour) * index) / 7;

          return (
            <span key={index}>
              {String(Math.round(hour)).padStart(2, "0")}
            </span>
          );
        })}

      </div>

      {/* CONTROLS */}
      <div className="solar-chart__controls">

        <div className="solar-chart__time">
          {timeLabel}
        </div>

        <div className="solar-chart__power-value">
          {currentPower.toFixed(2)} kW
        </div>

        <button
          type="button"
          onClick={() => setRunning((value) => !value)}
        >
          {running ? "Pause" : "Play"}
        </button>

        <button
          type="button"
          onClick={reset}
        >
          Reset
        </button>

      </div>

    </div>
  );
}