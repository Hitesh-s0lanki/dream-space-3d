"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const SERVICES = [
  "Residential Interiors",
  "Commercial Spaces",
  "3D Visualization",
  "Design Consultation",
  "Full-Home Design",
  "Not sure yet",
];

const BUDGETS = [
  "Under ₹5 Lakhs",
  "₹5 – ₹15 Lakhs",
  "₹15 – ₹30 Lakhs",
  "₹30 – ₹50 Lakhs",
  "₹50 Lakhs+",
  "Prefer not to say",
];

export function ContactForm() {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success"
  >("idle");

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = "Please enter your name.";
    if (!formData.email.trim()) {
      e.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) e.message = "Please tell us about your project.";
    return e;
  }

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    // Simulate API call — replace with actual form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-sage/20">
          <CheckCircle2 className="size-8 text-sage" />
        </div>
        <h3 className="text-2xl font-medium tracking-tight">
          Thank you, {formData.name.split(" ")[0]}!
        </h3>
        <p className="mt-3 max-w-sm text-pretty text-muted-foreground">
          We&apos;ve received your message and will get back to you within 24
          hours. Looking forward to exploring your space together.
        </p>
        <Button
          variant="outline"
          className="mt-8 rounded-full"
          onClick={() => {
            setStatus("idle");
            setFormData({
              name: "",
              email: "",
              phone: "",
              service: "",
              budget: "",
              message: "",
            });
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name + Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full Name"
          required
          error={errors.name}
          htmlFor="contact-name"
        >
          <Input
            id="contact-name"
            placeholder="Jane Doe"
            autoComplete="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="h-11 rounded-xl"
          />
        </Field>
        <Field
          label="Email"
          required
          error={errors.email}
          htmlFor="contact-email"
        >
          <Input
            id="contact-email"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="h-11 rounded-xl"
          />
        </Field>
      </div>

      {/* Phone */}
      <Field label="Phone" htmlFor="contact-phone">
        <Input
          id="contact-phone"
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="h-11 rounded-xl"
        />
      </Field>

      {/* Service + Budget */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Service Interested In" htmlFor="contact-service">
          <Select
            value={formData.service}
            onValueChange={(v) => handleChange("service", v)}
          >
            <SelectTrigger
              id="contact-service"
              className="h-11 w-full rounded-xl"
            >
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Estimated Budget" htmlFor="contact-budget">
          <Select
            value={formData.budget}
            onValueChange={(v) => handleChange("budget", v)}
          >
            <SelectTrigger
              id="contact-budget"
              className="h-11 w-full rounded-xl"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGETS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* Message */}
      <Field
        label="Tell us about your project"
        required
        error={errors.message}
        htmlFor="contact-message"
      >
        <Textarea
          id="contact-message"
          placeholder="What space are you looking to transform? Any style preferences, timelines, or inspirations you'd like to share..."
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="min-h-32 rounded-xl"
        />
      </Field>

      {/* Submit */}
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="group relative h-12 w-full overflow-hidden rounded-full text-sm font-medium sm:w-auto sm:px-8"
      >
        <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-400 ease-out group-hover:translate-y-0" />
        {status === "submitting" ? (
          <span className="relative z-10 flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </span>
        ) : (
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-accent-foreground">
            Send Message
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        We typically respond within 24 hours. For urgent inquiries, call us
        directly.
      </p>
    </form>
  );
}

/* Small helper that wraps Label + child + error in a consistent layout */
function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
