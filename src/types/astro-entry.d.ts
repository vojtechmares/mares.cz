declare module "*/server/entry.mjs" {
  import type { IncomingMessage, ServerResponse } from "node:http";

  export const handler: (
    req: IncomingMessage,
    res: ServerResponse,
  ) => void | Promise<void>;
}
