// Enterprise validation utilities
import { z } from "zod";

export const policyValidationSchema = z.object({
  policyNumber: z.string().min(5, "Policy number must be at least 5 characters"),
  insurerName: z.string().min(2, "Insurer name is required"),
  policyType: z.enum(["health", "auto", "home", "life", "travel"], {
    errorMap: () => ({ message: "Select a valid policy type" }),
  }),
  coverageAmount: z.number().positive("Coverage amount must be positive"),
  expiryDate: z.string().refine(
    (date) => new Date(date) > new Date(),
    "Expiry date must be in the future"
  ),
  premium: z.number().positive("Premium must be positive").optional(),
  status: z.enum(["active", "expired", "cancelled"]).optional(),
});

export const appointmentValidationSchema = z.object({
  title: z.string().min(3, "Appointment title is required"),
  date: z.string().refine(
    (date) => new Date(date) > new Date(),
    "Appointment date must be in the future"
  ),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  provider: z.string().min(2, "Provider name is required"),
  type: z.enum(["checkup", "followup", "consultation", "procedure"]).optional(),
  notes: z.string().max(500, "Notes must not exceed 500 characters").optional(),
});

export const documentValidationSchema = z.object({
  name: z.string().min(2, "Document name is required"),
  type: z.enum(["policy", "invoice", "claim", "receipt", "other"]),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "File must be under 10MB")
    .refine(
      (file) => ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
      "File must be PDF or image"
    )
    .optional(),
  uploadDate: z.string().optional(),
});

export const claimValidationSchema = z.object({
  claimNumber: z.string().min(5, "Claim number must be at least 5 characters"),
  policyId: z.string().min(1, "Policy selection is required"),
  claimType: z.enum(["medical", "accident", "property", "other"]),
  claimAmount: z.number().positive("Claim amount must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string(),
  status: z.enum(["submitted", "processing", "approved", "rejected"]).optional(),
});

export type PolicyFormData = z.infer<typeof policyValidationSchema>;
export type AppointmentFormData = z.infer<typeof appointmentValidationSchema>;
export type DocumentFormData = z.infer<typeof documentValidationSchema>;
export type ClaimFormData = z.infer<typeof claimValidationSchema>;

export function getValidationErrorMessage(error: z.ZodError): string {
  const errors = error.flatten().fieldErrors;
  const firstError = Object.values(errors)[0];
  return firstError?.[0] || "Validation failed";
}
