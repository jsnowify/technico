import ContactForm from "@/components/forms/ContactForm";
import EditorialHeader from "@/components/ui/EditorialHeader";

export default function ContactSection() {
  return (
    <section id="contact-form" className="border-t border-white/20 bg-black-bg">
      <div className="container-x mx-auto w-full max-w-[1920px] py-20 sm:py-24 lg:py-28">
        <EditorialHeader
          label="Contact"
          headingLevel="h2"
          title="Let’s discuss your project"
          copy={
            <p>
              Improve search engine rankings and organic visibility by
              identifying opportunities.
            </p>
          }
        />
        <div className="mt-12 sm:mt-16">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
