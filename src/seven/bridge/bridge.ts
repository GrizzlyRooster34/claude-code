import net from "net";
import { v4 as uuid } from "uuid";
import { DEFAULT_SOCKET } from "./paths";

const SOCKET = process.env.SEVEN_SOCKET || DEFAULT_SOCKET;

export function send(event: string, data: any) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(SOCKET);
    const id = uuid();
    let buf = "";
    socket.on("connect", () => socket.write(JSON.stringify({ id, event, data }) + "\n"));
    socket.on("data", d => buf += d.toString());
    socket.on("end", () => { try { resolve(JSON.parse(buf)); } catch { resolve({ raw: buf }); } });
    socket.on("error", reject);
  });
}
