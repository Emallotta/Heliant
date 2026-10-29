
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./Field.css";

const COLUMNS = 8;
const ROWS = 3;
const TOTAL_CELLS = COLUMNS * ROWS;

const cells = Array.from({ length: TOTAL_CELLS }, (_, index) => ({
  index,
  row: Math.floor(index / COLUMNS),
  col: index % COLUMNS,
  x: 30 + (index % COLUMNS) * 27,
  y: 116 + Math.floor(index / COLUMNS) * 28,
}));

function ArrayDiagram() {
  const [activeCell, setActiveCell] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    // Un passaggio completo dura circa sette secondi.
    const interval = window.setInterval(() => {
      setActiveCell((current) => (current + 1) % TOTAL_CELLS);
    }, 7000 / TOTAL_CELLS);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  return (
    <div className="field-diagram">
      <svg
        className="field-svg"
        viewBox="0 0 300 220"
        role="img"
        aria-label="Tre file di celle fotovoltaiche illuminate in sequenza durante la scansione"
      >
        <rect
          x="10"
          y="30"
          width="280"
          height="174"
          fill="none"
          stroke="#aaa7a5"
          strokeWidth="1"
        />

        <circle
          cx="42"
          cy="76"
          r="11"
          fill="#fff"
          stroke="#ff493b"
          strokeWidth="1"
        />
        <circle cx="42" cy="76" r="8" fill="#ff493b" />

        <text
          x="270"
          y="64"
          textAnchor="end"
          className="field-micro-label"
        >
          FIELD ID · 1.230m²
        </text>
        <text
          x="270"
          y="72"
          textAnchor="end"
          className="field-micro-label field-micro-secondary"
        >
          TELEMETRY ARRAY / 07
        </text>

        {Array.from({ length: ROWS }, (_, row) => (
          <g key={row}>
            <line
              x1="25"
              y1={126 + row * 28}
              x2="272"
              y2={126 + row * 28}
              stroke="#85817e"
              strokeWidth="0.8"
            />

            {cells
              .filter((cell) => cell.row === row)
              .map((cell) => {
                const distance =
                  (cell.index - activeCell + TOTAL_CELLS) % TOTAL_CELLS;

                const isActive = distance === 0;
                const isRecent = distance === TOTAL_CELLS - 1;

                return (
                  <motion.polygon
                    key={cell.index}
                    points={`
                      ${cell.x},${cell.y + 7}
                      ${cell.x + 5},${cell.y}
                      ${cell.x + 23},${cell.y}
                      ${cell.x + 19},${cell.y + 7}
                    `}
                    fill={
                      isActive
                        ? "#ff493b"
                        : isRecent
                          ? "#efb1a9"
                          : "#f4e8e5"
                    }
                    stroke={isActive ? "#e7372b" : "#776f6c"}
                    strokeWidth={isActive ? 1 : 0.7}
                    animate={{
                      opacity: isActive ? 1 : isRecent ? 0.9 : 0.78,
                    }}
                    transition={{ duration: 0.18 }}
                  />
                );
              })}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function TheField() {
  return (
    <section className="the-field">
      <div className="field-copy">
        <span className="field-eyebrow">THE FIELD</span>

        <h2>The array reports itself</h2>

        <p>
          No photography — telemetry. One sweep every seven
          seconds; the panel that lights red is the one being read.
        </p>
      </div>

      <div className="field-visual">
        <ArrayDiagram />
      </div>
    </section>
  );
}
