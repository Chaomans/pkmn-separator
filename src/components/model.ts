import { version } from "os";

export type DisplayableLine = {
  index: number;
  line: string;
  toSeparate: Separation[];
};

export type Separation = {
  start: number;
  end: number;
  text: string;
  id: string;
};

export type Version = "FR" | "JAP";
export type VersionIndex = { FR: number; JAP: number };
