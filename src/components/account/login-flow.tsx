"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Loader2,
  LogIn,
  ShieldCheck,
  ShoppingBasket,
  Store,
  Tractor,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Audience = "customer" | "business";
type Step = "audience" | "business" | "google" | "details" | "done";

const STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const COPY: Record<Step, { title: string; description: string }> = {
  audience: {
    title: "Login to Belpatri",
    description: "Tell us how you want to use the marketplace.",
  },
  business: {
    title: "What kind of business?",
    description: "Choose vendor, farmer, or both if you trade and grow.",
  },
  google: {
    title: "Verify with Google",
    description: "One tap to confirm your email address.",
  },
  details: {
    title: "Almost there",
    description: "A few details for your account and delivery.",
  },
  done: {
    title: "You are all set",
    description: "Your Belpatri profile is ready for this prototype.",
  },
};

export function LoginFlow({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("audience");
  const [audience, setAudience] = useState<Audience | null>(null);
  const [roles, setRoles] = useState({ vendor: false, farmer: false });
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setStep("audience");
    setAudience(null);
    setRoles({ vendor: false, farmer: false });
    setEmail("");
    setPending(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function pickAudience(next: Audience) {
    setAudience(next);
    setStep(next === "business" ? "business" : "google");
  }

  function connectGoogle() {
    setPending(true);
    timer.current = setTimeout(() => {
      setEmail("rahul.verma@gmail.com");
      setPending(false);
      setStep("details");
    }, 700);
  }

  const flow: Step[] =
    audience === "business"
      ? ["audience", "business", "google", "details"]
      : ["audience", "google", "details"];
  const position = flow.indexOf(step) + 1;
  const total = flow.length;

  return (
    <>
      <Button
        className={cn("h-9 rounded-xl text-xs font-bold shadow-xs", className)}
        onClick={() => setOpen(true)}
      >
        <LogIn className="size-4" />
        Login
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
          <div className="border-b border-slate-100 bg-gradient-to-br from-green-50 via-white to-white px-5 pt-5 pb-4 sm:px-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2.5 text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white shadow-xs">
                  {step === "done" ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <ShieldCheck className="size-4" />
                  )}
                </span>
                {step === "details" && audience === "customer"
                  ? "Your details"
                  : step === "details"
                    ? "Business details"
                    : COPY[step].title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {COPY[step].description}
              </DialogDescription>
            </DialogHeader>

            {step !== "done" ? (
              <div className="mt-4 space-y-1.5">
                <div className="h-1 overflow-hidden rounded-full bg-green-100">
                  <div
                    className="h-full rounded-full bg-green-700 transition-all duration-300"
                    style={{ width: `${(position / total) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-green-800 uppercase">
                  Step {position} of {total}
                  <span className="ml-2 font-medium tracking-normal text-slate-400 normal-case">
                    {audienceLabel(audience)}
                  </span>
                </p>
              </div>
            ) : null}
          </div>

          <div className="px-5 py-5 sm:px-6">
            {step === "audience" ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ChoiceCard
                    icon={UserRound}
                    title="Customer"
                    description="I am buying produce for home, kitchen or retail."
                    points={["Escrow protected checkout", "Home and shop delivery"]}
                    onClick={() => pickAudience("customer")}
                  />
                  <ChoiceCard
                    icon={Building2}
                    title="Business"
                    description="I am a vendor or a farmer listing produce to sell."
                    points={["Vendor storefront", "Farm-gate listings"]}
                    onClick={() => pickAudience("business")}
                  />
                </div>
                <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
                  <ShieldCheck className="mt-px size-3.5 shrink-0 text-green-700" />
                  Google is used only to verify your email. We never post on your
                  behalf.
                </p>
              </div>
            ) : null}

            {step === "business" ? (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  <RoleCard
                    icon={Store}
                    title="Vendor"
                    description="Trader, co-operative or shop listing lots from a licensed yard."
                    checked={roles.vendor}
                    onChange={() =>
                      setRoles((current) => ({ ...current, vendor: !current.vendor }))
                    }
                  />
                  <RoleCard
                    icon={Tractor}
                    title="Farmer"
                    description="Grower selling directly from the farm gate."
                    checked={roles.farmer}
                    onChange={() =>
                      setRoles((current) => ({ ...current, farmer: !current.farmer }))
                    }
                  />
                </div>

                <p className="text-[11px] text-slate-500">
                  You can select both if you farm your own produce and also trade
                  other lots.
                </p>

                <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                  <Button
                    variant="ghost"
                    className="h-9 rounded-xl text-xs font-semibold text-slate-600"
                    onClick={() => setStep("audience")}
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </Button>
                  <Button
                    className="h-9 rounded-xl text-xs font-bold"
                    disabled={!roles.vendor && !roles.farmer}
                    onClick={() => setStep("google")}
                  >
                    Continue
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : null}

            {step === "google" ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag>
                    {audience === "customer" ? (
                      <UserRound className="size-3" />
                    ) : (
                      <Building2 className="size-3" />
                    )}
                    {audience === "customer" ? "Customer account" : "Business account"}
                  </Tag>
                  {roles.vendor ? (
                    <Tag>
                      <Store className="size-3" />
                      Vendor
                    </Tag>
                  ) : null}
                  {roles.farmer ? (
                    <Tag>
                      <Tractor className="size-3" />
                      Farmer
                    </Tag>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
                  <GoogleGlyph className="mx-auto size-9" />
                  <p className="mt-3 text-sm font-bold text-slate-900">
                    Continue with Google
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                    We read your name and email so you do not have to type them
                    again. Nothing is posted to your Google account.
                  </p>
                  <button
                    type="button"
                    onClick={connectGoogle}
                    disabled={pending}
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 shadow-2xs transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70"
                  >
                    {pending ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-green-700" />
                        Connecting to Google…
                      </>
                    ) : (
                      <>
                        <GoogleGlyph className="size-4" />
                        Continue with Google
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-[10px] text-slate-400">
                    Prototype only — no real Google sign-in happens.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    className="h-9 rounded-xl text-xs font-semibold text-slate-600"
                    onClick={() =>
                      setStep(audience === "business" ? "business" : "audience")
                    }
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </Button>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <ShieldCheck className="size-3.5 text-green-700" />
                    Escrow protected
                  </span>
                </div>
              </div>
            ) : null}

            {step === "details" ? (
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  setStep("done");
                }}
              >
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50/70 px-3 py-2">
                  <GoogleGlyph className="size-4 shrink-0" />
                  <span className="truncate text-[11px] font-semibold text-green-900">
                    Verified with Google
                  </span>
                  <span className="ml-auto truncate font-mono text-[11px] text-green-800/80">
                    {email}
                  </span>
                </div>

                <Section title={audience === "customer" ? "Your details" : "Business details"}>
                  {audience === "customer" ? (
                    <>
                      <Field label="Full name" htmlFor="login-name">
                        <Input
                          id="login-name"
                          required
                          defaultValue="Rahul Verma"
                          className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                        />
                      </Field>
                      <Field label="Email" htmlFor="login-email">
                        <Input
                          id="login-email"
                          type="email"
                          required
                          defaultValue={email}
                          className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                        />
                      </Field>
                      <Field label="Mobile number" htmlFor="login-phone">
                        <Input
                          id="login-phone"
                          type="tel"
                          required
                          placeholder="+91 98220 44581"
                          className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                        />
                      </Field>
                      <Field label="Delivery preference" htmlFor="login-pref">
                        <Select defaultValue="Home delivery">
                          <SelectTrigger
                            id="login-pref"
                            className="h-10 w-full justify-between rounded-lg border-slate-200 bg-white px-3 text-sm text-slate-800"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home delivery">Home delivery</SelectItem>
                            <SelectItem value="Shop / office">Shop / office</SelectItem>
                            <SelectItem value="Farm-gate pickup">Farm-gate pickup</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </>
                  ) : (
                    <>
                      <Field label="Business name" htmlFor="login-business">
                        <Input
                          id="login-business"
                          required
                          placeholder="Kisan Commercial Trade Pvt Ltd"
                          className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                        />
                      </Field>
                      <Field label="Contact person" htmlFor="login-contact">
                        <Input
                          id="login-contact"
                          required
                          defaultValue="Rahul Verma"
                          className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                        />
                      </Field>
                      <Field label="Work email" htmlFor="login-work-email">
                        <Input
                          id="login-work-email"
                          type="email"
                          required
                          defaultValue={email}
                          className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                        />
                      </Field>
                      <Field label="Mobile number" htmlFor="login-business-phone">
                        <Input
                          id="login-business-phone"
                          type="tel"
                          required
                          placeholder="+91 98220 44581"
                          className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                        />
                      </Field>
                      <Field label="GSTIN" htmlFor="login-gstin" optional>
                        <Input
                          id="login-gstin"
                          placeholder="27AABCK8912M1Z0"
                          className="h-10 rounded-lg border-slate-200 bg-white px-3 font-mono text-sm"
                        />
                      </Field>
                    </>
                  )}
                </Section>

                {audience === "business" && roles.vendor ? (
                  <Section title="Vendor details">
                    <Field label="Storefront name" htmlFor="login-store">
                      <Input
                        id="login-store"
                        required
                        placeholder="Sahyadri Spices Hub"
                        className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                      />
                    </Field>
                    <Field label="APMC licence number" htmlFor="login-licence" optional>
                      <Input
                        id="login-licence"
                        placeholder="APMC-LIC-4412B"
                        className="h-10 rounded-lg border-slate-200 bg-white px-3 font-mono text-sm"
                      />
                    </Field>
                  </Section>
                ) : null}

                {audience === "business" && roles.farmer ? (
                  <Section title="Farmer details">
                    <Field label="Farm name" htmlFor="login-farm">
                      <Input
                        id="login-farm"
                        required
                        placeholder="Patel Farm, Sehore"
                        className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                      />
                    </Field>
                    <Field label="Village / taluka" htmlFor="login-village" optional>
                      <Input
                        id="login-village"
                        placeholder="Dindori, Nashik"
                        className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                      />
                    </Field>
                  </Section>
                ) : null}

                <Section
                  title={audience === "customer" ? "Delivery details" : "Dispatch address"}
                >
                  <Field label="Address line" htmlFor="login-address" className="sm:col-span-2">
                    <Input
                      id="login-address"
                      required
                      placeholder="Flat / shop no., building, street"
                      className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                    />
                  </Field>
                  <Field label="Landmark" htmlFor="login-landmark" optional>
                    <Input
                      id="login-landmark"
                      placeholder="Near Nashik APMC gate"
                      className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                    />
                  </Field>
                  <Field label="City" htmlFor="login-city">
                    <Input
                      id="login-city"
                      required
                      defaultValue="Nashik"
                      className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm"
                    />
                  </Field>
                  <Field label="State" htmlFor="login-state">
                    <Select defaultValue="Maharashtra">
                      <SelectTrigger
                        id="login-state"
                        className="h-10 w-full justify-between rounded-lg border-slate-200 bg-white px-3 text-sm text-slate-800"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="PIN code" htmlFor="login-pin">
                    <Input
                      id="login-pin"
                      inputMode="numeric"
                      required
                      placeholder="422003"
                      className="h-10 rounded-lg border-slate-200 bg-white px-3 font-mono text-sm"
                    />
                  </Field>
                </Section>

                <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-[11px] leading-relaxed text-slate-600">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 size-4 shrink-0 accent-green-700"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="font-semibold text-green-800 underline underline-offset-2">
                      Terms of Trade
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-green-800 underline underline-offset-2">
                      Escrow Policy
                    </span>
                    .
                  </span>
                </label>

                <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 rounded-xl text-xs font-semibold text-slate-600"
                    onClick={() => setStep("google")}
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </Button>
                  <Button type="submit" className="h-9 rounded-xl text-xs font-bold">
                    Create account
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </form>
            ) : null}

            {step === "done" ? (
              <div className="space-y-5 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 text-green-800">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Welcome to Belpatri
                  </h3>
                  <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-500">
                    {audience === "customer"
                      ? "Your customer account and delivery address are saved. Start browsing verified lots."
                      : "Your business account is created. Add your listings and start receiving trade enquiries."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Tag>
                    {audience === "customer" ? (
                      <UserRound className="size-3" />
                    ) : (
                      <Building2 className="size-3" />
                    )}
                    {audience === "customer" ? "Customer" : "Business"}
                  </Tag>
                  {roles.vendor ? (
                    <Tag>
                      <Store className="size-3" />
                      Vendor
                    </Tag>
                  ) : null}
                  {roles.farmer ? (
                    <Tag>
                      <Tractor className="size-3" />
                      Farmer
                    </Tag>
                  ) : null}
                  <Tag>
                    <BadgeCheck className="size-3" />
                    Google verified
                  </Tag>
                </div>

                <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-center">
                  <Button
                    className="h-10 rounded-xl px-5 text-xs font-bold"
                    render={<Link href="/" />}
                    onClick={() => handleOpenChange(false)}
                  >
                    <ShoppingBasket className="size-4" />
                    Start browsing lots
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 px-5 text-xs font-semibold text-slate-700"
                    onClick={() => handleOpenChange(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function audienceLabel(audience: Audience | null) {
  if (audience === "customer") return "Customer";
  if (audience === "business") return "Business";
  return "";
}

function ChoiceCard({
  icon: Icon,
  title,
  description,
  points,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:border-green-600 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:outline-none"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-green-700 transition group-hover:bg-green-700 group-hover:text-white">
        <Icon className="size-5" />
      </span>
      <span className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
        {title}
        <ArrowRight className="size-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-green-700" />
      </span>
      <span className="text-[11px] leading-relaxed text-slate-500">{description}</span>
      <span className="mt-1 flex flex-col gap-1 border-t border-slate-100 pt-2">
        {points.map((point) => (
          <span key={point} className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Check className="size-3 text-green-700" />
            {point}
          </span>
        ))}
      </span>
    </button>
  );
}

function RoleCard({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:outline-none",
        checked
          ? "border-green-600 bg-green-50/70 shadow-xs"
          : "border-slate-200 bg-white hover:border-green-400",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition",
          checked
            ? "border-green-700 bg-green-700 text-white"
            : "border-slate-300 bg-white text-transparent",
        )}
      >
        <Check className="size-3" />
      </span>
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          checked ? "text-green-700" : "text-slate-400",
        )}
      />
      <span>
        <span className="block text-xs font-extrabold text-slate-900">{title}</span>
        <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
          {description}
        </span>
      </span>
    </button>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-800">
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
        {title}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-[11px] font-semibold text-slate-600"
      >
        {label}
        {optional ? (
          <span className="font-medium text-slate-400">(optional)</span>
        ) : (
          <span className="text-red-500">*</span>
        )}
      </Label>
      {children}
    </div>
  );
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
