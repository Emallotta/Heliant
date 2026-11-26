import { useEffect, useRef, useState } from "react";
import { CustomerTestimonialSection } from "./sections/CustomerTestimonialSection/CustomerTestimonialSection";
import { DaylightHeroSection } from "./sections/DaylightHeroSection/DaylightHeroSection";
import { NavigationSection } from "./sections/NavigationSection/NavigationSection";
import SurfaceYield  from "./sections/test/surfaceyield/SurfaceYield";
import SolarProductionChart  from "./sections/test/solarproductionchart/SolarProductionChart";
import HouseInstrument from "./sections/test/HouseIntrument/HouseInstrument";
import HardwareComponent from "./sections/test/HardwareComponent/HardwareComponent";
import TheField from "./sections/test/Field/field";
import DaylightComponent from "./sections/test/daylight/DaylightComponent";

type AnimatedMetricProps = {
  value: string;
  label: React.ReactNode;
};

function AnimatedMetric({ value, label }: AnimatedMetricProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = articleRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const match = value.match(/^([\d,.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const target = parseFloat(match[1].replace(/,/g, ""));
    const suffix = match[2];

    const decimals = (match[1].split(".")[1] || "").length;
    const duration = 1800;
    let animationFrame: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = target * easedProgress;

      const formattedValue = currentValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      setDisplayValue(`${formattedValue}${suffix}`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value]);

  return (
    <article
      ref={articleRef}
      className={`min-w-0 transition-all duration-700 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0"
      }`}
    >
      <h2 className="[font-family:'Archivo',Helvetica] text-5xl font-extrabold leading-[48px] tracking-[0] text-[#ec3013] whitespace-nowrap">
        {displayValue}
      </h2>

      <p className="mt-3 [font-family:'Archivo',Helvetica] text-[13px] leading-[18px] font-normal tracking-[1.04px] text-[#1f1d1cb2]">
        {label}
      </p>
    </article>
  );
}

const performanceMetrics = [
  {
    value: "23.1%",
    label: (
      <>
        CERTIFIED TANDEM CELL
        <br />
        EFFICIENCY
      </>
    ),
  },
  {
    value: "4,440",
    label: "CYCLES TO 96% CORE CAPACITY",
  },
  {
    value: "10 ms",
    label: (
      <>
        ISLANDING WHEN THE
        <br />
        GRID DROPS
      </>
    ),
  },
  {
    value: "18 yr",
    label: "FULL-YIELD WARRANTY",
  },
];

export const Frame = (): JSX.Element => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f3f2f2]">
      <NavigationSection />
      <DaylightHeroSection />
     <div style={{ width: "100%" }}>
      <SolarProductionChart
        startHour={6}
        endHour={20}
        initialHour={6}
        maxPower={9.6}
        simulationSpeed={60}
        autoPlay={true}
      />
    </div>
      <section
        aria-label="Heliant performance metrics"
        className="mx-auto grid w-full max-w-[1056px] grid-cols-2 gap-x-8 gap-y-8 px-6 py-[72px] sm:grid-cols-4 sm:gap-x-12 sm:px-0"
      >
        {performanceMetrics.map((metric) => (
          <AnimatedMetric
            key={metric.value}
            value={metric.value}
            label={metric.label}
          />
        ))}
      </section>
      <SurfaceYield /> 
      <HouseInstrument />
      <HardwareComponent />
      <TheField />
      <CustomerTestimonialSection />
      <DaylightComponent />
      <footer className="mx-auto w-full max-w-[1056px] px-6 py-[50px] sm:px-0">
        <p className="[font-family:'Archivo',Helvetica] text-[13px] leading-7 font-normal tracking-[0] text-[#1f1d1cb2]">
          Heliant — solar accumulation systems. A concept study; figures are
          illustrative.
        </p>
      </footer>
    </main>
  );
};