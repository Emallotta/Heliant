
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./DaylightComponent.css";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationStatus = "loading" | "ready" | "denied" | "unavailable";

const GRAPH = {
  left: 30,
  right: 510,
  baseline: 150,
  height: 62,
};

function normalizeHours(hours: number) {
  return ((hours % 24) + 24) % 24;
}

function getSolarEvent(
  date: Date,
  latitude: number,
  longitude: number,
  sunrise: boolean,
): Date | null {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const startOfYear = new Date(year, 0, 0);
  const dayNumber = Math.floor(
    (new Date(year, month, day).getTime() - startOfYear.getTime()) /
      86400000,
  );

  const longitudeHour = longitude / 15;
  const approximateTime =
    dayNumber + (sunrise ? 6 - longitudeHour : 18 - longitudeHour);

  const meanAnomaly = 0.9856 * approximateTime - 3.289;
  const trueLongitude =
    ((meanAnomaly +
      1.916 * Math.sin((meanAnomaly * Math.PI) / 180) +
      0.02 * Math.sin((2 * meanAnomaly * Math.PI) / 180) +
      282.634) %
      360 +
      360) %
    360;

  let rightAscension =
    (Math.atan(0.91764 * Math.tan((trueLongitude * Math.PI) / 180)) *
      180) /
    Math.PI;

  rightAscension = ((rightAscension % 360) + 360) % 360;

  rightAscension +=
    Math.floor(trueLongitude / 90) * 90 -
    Math.floor(rightAscension / 90) * 90;

  rightAscension /= 15;

  const sinDeclination =
    0.39782 * Math.sin((trueLongitude * Math.PI) / 180);
  const cosDeclination = Math.cos(Math.asin(sinDeclination));

  const cosHourAngle =
    (Math.cos((90.833 * Math.PI) / 180) -
      sinDeclination * Math.sin((latitude * Math.PI) / 180)) /
    (cosDeclination * Math.cos((latitude * Math.PI) / 180));

  if (cosHourAngle > 1 || cosHourAngle < -1) return null;

  let hourAngle =
    (Math.acos(cosHourAngle) * 180) / Math.PI;

  if (sunrise) hourAngle = 360 - hourAngle;

  hourAngle /= 15;

  const localMeanTime =
    hourAngle + rightAscension - 0.06571 * approximateTime - 6.622;

  const utcHours = normalizeHours(localMeanTime - longitudeHour);

  // Converte l'ora solare UTC nell'istante corrispondente.
  const utcDate = new Date(Date.UTC(year, month, day));
  utcDate.setTime(utcDate.getTime() + utcHours * 60 * 60 * 1000);

  return utcDate;
}

