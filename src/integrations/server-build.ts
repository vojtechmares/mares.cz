import type { AstroIntegration } from "astro";
import { join } from "node:path";

export function serverBuild(): AstroIntegration {
  return {
    name: "server-build",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const { build } = await import("esbuild");
        const outdir = join(dir.pathname, "..", "server-build");

        logger.info("Bundling custom server…");

        await build({
          entryPoints: [join(dir.pathname, "..", "..", "src", "server.ts")],
          outfile: join(outdir, "server.js"),
          bundle: true,
          platform: "node",
          format: "esm",
          target: "node22",
          external: ["../server/entry.mjs"],
          banner: {
            js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
          },
        });

        logger.info(`Server bundle written to ${outdir}/server.js`);
      },
    },
  };
}
