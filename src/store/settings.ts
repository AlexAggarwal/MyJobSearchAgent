import { atom } from 'jotai';

export interface Settings {
  persona?: string;
  greeting?: string;
  context?: string;
  name?: string;
}

export const settingsAtom = atom<Settings>({
  persona: "pd43ffef", // Default persona ID
  greeting: "Hey there! I'm your technical co-pilot! Let's get started building with Tavus.",
  context: "You are conducting a mock interview for a software engineering position. Be professional, encouraging, and ask relevant technical and behavioral questions.",
  name: "Candidate"
});