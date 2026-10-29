import { CustomerTestimonialSection } from "./sections/CustomerTestimonialSection/CustomerTestimonialSection";
import { DaylightHeroSection } from "./sections/DaylightHeroSection/DaylightHeroSection";
import { NavigationSection } from "./sections/NavigationSection/NavigationSection";
import  SurfaceYield  from "./sections/test/surfaceyield/SurfaceYield";
import  SolarProductionChart  from "./sections/test/solarproductionchart/SolarProductionChart";
import HouseInstrument from "./sections/test/HouseIntrument/HouseInstrument";
import HardwareComponent from "./sections/test/HardwareComponent/HardwareComponent";
import TheField from "./sections/test/Field/field";
import DaylightComponent from "./sections/test/daylight/DaylightComponent";

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
          <article key={metric.value} className="min-w-0">
            <h2 className="[font-family:'Archivo',Helvetica] text-5xl font-extrabold leading-[48px] tracking-[0] text-[#ec3013] whitespace-nowrap">
              {metric.value}
            </h2>
            <p className="mt-3 [font-family:'Archivo',Helvetica] text-[13px] leading-[18px] font-normal tracking-[1.04px] text-[#1f1d1cb2]">
              {metric.label}
            </p>
          </article>
        ))}
      </section>
      <SurfaceYield /> 
      <HouseInstrument />
      <HardwareComponent />
      <TheField />
      <CustomerTestimonialSection />
      <DaylightComponent />
      <footer className="mx-auto w-full max-w-[1056px] px-6 py-3 sm:px-0">
        <p className="[font-family:'Archivo',Helvetica] text-[13px] leading-7 font-normal tracking-[0] text-[#1f1d1cb2]">
          Heliant — solar accumulation systems. A concept study; figures are
          illustrative.
        </p>
      </footer>
    </main>
  );
};