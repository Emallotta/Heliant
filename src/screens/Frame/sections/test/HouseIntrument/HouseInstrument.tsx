
import { useState } from "react";
import "./HouseInstrument.css"

type LayerId = "roof" | "facade" | "glazing" | "core";

type Layer = {
  id: LayerId;
  number: string;
  name: string;
  description: string;
  power: number;
  defaultActive: boolean;
};

const LAYERS: Layer[] = [
  {
    id: "roof",
    number: "01",
    name: "LATTICE ROOF",
    description: "9.6 kWp tandem array",
    power: 9.6,
    defaultActive: true,
  },
  {
    id: "facade",
    number: "02",
    name: "FACET FAÇADE",
    description: "6.4 kWp vertical skin",
    power: 6.4,
    defaultActive: false,
  },
  {
    id: "glazing",
    number: "03",
    name: "VEIL GLAZING",
    description: "1.8 kWp window film",
    power: 1.8,
    defaultActive: false,
  },
  {
    id: "core",
    number: "04",
    name: "CORE STORE",
    description: "solid-state accumulator",
    power: 0,
    defaultActive: true,
  },
];

type HouseInstrumentProps = {
  initialCoreSize?: number;
  maxCoreSize?: number;
};

function BuildingIllustration({
  active,
}: {
  active: Record<LayerId, boolean>;
}) {
  return (
    <svg
      className="house-instrument__building"
      viewBox="0 0 440 250"
      role="img"
      aria-label="Building illustration with selectable energy retrofit layers"
    >
      {/* Ground */}
      <line
        x1="18"
        y1="186"
        x2="418"
        y2="186"
        className="building-ground"
      />

      {/* Main building */}
      <rect
        x="62"
        y="61"
        width="163"
        height="125"
        className="building-wall"
      />

      {/* Roof structure */}
      <line
        x1="57"
        y1="61"
        x2="230"
        y2="61"
        className="building-outline"
      />

      {active.roof && (
        <g className="building-roof">
          <rect
            x="57"
            y="54"
            width="173"
            height="8"
            fill="#242424"
          />

          {Array.from({ length: 7 }).map((_, index) => (
            <polygon
              key={index}
              points={`
                ${68 + index * 23},50
                ${83 + index * 23},50
                ${78 + index * 23},59
                ${63 + index * 23},59
              `}
              fill="#ef321e"
            />
          ))}
        </g>
      )}

      {/* Windows */}
      {[78, 129, 180].map((x) => (
        <g key={x} className="building-window">
          <rect x={x} y="83" width="32" height="39" />
          <line x1={x + 16} y1="83" x2={x + 16} y2="122" />
        </g>
      ))}

      {[78, 129, 180].map((x) => (
        <g key={`lower-${x}`} className="building-window">
          <rect x={x} y="133" width="32" height="39" />
          <line x1={x + 16} y1="133" x2={x + 16} y2="172" />
        </g>
      ))}

      {/* Facade retrofit */}
      {active.facade && (
        <g className="building-facade">
          <rect
            x="63"
            y="63"
            width="160"
            height="121"
            fill="#ef321e"
            fillOpacity="0.09"
          />

          {Array.from({ length: 10 }).map((_, index) => (
            <line
              key={index}
              x1={70 + index * 16}
              y1="64"
              x2={70 + index * 16}
              y2="184"
            />
          ))}

          <rect
            x="63"
            y="63"
            width="160"
            height="121"
            fill="none"
            stroke="#ef321e"
            strokeWidth="1.5"
          />
        </g>
      )}

      {/* Side extension */}
      <rect
        x="225"
        y="103"
        width="90"
        height="83"
        className="building-extension"
      />

      {/* Glazing */}
      {active.glazing && (
        <g className="building-glazing">
          <rect
            x="230"
            y="108"
            width="80"
            height="74"
            fill="#ef321e"
            fillOpacity="0.08"
          />

          {Array.from({ length: 10 }).map((_, index) => (
            <line
              key={index}
              x1={235 + index * 7}
              y1="110"
              x2={235 + index * 7}
              y2="181"
            />
          ))}
        </g>
      )}

      {/* Door */}
      <rect
        x="288"
        y="145"
        width="22"
        height="41"
        className="building-door"
      />
      <circle cx="304" cy="166" r="1.5" fill="#333" />

      {/* Core store cable */}
      {active.core && (
        <path
          d="M 310 166 H 340 V 170"
          className="building-cable"
        />
      )}

      {/* Energy storage unit */}
      {active.core && (
        <g className="building-core">
          <rect
            x="340"
            y="139"
            width="48"
            height="47"
            fill="#242424"
          />

          <rect
            x="347"
            y="146"
            width="7"
            height="7"
            fill="#ef321e"
          />

          <text x="364" y="163" textAnchor="middle">
            CORE
          </text>
          <text x="364" y="173" textAnchor="middle">
            STORE
          </text>
        </g>
      )}

      {/* Active layer markers */}
      {active.facade && (
        <circle cx="215" cy="75" r="3" fill="#ef321e" />
      )}
    </svg>
  );
}

