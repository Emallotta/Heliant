
import "./field.css";

const ROWS = 3;
const COLUMNS = 8;
const TOTAL_CELLS = ROWS * COLUMNS;

const cells = Array.from({ length: TOTAL_CELLS }, (_, index) => {
  const row = Math.floor(index / COLUMNS);
  const column = index % COLUMNS;

  // Percorso a serpentina
  const visualColumn =
    row % 2 === 0 ? column : COLUMNS - 1 - column;

  return {
    id: index,
    x: 48 + visualColumn * 55,
    y: 142 + row * 48,
    delay: `${(index * 7) / TOTAL_CELLS}s`,
  };
});

export default function TheField() {
  return (
    <section className="the-field">
      <div className="the-field-inner">

        <div className="field-copy">
          <span className="field-eyebrow">THE FIELD</span>

          <h2>The array reports itself</h2>

          <p>
            No photography — telemetry. One sweep every
            seven seconds; the panel that lights red is
            the one being read.
          </p>
        </div>

        <div className="field-panel">
          <div className="field-panel-status">
            <div className="field-status-indicator" />

            <div className="field-panel-meta">
              <span>FIELD 01 — LIVE</span>
              <span>TELEMETRY ARRAY / 07</span>
            </div>
          </div>

          <svg
            className="field-diagram"
            viewBox="0 0 500 280"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Array di celle con cursore di lettura animato"
          >
            {/* Linee orizzontali */}
            {[0, 1, 2].map((row) => (
              <line
                key={row}
                x1="28"
                y1={163 + row * 48}
                x2="472"
                y2={163 + row * 48}
                className="field-row-line"
              />
            ))}

            {/* Linea verticale */}
            <line
              x1="48"
              y1="108"
              x2="48"
              y2="265"
              className="field-reading-line"
            />

            {/* Celle */}
            {cells.map((cell) => (
              <path
                key={cell.id}
                d={`
                  M ${cell.x} ${cell.y}
                  h 38
                  l -11 15
                  h -38
                  z
                `}
                className="field-cell"
                style={{
                  animationDelay: cell.delay,
                }}
              />
            ))}

            {/* Percorso invisibile del cursore */}
            <path
              id="field-cursor-path"
              d="
                M 67 137
                L 452 137
                L 452 185
                L 67 185
                L 67 233
                L 452 233
              "
              fill="none"
            />

            {/* Cursore */}
            <g className="field-cursor">
              <circle r="12" className="field-cursor-glow" />
              <circle r="4" className="field-cursor-core" />

              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                calcMode="linear"
                rotate="auto"
                path="
                  M 67 137
                  L 452 137
                  L 452 185
                  L 67 185
                  L 67 233
                  L 452 233
                "
              />
            </g>

            <circle
              cx="48"
              cy="108"
              r="3"
              className="field-origin"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

