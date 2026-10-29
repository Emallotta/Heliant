import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./HardwareComponent.css";

const RED = "#ef321e";

const layers = [
  {
    id: "lattice",
    number: "01",
    title: "Lattice",
    description:
      "Tandem perovskite, 31.2% certified. A panel that prints like newspaper stock and outperforms silicon by a third — matte black, frameless, 6.1 kg.",
    detail: "Tandem perovskite",
    efficiency: "31.2%",
    format: "1720 × 1130 mm",
    mass: "6.1 kg",
  },
  {
    id: "facet",
    number: "02",
    title: "Facet",
    description:
      "Walls work the low sun. A vertical accumulation skin that turns south façades into winter harvesters — when roofs idle under snow, Facet peaks.",
    detail: "Vertical photovoltaic skin",
    efficiency: "24.8%",
    format: "Custom façade",
    mass: "8.4 kg/m²",
  },
  {
    id: "veil",
    number: "03",
    title: "Veil",
    description:
      "Glazing that pays rent. A 42%-transparent film laminated into ordinary windows — 1.8 kilowatts from glass you already own.",
    detail: "Transparent solar film",
    efficiency: "18.6%",
    format: "Window integrated",
    mass: "2.2 kg/m²",
  },
  {
    id: "core",
    number: "04",
    title: "Core",
    description:
      "The day, held for the night. Solid-state accumulation: 6,000 cycles to 96%, 14 ms islanding when the grid drops, and no thermal runaway — ever.",
    detail: "Solid-state accumulator",
    efficiency: "96% retention",
    format: "Modular storage",
    mass: "20 kWh module",
  },
] as const;

type LayerId = (typeof layers)[number]["id"];

function ExplodedDiagram({
  selected,
  reducedMotion,
}: {
  selected: LayerId;
  reducedMotion: boolean | null;
}) {
  const animationEnabled = !reducedMotion;

  const layerMotion = (
    delay: number,
    distance: number,
  ) => ({
    y: animationEnabled ? [0, -distance, 0, distance * 0.25, 0] : 0,
    transition: {
      duration: 7 + delay * 1.5,
      delay,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  });

  return (
    <svg
      className="hardware-diagram"
      viewBox="0 0 460 310"
      role="img"
      aria-label="Exploded view of a four-layer energy panel"
    >
      <defs>
        <linearGradient id="panelGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={RED} stopOpacity="0.12" />
          <stop offset="100%" stopColor={RED} stopOpacity="0.01" />
        </linearGradient>

        <filter id="layerShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#000"
            floodOpacity="0.08"
          />
        </filter>
      </defs>

      {/* LAYER 01 — LATTICE */}
      <motion.g
        animate={layerMotion(0, 3)}
        className={selected === "lattice" ? "diagram-layer is-selected" : "diagram-layer"}
      >
        <polygon
          points="76,78 228,34 362,73 211,117"
          fill={selected === "lattice" ? "url(#panelGlow)" : "none"}
          stroke="#292929"
          strokeWidth={selected === "lattice" ? 1.5 : 1}
          filter="url(#layerShadow)"
        />

        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`lat-a-${i}`}
            x1={94 + i * 21}
            y1={73 - i * 6.1}
            x2={228 + i * 19}
            y2={113 - i * 5.7}
            stroke={RED}
            strokeWidth={0.9}
            opacity={0.9}
          />
        ))}

        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`lat-b-${i}`}
            x1={103 + i * 27}
            y1={87 + i * 7.8}
            x2={253 + i * 27}
            y2={43 + i * 7.8}
            stroke={RED}
            strokeWidth={0.9}
            opacity={0.9}
          />
        ))}
      </motion.g>

      {/* LAYER 02 — FACET */}
      <motion.g
        animate={layerMotion(0.8, 4)}
        className={selected === "facet" ? "diagram-layer is-selected" : "diagram-layer"}
      >
        <polygon
          points="76,128 228,84 362,123 211,168"
          fill={selected === "facet" ? "url(#panelGlow)" : "none"}
          stroke={RED}
          strokeWidth={1.2}
        />

        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`facet-${i}`}
            x1={95 + i * 20}
            y1={124 - i * 5.7}
            x2={229 + i * 19}
            y2={164 - i * 5.7}
            stroke={RED}
            strokeWidth={0.8}
            opacity={0.75}
          />
        ))}
      </motion.g>

      {/* LAYER 03 — VEIL / DARK SUBSTRATE */}
      <motion.g
        animate={layerMotion(1.5, 3)}
        className={selected === "veil" ? "diagram-layer is-selected" : "diagram-layer"}
      >
        <polygon
          points="76,179 228,135 362,174 211,219"
          fill="#222222"
          stroke={selected === "veil" ? RED : "#222222"}
          strokeWidth={selected === "veil" ? 1.8 : 0.8}
        />

        <polygon
          points="76,179 211,219 362,174 228,135"
          fill="#222222"
        />
      </motion.g>

      {/* LAYER 04 — CORE / BASE */}
      <motion.g
        animate={layerMotion(2.1, 2.5)}
        className={selected === "core" ? "diagram-layer is-selected" : "diagram-layer"}
      >
        <polygon
          points="76,229 228,185 362,224 211,269"
          fill={selected === "core" ? "url(#panelGlow)" : "none"}
          stroke="#292929"
          strokeWidth={selected === "core" ? 1.5 : 1}
        />

        <rect
          x="199"
          y="242"
          width="20"
          height="7"
          fill={RED}
        />
      </motion.g>

      {/* RIGHT-HAND ANNOTATIONS */}
      {[
        { y: 65, title: "01", subtitle: "Tandem perovskite" },
        { y: 116, title: "02", subtitle: "Photovoltaic lattice" },
        { y: 167, title: "03", subtitle: "Silicon / laminate cell" },
        { y: 218, title: "04", subtitle: "Graphite backsheet + bus" },
      ].map((label) => (
        <g key={label.title}>
          <line
            x1="300"
            y1={label.y + 9}
            x2="386"
            y2={label.y + 9}
            stroke="#777"
            strokeWidth="0.6"
          />
          <text
            x="392"
            y={label.y + 5}
            fill={RED}
            fontSize="7"
            fontWeight="700"
          >
            {label.title}
          </text>
          <text
            x="392"
            y={label.y + 15}
            fill="#555"
            fontSize="6.2"
          >
            {label.subtitle}
          </text>
        </g>
      ))}

      {/* SCALE */}
      <line
        x1="76"
        y1="288"
        x2="362"
        y2="288"
        stroke="#aaa"
        strokeWidth="0.7"
      />
      <line x1="76" y1="284" x2="76" y2="292" stroke="#aaa" strokeWidth="0.7" />
      <line x1="362" y1="284" x2="362" y2="292" stroke="#aaa" strokeWidth="0.7" />

      <text x="76" y="280" fontSize="6.5" fill="#555">
        1720 MM · EXPLODED ELEVATION, NOT TO SCALE
      </text>
    </svg>
  );
}

