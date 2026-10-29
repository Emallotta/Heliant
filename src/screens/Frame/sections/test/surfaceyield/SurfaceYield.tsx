import React, { useMemo, useState } from "react";
import "./SurfaceYield.css";

type MountType =
  | "Pitched roof"
  | "Vertical facade"
  | "Dual-axis tracker";

type SkyType =
  | "Nordic"
  | "Central"
  | "Mediterranean"
  | "Desert";

type SurfaceYieldProps = {
  initialWidth?: number;
  initialHeight?: number;

  minWidth?: number;
  maxWidth?: number;

  minHeight?: number;
  maxHeight?: number;
};

const MONTHS = [
  "J",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
];

const MOUNT_DISTRIBUTIONS: Record<MountType, number[]> = {
  "Pitched roof": [
    0.45,
    0.55,
    0.72,
    0.86,
    0.96,
    1.12,
    1.14,
    1.05,
    0.87,
    0.68,
    0.52,
    0.42,
  ],

  "Vertical facade": [
    0.62,
    0.67,
    0.76,
    0.84,
    0.92,
    0.96,
    0.98,
    0.95,
    0.88,
    0.78,
    0.68,
    0.60,
  ],

  "Dual-axis tracker": [
    0.42,
    0.56,
    0.78,
    0.94,
    1.08,
    1.18,
    1.20,
    1.12,
    0.92,
    0.72,
    0.54,
    0.42,
  ],
};

/*
 * Sky modifier.
 *
 * Questi sono valori provvisori.
 * Quando avrai le formule reali possiamo sostituirli.
 */
const SKY_FACTORS: Record<SkyType, number> = {
  Nordic: 0.72,
  Central: 1,
  Mediterranean: 1.16,
  Desert: 1.27,
};

