import * as sevenBridge from "../seven/bridge/bridge";
import { sevenLocalTool } from "./seven.local";

declare function registerTool(name: string, tool: any): void;

registerTool("seven.route", {
  description: "Direct task routing through SevenBridge",
  async run(args: any) {
    return await sevenBridge.send("routeTask", args);
  }
});

registerTool("seven.handoff", {
  description: "Real-time handoff request",
  async run(args: any) {
    return await sevenBridge.send("handoff.request", args);
  }
});

registerTool(sevenLocalTool.name, sevenLocalTool);
