import { send } from "../../seven/bridge/bridge";
const prompt = process.argv.slice(2).join(" ") || "hello";
const res = await send("routeTask", { prompt });
console.log(JSON.stringify(res, null, 2));
