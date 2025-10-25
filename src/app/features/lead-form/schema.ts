'use client';

import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js/min';

export const freeEmailDomains = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'msn.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'yandex.com'
];

const phoneRefinement = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    if (isValidPhoneNumber(trimmed)) {
      return true;
    }
  } catch (error) {
    // ignore and fallback to basic validation
  }

  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7;
};

export const formSchema = z
  .object({
    language: z.string().min(2).max(5),
    personal: z.object({
      firstName: z
        .string()
        .nonempty({ message: 'validation.required' }),
      lastName: z
        .string()
        .nonempty({ message: 'validation.required' }),
      email: z
        .string()
        .nonempty({ message: 'validation.required' })
        .email({ message: 'validation.email' })
    }),
    contact: z.object({
      phone: z
        .string()
        .nonempty({ message: 'validation.required' })
        .refine(phoneRefinement, { message: 'validation.phone' }),
      role: z
        .string()
        .nonempty({ message: 'validation.required' }),
      organization: z
        .string()
        .nonempty({ message: 'validation.required' }),
      country: z.string().min(2).max(5)
    }),
    interests: z
      .object({
        areas: z.array(z.string()).min(1, { message: 'validation.interests' }),
        other: z.string().optional(),
        levels: z.array(z.string()).min(1, { message: 'validation.level' })
      })
      .superRefine((value, ctx) => {
        if (value.areas.includes('other') && !value.other?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'validation.interestOther',
            path: ['other']
          });
        }
      })
  })
  .refine((data) => data.language, {
    message: 'validation.required',
    path: ['language']
  });

export type FormSchema = typeof formSchema;
export type FormValues = z.infer<typeof formSchema>;

export type FormStepId = 'personal' | 'contact' | 'interests' | 'review';

export type FormStepField =
  | 'personal.firstName'
  | 'personal.lastName'
  | 'personal.email'
  | 'contact.phone'
  | 'contact.role'
  | 'contact.organization'
  | 'contact.country'
  | 'interests.areas'
  | 'interests.other'
  | 'interests.levels'
  | 'language';

export interface FormStepConfig {
  id: FormStepId;
  translationKey: string;
  fields: FormStepField[];
}

export const FORM_STEPS: FormStepConfig[] = [
  {
    id: 'personal',
    translationKey: 'steps.personal',
    fields: [
      'personal.firstName',
      'personal.lastName',
      'personal.email'
    ]
  },
  {
    id: 'contact',
    translationKey: 'steps.contact',
    fields: [
      'contact.phone',
      'contact.role',
      'contact.organization',
      'contact.country'
    ]
  },
  {
    id: 'interests',
    translationKey: 'steps.interests',
    fields: ['interests.areas', 'interests.other', 'interests.levels']
  },
  {
    id: 'review',
    translationKey: 'steps.review',
    fields: []
  }
];
