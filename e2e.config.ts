import type { E2EConfig } from "e2e";
import { web } from "@e2e-dev/web";

export default {
  targets: [
    {
      engine: web(),
      app: {
        url: "http://127.0.0.1:3000",
        command: {
          executable: "pnpm",
          env: { TZ: "Pacific/Kiritimati" },
          args: ["start", "--hostname", "127.0.0.1"],
          log: ".e2e/logs/app.log",
        },
      },
    },
  ],
  workers: 1,
  retries: 0,
} satisfies E2EConfig;
