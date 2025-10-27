import { spawn } from "child_process";
import net from "net";

test("daemon starts and answers heartbeat", async () => {
  const proc = spawn("bun", ["run", "src/seven/bridge/bridge-daemon.ts"]);
  await new Promise(res => setTimeout(res, 500)); // boot
  const socket = net.createConnection(process.env.SEVEN_SOCKET || "/tmp/seven_bridge.sock");
  const resp = await new Promise(resolve => {
    let buf = "";
    socket.on("connect", () => socket.write(JSON.stringify({ event: "heartbeat" })+"\n"));
    socket.on("data", d => { buf += d.toString(); resolve(buf); });
  });
  proc.kill();
  expect(resp).toContain("ok");
});