function getSunPosition(progress: number) {
  const t = Math.max(0, Math.min(1, progress));

  return {
    x: GRAPH.left + (GRAPH.right - GRAPH.left) * t,
    y: GRAPH.baseline - GRAPH.height * Math.sin(Math.PI * t),
  };
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatRemaining(milliseconds: number) {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

function formatDuration(hours: number, minutes: number) {
  return `${hours} h ${String(minutes).padStart(2, "0")} m`;
}

function DaylightGraph({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  const sun = getSunPosition(progress);
  const tickCount = 36;

  return (
    <svg
      className="daylight-graph"
      viewBox="0 0 540 180"
      role="img"
      aria-label={`Grafico del percorso solare giornaliero, avanzamento ${Math.round(
        progress * 100,
      )} percento`}
    >
      <defs>
        <linearGradient id="daylight-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area della curva solare */}
      <motion.path
        d={`M ${GRAPH.left} ${GRAPH.baseline} Q 270 ${
          GRAPH.baseline - GRAPH.height * 2
        } ${GRAPH.right} ${GRAPH.baseline} Z`}
        fill="url(#daylight-fill)"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Arco puntinato */}
      <motion.path
        d={`M ${GRAPH.left} ${GRAPH.baseline} Q 270 ${
          GRAPH.baseline - GRAPH.height * 2
        } ${GRAPH.right} ${GRAPH.baseline}`}
        fill="none"
        stroke="rgba(255,255,255,0.88)"
        strokeWidth="1.4"
        strokeDasharray="0.1 5.5"
        strokeLinecap="round"
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Tacche luminose fino all'ora corrente */}
      {Array.from({ length: tickCount + 1 }, (_, index) => {
        const t = index / tickCount;
        const point = getSunPosition(t);
        const isPast = t <= progress;

        return (
          <motion.line
            key={index}
            x1={point.x}
            y1={GRAPH.baseline}
            x2={point.x}
            y2={point.y}
            stroke="#fff"
            strokeWidth="0.7"
            initial={false}
            animate={{
              opacity: isPast ? 0.58 : 0,
              y2: point.y,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.45,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* Linea dell'orizzonte */}
      <line
        x1="0"
        y1={GRAPH.baseline}
        x2="540"
        y2={GRAPH.baseline}
        stroke="#fff"
        strokeWidth="1.2"
      />

      {/* Marcatori di alba e tramonto */}
      <path
        d={`M ${GRAPH.left} ${GRAPH.baseline + 10} v 7 m -2 -2 l 2 2 l 2 -2`}
        fill="none"
        stroke="#fff"
        strokeWidth="0.8"
      />
      <path
        d={`M ${GRAPH.right} ${GRAPH.baseline + 10} v 7 m -2 -2 l 2 2 l 2 -2`}
        fill="none"
        stroke="#fff"
        strokeWidth="0.8"
      />

      {/* Posizione del sole, animata in modo fluido */}
      <motion.g
        initial={false}
        animate={{ x: sun.x, y: sun.y }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 70, damping: 22, mass: 0.8 }
        }
      >
        <circle
          r="10"
          fill="none"
          stroke="#fff"
          strokeWidth="1.2"
        />
        <circle
          r="5.5"
          fill="#f32d13"
          stroke="#fff"
          strokeWidth="1.2"
        />
      </motion.g>
    </svg>
  );
}

export default function DaylightComponent() {
  const [now, setNow] = useState(() => new Date());
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("loading");

  const reducedMotion = useReducedMotion();

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("ready");
      },
      (error) => {
        setLocationStatus(
          error.code === error.PERMISSION_DENIED ? "denied" : "unavailable",
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 300000,
      },
    );
  }

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    requestLocation();
    // La richiesta iniziale avviene una sola volta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sunrise =
    coordinates &&
    getSolarEvent(now, coordinates.latitude, coordinates.longitude, true);

  const sunset =
    coordinates &&
    getSolarEvent(now, coordinates.latitude, coordinates.longitude, false);

  const sunriseMs = sunrise?.getTime() ?? 0;
  const sunsetMs = sunset?.getTime() ?? 0;

  const progress =
    sunrise && sunset && sunsetMs > sunriseMs
      ? Math.max(
          0,
          Math.min(1, (now.getTime() - sunriseMs) / (sunsetMs - sunriseMs)),
        )
      : 0.5;

  const nextSunset = sunset
    ? sunsetMs > now.getTime()
      ? sunset
      : getSunSolarTomorrow(now, coordinates!)
    : null;

  const remaining = nextSunset
    ? formatRemaining(nextSunset.getTime() - now.getTime())
    : null;

  const locationMessage =
    locationStatus === "loading"
      ? "CALCULATING YOUR DAYLIGHT"
      : locationStatus === "denied"
        ? "ENABLE LOCATION TO CALCULATE SUNSET"
        : "LOCATION UNAVAILABLE — TRY AGAIN";

  return (
    <section className="daylight-component">
      <div className="daylight-divider" aria-hidden="true" />

      <div className="daylight-content">
        <motion.header
          className="daylight-heading"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>
            Own the daylight.
            <br />
            {remaining
              ? `There are ${formatDuration(
                  remaining.hours,
                  remaining.minutes,
                )} of it today.`
              : "Every minute is yours."}
          </h1>
        </motion.header>

        <motion.div
          className="daylight-chart-wrap"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <DaylightGraph
            progress={progress}
            reducedMotion={Boolean(reducedMotion)}
          />
        </motion.div>

        <div className="daylight-bottom">
          <div className="daylight-clock-block">
            <motion.div
              key={formatTime(now).slice(0, 5)}
              className="daylight-clock"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTime(now)}
            </motion.div>
            <p className="daylight-caption">
              {coordinates
                ? "UNTIL SUNSET — YOUR LOCAL TIME"
                : locationMessage}
            </p>
          </div>

          <div className="daylight-action">
            {coordinates ? (
              <a className="daylight-cta" href="#contact">
                Book a site survey — it takes an afternoon
              </a>
            ) : (
              <button
                className="daylight-cta"
                type="button"
                onClick={requestLocation}
                disabled={locationStatus === "loading"}
              >
                {locationStatus === "loading"
                  ? "Finding your location…"
                  : "Enable location"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function getSunSolarTomorrow(
  now: Date,
  coordinates: Coordinates,
): Date | null {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getSolarEvent(
    tomorrow,
    coordinates.latitude,
    coordinates.longitude,
    false,
  );
}
