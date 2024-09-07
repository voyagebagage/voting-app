// scripts/dev-with-tunnel.js
import { spawn } from "child_process";
import localtunnel from "localtunnel";

// Start Next.js development server
const nextDev = spawn("npm", ["run", "dev"], { stdio: "inherit" });

// Start LocalTunnel
(async () => {
  const tunnel = await localtunnel({ port: 3000 });
  console.log(`LocalTunnel URL: ${tunnel.url}`);

  tunnel.on("close", () => {
    console.log("LocalTunnel closed");
    nextDev.kill();
    process.exit();
  });
})();

// Handle script termination
process.on("SIGINT", () => {
  nextDev.kill();
  process.exit();
});
