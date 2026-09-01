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

const initialState: ContactFormState = { status: "idle" };

/* ================================================================
   CONTACT FORM
   ================================================================
   Extends the original name/email/message form with the fields the
   business actually needs to qualify and schedule a lead: first/last
   name, phone, company, which services they're after, project
   details, and a call-scheduling cluster (date / time / timezone).
   Company, Services, and Project Details are the only genuinely
   optional fields — everything else, including the whole scheduling
   cluster, is required to send.

   LAYOUT — F-pattern two column on desktop:
   Eyes land top-left first, so the calendar (the one thing that's
   actually a visual, glanceable choice rather than typing) anchors
   the left column full-height. The right column carries every field
   a visitor types into, top to bottom — Your Details, Project Scope,
   then Submit — which is exactly the reading order the eye naturally
   drops into after the left anchor. On mobile there's only one
   column, so `order-*` restores the original top-to-bottom priority
   instead: Your Details and Project Scope first, Schedule A Call
   after, Submit last — see the grid comment below for how the two
   breakpoints get different orders from the same three DOM blocks.

   Field styling (boxed inputs, sans-serif labels, soft white-on-black
   fill) is kept identical across every field — see fieldStyles.ts for
   the shared tokens — rather than switched to the font-mono uppercase
   voice used in the marketing sections; that voice reads great as
   short decorative copy but hurts legibility on a form people
   actually have to fill out. The font-mono uppercase treatment used
   for section captions elsewhere on the site isn't used here at all —
   see the sr-only note below on why the three group captions aren't
   visible.

   Services and Time both use the same pill/chip toggle (see
   CHIP_* in fieldStyles.ts) instead of two different-looking
   controls — Services used to be plain native checkboxes in a grid,
   which read as a different, less finished control sitting right
   next to Time's pills. Services keeps real `<input type="checkbox">`
   elements under the hood (so the form still works with JS off /
   the server action still receives normal `services` values) but
   visually hides them and styles the sibling label as the pill via
   `peer-checked`.

   Group headings ("Your Details" / "Project Scope" / "Schedule A
   Call") are `sr-only` on the fieldset legends rather than removed
   outright — screen readers still get the grouping, but visually the
   form isn't broken into three captioned blocks, which was reading
   as more sections than four fields plus a chip row and a calendar
   actually warrants. The page's own "Contact" H1 (app/contact/page.tsx)
   stays the only visible heading around the form.

   RHYTHM — two spacing tiers, used consistently everywhere:
   20 (space-y-20 / gap-y-20) between major blocks — Your Details vs.
   Project Scope, and the three reordered DOM blocks on mobile — and
   10 (space-y-10 / mt-10) between individual fields inside a block.
   Before this pass those numbers drifted (16 / 9 / 8 depending on
   which block you were in), which read as uneven rather than calm.
   A thin `border-white/5` rule now sits between Your Details and
   Project Scope too — with the group legends hidden (see below),
   whitespace alone wasn't giving the eye a clear pause between the
   two, and a hairline reads as a much quieter break than bringing
   the captions back would.

   Date, time, and time zone are custom controls (DatePicker /
   TimeSlotPicker / TimezonePicker) instead of native
   input[type=date]/<select> — an always-visible calendar grid, a
   row of tappable time pills, and a searchable time zone combobox
   that isn't limited to a handful of North American zones. Time Zone
   stays a popover since it's a single value picked once and then
   mostly ignored; Date and Time stay open on the page since they're
   what a visitor is actually comparing when picking a slot.

   `minDate` and the timezone guess are both resolved client-side in
   an effect (not at render) so the server-rendered HTML and the
   first client render stay identical — computing "today" or reading
   the visitor's timezone directly during render risks a hydration
   mismatch.

   First Name, Last Name, Email, Phone, and the Date/Time/Time Zone
   scheduling cluster are the required fields, so all seven are now
   controlled inputs (Time Zone is auto-filled from the visitor's
   browser via `guessTimezone()`, so it's usually already satisfied)
   and Submit is gated on `canSubmit` — disabled until all seven are
   non-empty, with a small hint underneath explaining why. Company,
   Services, and Project Details stay uncontrolled/native since
   they're genuinely optional. The form still carries `noValidate`,
   since the server action is the real source of truth for
   validation; this is just a friendlier front-end nudge, not a
   replacement for it.
   ================================================================ */

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Optional() {
  return <span className="text-white/35 font-normal"> (optional)</span>;
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
    setMinDate(toISODate(new Date()));

    // The visitor's actual IANA zone (e.g. "Asia/Manila"), not just a
    // North-American bucket — precise, and they can still change it
    // via the searchable picker below.
    setTimezone(guessTimezone());
  }, []);

  return (
    <form action={formAction} noValidate>
      {/* Three DOM blocks, reordered per breakpoint via `order-*`:
          mobile stacks them 1/2/3 in original reading-priority order
          (fields you type into, then scheduling, then submit); md+
          repositions them into the F-pattern two column grid —
          Schedule spans both rows in column 1, the two field
          fieldsets + Submit sit in column 2. */}
      <div className="grid grid-cols-1 gap-y-20 md:grid-cols-2 md:items-start md:gap-x-16 md:gap-y-0 lg:gap-x-24">
        {/* Your Details + Project Scope */}
        <div className="order-1 space-y-20 md:order-2 md:col-start-2 md:row-start-1">
          <fieldset className={FIELDSET_CLASSES}>
            <legend className="sr-only">Your Details</legend>
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

          <div className="border-t border-white/10" />

          <fieldset className={FIELDSET_CLASSES}>
            <legend className="sr-only">Project Scope</legend>

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
                        className={`${TAG_BASE_CLASSES} ${CHIP_INACTIVE_CLASSES} block cursor-pointer peer-checked:border-purple-secondary peer-checked:bg-purple-secondary peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple-accent`}
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
        <div className="order-2 md:order-1 md:col-start-1 md:row-span-2 md:row-start-1">
          <fieldset className={FIELDSET_CLASSES}>
            <legend className="sr-only">Schedule A Call</legend>

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
        <div className="order-3 md:order-2 md:col-start-2 md:row-start-2 md:pt-20">
          <button
            type="submit"
            disabled={pending || !canSubmit}
            className="flex w-full items-center justify-center rounded-[5px] bg-purple-secondary px-10 py-5 font-mono text-sm uppercase tracking-[0.14em] text-white transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-accent sm:inline-flex sm:w-auto"
          >
            {pending ? "Sending…" : "Send Message"}
          </button>

          {!canSubmit && (
            <p className="mt-4 text-sm text-white/40">
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
