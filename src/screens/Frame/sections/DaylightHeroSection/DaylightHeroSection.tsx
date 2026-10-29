import { Button } from "../../../../components/ui/button";

const heroActions = [
  {
    label: "Size your surface",
    className:
      "h-[35px] min-w-[146px] rounded-none border border-transparent bg-[#ec3013] px-4 [font-family:'Archivo',Helvetica] text-sm font-extrabold leading-[16.8px] text-[#f3f2f2] hover:bg-[#d92a10]",
  },
  {
    label: "See the hardware",
    className:
      "h-[35px] min-w-[146px] rounded-none border border-transparent bg-transparent px-4 [font-family:'Archivo',Helvetica] text-sm font-extrabold leading-[16.8px] text-[#ec3013] hover:bg-transparent hover:text-[#c82910]",
  },
];

export const DaylightHeroSection = (): JSX.Element => {
  return (
    <section className="relative w-full px-6 py-[94px] sm:px-12 lg:px-[30%]">
      <div className="w-full max-w-[820px]">
        <h1 className="[font-family:'Archivo',Helvetica] text-[42px] font-extrabold leading-[1.06] tracking-[-1.6px] text-[#201e1d] sm:text-[60px] lg:text-[80px]">
          173,000 terawatts fall
          <br />
          on Earth.
          <br />
          Catch your share.
        </h1>
        <p className="mt-8 max-w-[590px] [font-family:'Archivo',Helvetica] text-[17px] font-normal leading-7 text-[#201e1d]">
          Heliant builds next-generation solar accumulation: perovskite lattice
          roofs,
          <br />
          façade skins that harvest walls, glazing that pays rent, and a
          solid-state core
          <br />
          that holds the day for the night.
        </p>
        <nav
          className="mt-8 flex flex-wrap items-center gap-4"
          aria-label="Hero actions"
        >
          {heroActions.map((action) => (
            <Button
              key={action.label}
              type="button"
              className={action.className}
            >
              {action.label}
            </Button>
          ))}
        </nav>
      </div>
    </section>
  );
};