export default function HouseInstrument({
  initialCoreSize = 20,
  maxCoreSize = 100,
}: HouseInstrumentProps) {
  const [active, setActive] = useState<Record<LayerId, boolean>>({
    roof: true,
    facade: false,
    glazing: false,
    core: true,
  });

  const [coreSize, setCoreSize] = useState(initialCoreSize);

  const toggleLayer = (id: LayerId) => {
    setActive((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  /*
   * PROVISIONAL CALCULATIONS
   *
   * Replace these with the official project formulas
   * when they become available.
   */

  const systemSize = LAYERS.reduce((total, layer) => {
    if (
      layer.id !== "core" &&
      active[layer.id]
    ) {
      return total + layer.power;
    }

    return total;
  }, 0);

  const annualAccumulation = Math.round(
    (active.roof ? 10400 : 0) +
      (active.facade ? 10400 * (6.4 / 9.6) : 0) +
      (active.glazing ? 10400 * (1.8 / 9.6) : 0)
  );

  const autonomy = active.core
    ? coreSize / 0.9
    : 0;

  const formatNumber = (value: number) =>
    Math.round(value).toLocaleString("en-US");

  return (
    <main className="house-instrument">
      <header className="house-instrument__header">
        <div className="house-instrument__eyebrow">
          INSTRUMENT 02 — THE HOUSE
        </div>

        <h1>
          Attach it to the building you already have.
        </h1>

        <p>
          Every Heliant layer is retrofit hardware. Switch them
          on and off — the elevation and the arithmetic follow.
        </p>
      </header>

      <section className="house-instrument__panel">
        {/* LEFT: BUILDING */}
        <div className="house-instrument__visual">
          <BuildingIllustration active={active} />
        </div>

        {/* RIGHT: CONTROLS AND METRICS */}
        <div className="house-instrument__controls">
          <div className="house-instrument__layers">
            {LAYERS.map((layer) => (
              <button
                key={layer.id}
                type="button"
                aria-pressed={active[layer.id]}
                onClick={() => toggleLayer(layer.id)}
                className={
                  "house-instrument__layer" +
                  (active[layer.id] ? " is-active" : "")
                }
              >
                <span className="house-instrument__layer-name">
                  <span className="house-instrument__checkbox">
                    {active[layer.id] ? "■" : "□"}
                  </span>

                  <span>
                    {layer.number} · {layer.name}
                  </span>
                </span>

                <span className="house-instrument__layer-description">
                  {layer.description}
                </span>
              </button>
            ))}
          </div>

          {/* CORE SIZE */}
          <div className="house-instrument__core-control">
            <label htmlFor="core-size">
              CORE SIZE · {coreSize} KWH
            </label>

            <input
              id="core-size"
              type="range"
              min={5}
              max={maxCoreSize}
              step={1}
              value={coreSize}
              onChange={(event) =>
                setCoreSize(Number(event.target.value))
              }
              disabled={!active.core}
            />
          </div>

          {/* METRICS */}
          <div className="house-instrument__metrics">
            <div className="house-instrument__metric">
              <span>SYSTEM SIZE</span>
              <strong>{systemSize.toFixed(1)} kW</strong>
            </div>

            <div className="house-instrument__metric">
              <span>ANNUAL ACCUMULATION</span>
              <strong className="is-accent">
                {formatNumber(annualAccumulation)} kWh
              </strong>
            </div>

            <div className="house-instrument__metric">
              <span>AUTONOMY AT GRID LOSS</span>
              <strong>
                {autonomy.toFixed(0)} h
              </strong>
            </div>
          </div>

          <p className="house-instrument__note">
            Reference dwelling, Central-European sky.
            Autonomy assumes a 0.9 kW average household draw.
          </p>
        </div>
      </section>
    </main>
  );
}
