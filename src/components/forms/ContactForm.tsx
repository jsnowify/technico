"use client";

import { useActionState, useEffect, useState } from "react";
import {
  submitContactForm,
  type ContactFormState,
} from "@/lib/actions/contact";
import { SERVICES, QUICK_TIMEZONES, TIME_SLOTS } from "@/lib/constants";
import { guessTimezone } from "@/lib/utils/timezone";
import { toISODate } from "@/lib/utils/date";
import DatePicker from "@/components/forms/DatePicker";
import TimeSlotPicker from "@/components/forms/TimeSlotPicker";
import TimezonePicker from "@/components/forms/TimezonePicker";
import {
  FIELD_CLASSES,
  LABEL_CLASSES,
  FIELDSET_CLASSES,
  TAG_BASE_CLASSES,
  CHIP_INACTIVE_CLASSES,
} from "@/components/forms/fieldStyles";
import GridCorners from "@/components/ui/GridCorners";

const initialState: ContactFormState = { status: "idle" };

/** Qualified lead form with a mobile-first reading order and desktop schedule rail. */

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Optional() {
  return <span className="font-normal text-content-muted"> (optional)</span>;
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [timezone, setTimezone] = useState("");

  const canSubmit =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    preferredDate.trim() !== "" &&
    preferredTime.trim() !== "" &&
    timezone.trim() !== "";

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMinDate(toISODate(new Date()));
      setTimezone(guessTimezone());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <form action={formAction} noValidate>
      {/* Three DOM blocks, reordered per breakpoint via `order-*`:
          mobile stacks them 1/2/3 in original reading-priority order
          (fields you type into, then scheduling, then submit); md+
          repositions them into the F-pattern two column grid —
          Schedule spans both rows in column 1, the two field
          fieldsets + Submit sit in column 2. */}
      <div className="relative grid grid-cols-1 border border-white/20 md:grid-cols-2 md:items-start">
        <GridCorners />
        {/* Your Details + Project Scope */}
        <div className="order-1 space-y-14 border-b border-white/20 p-5 sm:p-7 md:order-2 md:col-start-2 md:row-start-1 md:border-b-0 md:border-l md:p-9">
          <fieldset className={FIELDSET_CLASSES}>
            <legend className="mb-8 font-mono text-xs tracking-[0.08em] text-accent uppercase">
              {"// Your Details"}
            </legend>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={LABEL_CLASSES}>
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={FIELD_CLASSES}
                />
              </div>

              <div>
                <label htmlFor="lastName" className={LABEL_CLASSES}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className={FIELD_CLASSES}
                />
              </div>

              <div>
                <label htmlFor="email" className={LABEL_CLASSES}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={FIELD_CLASSES}
                />
              </div>

              <div>
                <label htmlFor="phone" className={LABEL_CLASSES}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={FIELD_CLASSES}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="company" className={LABEL_CLASSES}>
                  Company / Organization
                  <Optional />
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className={FIELD_CLASSES}
                />
              </div>
            </div>
          </fieldset>

          <div className="border-t border-white/20" />

          <fieldset className={FIELDSET_CLASSES}>
            <legend className="mb-8 font-mono text-xs tracking-[0.08em] text-accent uppercase">
              {"// Project Scope"}
            </legend>

            <fieldset className={FIELDSET_CLASSES}>
              <legend className={LABEL_CLASSES}>
                Services You&rsquo;re Interested In
                <Optional />
              </legend>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {SERVICES.map((service) => {
                  const id = `service-${slugify(service.title)}`;
                  return (
                    <label key={service.title} htmlFor={id} className="block">
                      <input
                        id={id}
                        name="services"
                        type="checkbox"
                        value={service.title}
                        className="peer sr-only"
                      />
                      <span
                        className={`${TAG_BASE_CLASSES} ${CHIP_INACTIVE_CLASSES} block cursor-pointer peer-checked:border-accent peer-checked:bg-accent peer-checked:text-black-bg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent`}
                      >
                        {service.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-10">
              <label htmlFor="projectDetails" className={LABEL_CLASSES}>
                Project Details
                <Optional />
              </label>
              <textarea
                id="projectDetails"
                name="projectDetails"
                rows={6}
                placeholder="Tell us what you're looking to build, improve, or grow."
                className={FIELD_CLASSES}
              />
            </div>
          </fieldset>
        </div>

        {/* Schedule a call — left column anchor on desktop, spans
            both rows so it sits full-height next to the two
            fieldsets + submit button in column 2. */}
        <div className="order-2 border-b border-white/20 p-5 sm:p-7 md:order-1 md:col-start-1 md:row-span-2 md:row-start-1 md:border-b-0 md:p-9">
          <fieldset className={FIELDSET_CLASSES}>
            <legend className="mb-8 font-mono text-xs tracking-[0.08em] text-accent uppercase">
              {"// Schedule A Call"}
            </legend>

            <div className="space-y-10">
              <div>
                <label htmlFor="preferredDate" className={LABEL_CLASSES}>
                  Date
                </label>
                <DatePicker
                  id="preferredDate"
                  name="preferredDate"
                  value={preferredDate}
                  onChange={setPreferredDate}
                  min={minDate}
                  disableWeekends
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className={LABEL_CLASSES}>
                  Time
                </label>
                <TimeSlotPicker
                  id="preferredTime"
                  name="preferredTime"
                  value={preferredTime}
                  onChange={setPreferredTime}
                  options={TIME_SLOTS}
                />
              </div>

              <div>
                <label htmlFor="timezone" className={LABEL_CLASSES}>
                  Time Zone
                </label>
                <TimezonePicker
                  id="timezone"
                  name="timezone"
                  value={timezone}
                  onChange={setTimezone}
                  quickPicks={QUICK_TIMEZONES}
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Submit — stays with the fields it submits, at the foot of
            column 2 on desktop; last on mobile. */}
        <div className="order-3 p-5 sm:p-7 md:order-2 md:col-start-2 md:row-start-2 md:border-t md:border-l md:border-white/20 md:p-9">
          <button
            type="submit"
            disabled={pending || !canSubmit}
            className="flex w-full items-center justify-center bg-accent px-10 py-5 font-mono text-sm tracking-[0.08em] text-black-bg uppercase transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-content-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex sm:w-auto"
          >
            {pending ? "Sending…" : "Send Message"}
          </button>

          {!canSubmit && (
            <p className="mt-4 text-sm text-content-muted">
              Fill in your first name, last name, email, phone, and a call date,
              time, and time zone to send.
            </p>
          )}

          {state.status !== "idle" && (
            <p
              role="status"
              className={`mt-4 text-sm ${
                state.status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {state.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
