// Shared, framework-agnostic constants for the study-material lead form.
// Kept out of the "use server" action file so client components can import them.
export const QUALIFICATIONS = [
  "SEE / School",
  "+2 / A-Levels",
  "Bachelor's",
  "Master's",
  "Other",
] as const;

export type Qualification = (typeof QUALIFICATIONS)[number];