export default function HardwareComponent() {
  const [selected, setSelected] = useState<LayerId>("lattice");
  const reducedMotion = useReducedMotion();

  const activeLayer = layers.find((layer) => layer.id === selected)!;

  return (
    <main className="hardware">
      <div className="hardware__eyebrow">THE HARDWARE</div>

      <motion.section
        className="hardware__hero"
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hardware__diagram-wrap">
          <ExplodedDiagram
            selected={selected}
            reducedMotion={reducedMotion}
          />
        </div>

        <div className="hardware__specs">
          <motion.h2
            key={activeLayer.id}
            initial={reducedMotion ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            LATTICE — BENCH SAMPLE NO. 118
          </motion.h2>

          <div className="hardware__spec-row">
            <span>CELL</span>
            <strong>{activeLayer.detail}</strong>
          </div>

          <div className="hardware__spec-row">
            <span>EFFICIENCY</span>
            <strong className="hardware__red">
              {activeLayer.efficiency}
            </strong>
          </div>

          <div className="hardware__spec-row">
            <span>FORMAT</span>
            <strong>{activeLayer.format}</strong>
          </div>

          <div className="hardware__spec-row">
            <span>MASS</span>
            <strong>{activeLayer.mass}</strong>
          </div>

          <p className="hardware__spec-note">
            Four layers, one laminate. The lattice is the part that pulses.
          </p>
        </div>
      </motion.section>

      <div className="hardware__list">
        {layers.map((layer, index) => (
          <motion.button
            key={layer.id}
            type="button"
            className={`hardware__item ${
              selected === layer.id ? "is-selected" : ""
            }`}
            onClick={() => setSelected(layer.id)}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.55,
              delay: reducedMotion ? 0 : index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={reducedMotion ? undefined : { x: 3 }}
            whileTap={reducedMotion ? undefined : { scale: 0.998 }}
          >
            <div className="hardware__item-title">
              <span className="hardware__item-number">
                <i />
                {layer.number}
              </span>
              <strong>{layer.title}</strong>
            </div>

            <p>{layer.description}</p>
          </motion.button>
        ))}
      </div>
    </main>
  );
}
