"use server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/**
 * Server Action for the global contact form
 * (components/forms/ContactForm.tsx, rendered at the end of every
 * page via components/layout/ContactSection.tsx). Currently
 * validates + logs; wire up a real email/CRM provider (Resend, SES,
 * HubSpot, etc.) where the TODO is marked.
 *
 * First name, last name, email, phone, and the preferred
 * date/time/timezone are required — everything else (company,
 * services, project details) is optional context that strengthens
 * the lead but shouldn't block submission.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const company = formData.get("company")?.toString().trim() ?? "";
  const services = formData.getAll("services").map((v) => v.toString());
  const projectDetails =
    formData.get("projectDetails")?.toString().trim() ?? "";
  const preferredDate = formData.get("preferredDate")?.toString().trim() ?? "";
  const preferredTime = formData.get("preferredTime")?.toString().trim() ?? "";
  const timezone = formData.get("timezone")?.toString().trim() ?? "";

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !preferredDate ||
    !preferredTime ||
    !timezone
  ) {
    return {
      status: "error",
      message:
        "First name, last name, email, phone, and a preferred date, time, and time zone are required.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  // TODO: send via a real provider, e.g.:
  // await resend.emails.send({ to: SITE_EMAIL, ... })
  console.log("Contact form submission:", {
    firstName,
    lastName,
    email,
    phone,
    company,
    services,
    projectDetails,
    preferredDate,
    preferredTime,
    timezone,
  });

  return { status: "success", message: "Thanks — we'll be in touch soon." };
}
