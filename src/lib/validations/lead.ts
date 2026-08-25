import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  company: z.string().optional(),
  phone: z.string().min(8, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  website: z.string().optional(),
  industry: z.string().optional(),
  serviceRequired: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  preferredContact: z.string().optional(),
  // honeypot — must stay empty
  companyWebsiteUrl: z.string().max(0).optional().or(z.literal("")),
});
