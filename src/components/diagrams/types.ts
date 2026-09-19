export type TerminalLine =
  | { cmd: string }
  /** `hl` marks the single highlighted (accent) part of an output line. */
  | { out: string; hl?: string };
