import { Button } from "../../../../components/ui/button";

const navigationItems = ["Hardware", "Yield", "Configure"];

export const NavigationSection = (): JSX.Element => {
  return (
    <header className="w-full border-b-2 border-[#1f1d1c66] bg-[#f3f2f2]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-[40px] w-full max-w-[1056px] items-center justify-between gap-5 px-4 sm:px-6"
      >
        <Button
          type="button"
          variant="ghost"
          className="h-auto shrink-0 rounded-none p-0 [font-family:'Archivo',Helvetica] text-lg font-extrabold leading-[27.9px] tracking-[0] text-[#201e1d] hover:bg-transparent hover:text-[#201e1d]"
        >
          Heliant
        </Button>
        <div className="flex items-center gap-[15.6px] overflow-x-auto">
          {navigationItems.map((item) => (
            <Button
              key={item}
              type="button"
              variant="ghost"
              className="h-auto shrink-0 rounded-none p-0 [font-family:'Archivo',Helvetica] text-sm font-normal leading-[21.7px] tracking-[0] text-[#201e1d] hover:bg-transparent hover:text-[#201e1d]"
            >
              {item}
            </Button>
          ))}

          <Button
            type="button"
            className="h-auto shrink-0 rounded-none border border-transparent bg-[#ec3013] px-[15px] py-[8px] [font-family:'Archivo',Helvetica] text-sm font-extrabold leading-[16.8px] tracking-[0] text-[#201e1d] hover:bg-[#d92b11] hover:text-[#201e1d]"
          >
            Book a survey
          </Button>
        </div>
      </nav>
    </header>
  );
};