export default function SurfaceYield({
  initialWidth = 8,
  initialHeight = 5,

  minWidth = 2,
  maxWidth = 15,

  minHeight = 2,
  maxHeight = 10,
}: SurfaceYieldProps) {
  const [width, setWidth] =
    useState(initialWidth);

  const [height, setHeight] =
    useState(initialHeight);

  const [mount, setMount] =
    useState<MountType>("Pitched roof");

  const [sky, setSky] =
    useState<SkyType>("Central");

  /*
   * =========================================================
   * CALCULATIONS
   * =========================================================
   */

  const activeSurface = useMemo(() => {
    return width * height;
  }, [width, height]);

  /*
   * Base annual yield per m².
   *
   * Valore provvisorio ricavato dal mockup:
   *
   * 40 m² -> 14,145 kWh/year
   *
   * 14,145 / 40 = 353.625 kWh/m²/year
   */
  const baseYieldPerSquareMeter = 353.625;

  /*
   * Sky factor.
   */
  const skyFactor = SKY_FACTORS[sky];

  /*
   * Mount factor.
   *
   * Provvisorio.
   */
  const mountFactors: Record<MountType, number> = {
    "Pitched roof": 1,
    "Vertical facade": 0.76,
    "Dual-axis tracker": 1.18,
  };

  const mountFactor = mountFactors[mount];

  /*
   * Annual yield.
   */
  const annualYield = useMemo(() => {
    return Math.round(
      activeSurface *
        baseYieldPerSquareMeter *
        skyFactor *
        mountFactor
    );
  }, [
    activeSurface,
    skyFactor,
    mountFactor,
  ]);

  /*
   * Monthly distribution.
   */
  const monthlyYield = useMemo(() => {
    const distribution =
      MOUNT_DISTRIBUTIONS[mount];

    const totalWeight = distribution.reduce(
      (sum, value) => sum + value,
      0
    );

    return distribution.map((value) => {
      return (
        (annualYield * value) /
        totalWeight
      );
    });
  }, [annualYield, mount]);

  /*
   * Maximum bar height.
   */
  const maxMonthlyYield = Math.max(
    ...monthlyYield
  );

  /*
   * Households powered.
   *
   * Provvisorio: 3500 kWh/anno per casa.
   */
  const households = Math.round(
    annualYield / 3500
  );

  /*
   * EV range.
   *
   * Provvisorio: 170 Wh/km.
   */
  const evRange = Math.round(
    (annualYield * 1000) / 170
  );

  /*
   * CO₂ avoided.
   *
   * Provvisorio: 0.4 kg/kWh.
   */
  const co2Avoided = annualYield * 0.4;

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const formatNumber = (value: number) => {
    return Math.round(value).toLocaleString(
      "en-US"
    );
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="surface-yield">

      {/* -------------------------------------------------
          HEADER
      -------------------------------------------------- */}

      <header className="surface-yield__header">

        <div className="surface-yield__eyebrow">
          INSTRUMENT 01 — YIELD
        </div>

        <h1>
          What would your surface do?
        </h1>

        <p>
          Drag the surface, pick the mount,
          pick the sky. The maths is live —
          tandem lattice at 31.2%, roof ratio
          0.88.
        </p>

      </header>

      {/* -------------------------------------------------
          MAIN PANEL
      -------------------------------------------------- */}

      <div className="surface-yield__panel">

        {/* LEFT */}
        <div className="surface-yield__controls">

          {/* WIDTH */}

          <div className="surface-yield__control">

            <div className="surface-yield__label">
              WIDTH ·{" "}
              <strong>
                {width.toFixed(1)} M
              </strong>
            </div>

            <div className="surface-yield__slider">

              <input
                type="range"
                min={minWidth}
                max={maxWidth}
                step={0.1}
                value={width}
                onChange={(event) =>
                  setWidth(
                    Number(event.target.value)
                  )
                }
              />

              <div
                className="surface-yield__slider-progress"
                style={{
                  width: `${
                    ((width - minWidth) /
                      (maxWidth - minWidth)) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>

          {/* HEIGHT */}

          <div className="surface-yield__control">

            <div className="surface-yield__label">
              HEIGHT / DEPTH ·{" "}
              <strong>
                {height.toFixed(1)} M
              </strong>
            </div>

            <div className="surface-yield__slider">

              <input
                type="range"
                min={minHeight}
                max={maxHeight}
                step={0.1}
                value={height}
                onChange={(event) =>
                  setHeight(
                    Number(event.target.value)
                  )
                }
              />

              <div
                className="surface-yield__slider-progress"
                style={{
                  width: `${
                    ((height - minHeight) /
                      (maxHeight - minHeight)) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>

          {/* ACTIVE SURFACE */}

          <div className="surface-yield__surface">
            ACTIVE SURFACE —{" "}
            <strong>
              {activeSurface.toFixed(0)} M²
            </strong>
          </div>

          {/* MOUNT */}

          <div className="surface-yield__option">

            <div className="surface-yield__option-label">
              Mount
            </div>

            <div className="surface-yield__buttons">

              {(
                [
                  "Pitched roof",
                  "Vertical facade",
                  "Dual-axis tracker",
                ] as MountType[]
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    mount === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setMount(item)
                  }
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

          {/* SKY */}

          <div className="surface-yield__option">

            <div className="surface-yield__option-label">
              Sky
            </div>

            <div className="surface-yield__buttons">

              {(
                [
                  "Nordic",
                  "Central",
                  "Mediterranean",
                  "Desert",
                ] as SkyType[]
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    sky === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSky(item)
                  }
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="surface-yield__results">

          {/* ANNUAL */}

          <div className="surface-yield__annual">

            <div className="surface-yield__annual-number">
              {formatNumber(annualYield)}
            </div>

            <div className="surface-yield__annual-label">
              KWH ACCUMULATED PER YEAR
            </div>

          </div>

          {/* STATS */}

          <div className="surface-yield__stats">

            <div>
              <strong>
                {formatNumber(households)}
              </strong>

              <span>
                HOUSEHOLDS
                <br />
                POWERED
              </span>
            </div>

            <div>
              <strong>
                {formatNumber(evRange)} km
              </strong>

              <span>
                EV RANGE PER YEAR
              </span>
            </div>

            <div>
              <strong>
                {co2Avoided.toFixed(1)} t
              </strong>

              <span>
                CO₂ AVOIDED
                <br />
                PER YEAR
              </span>
            </div>

          </div>

          {/* MONTHLY */}

          <div className="surface-yield__monthly">

            <div className="surface-yield__monthly-title">
              MONTHLY DISTRIBUTION
            </div>

            <div className="surface-yield__chart">

              {monthlyYield.map(
                (value, index) => {
                  const heightPercent =
                    (value /
                      maxMonthlyYield) *
                    100;

                  /*
                   * Nel mockup giugno/luglio
                   * hanno il colore accent.
                   *
                   * Qui evidenziamo il mese
                   * con il valore massimo.
                   */
                  const isMaximum =
                    value ===
                    maxMonthlyYield;

                  return (
                    <div
                      className="surface-yield__bar-wrapper"
                      key={`${MONTHS[index]}-${index}`}
                    >

                      <div
                        className={
                          "surface-yield__bar" +
                          (isMaximum
                            ? " maximum"
                            : "")
                        }
                        style={{
                          height: `${heightPercent}%`,
                        }}
                        title={`${MONTHS[index]} — ${Math.round(
                          value
                        ).toLocaleString(
                          "en-US"
                        )} kWh`}
                      />

                    </div>
                  );
                }
              )}

            </div>

            <div className="surface-yield__months">

              {MONTHS.map((month, index) => (
                <span key={index}>
                  {month}
                </span>
              ))}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}