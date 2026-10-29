import { Card, CardContent } from "../../../../components/ui/card";

const testimonial = {
  quote:
    "“The meter ran backwards by breakfast. By March the utility sent a cheque, and a letter asking how.”",
  attribution: "— M. Okonkwo, first Heliant house, Rotterdam",
};

export const CustomerTestimonialSection = (): JSX.Element => {
  return (
    <section
      aria-label="Customer testimonial"
      className="w-full px-4 sm:px-8 lg:px-0"
    >
      <Card className="mx-auto w-full max-w-[864px] border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          <blockquote className="flex max-w-[655px] flex-col gap-9">
            <p className="[font-family:'Archivo',Helvetica] text-[34px] font-extrabold leading-[42px] tracking-[-0.51px] text-[#201e1d]">
              {testimonial.quote}
            </p>
            <footer>
              <cite className="[font-family:'Archivo',Helvetica] text-[15.5px] font-normal not-italic leading-7 text-[#1f1d1cb2]">
                {testimonial.attribution}
              </cite>
            </footer>
          </blockquote>
        </CardContent>
      </Card>
    </section>
  );
};
