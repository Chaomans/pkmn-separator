export type DisplayableLine = {
  index: number;
  line: string;
  toSeparate: Separation[];
};

export type Separation = {
  start: number;
  text: string;
};
