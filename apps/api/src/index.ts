import { Hono } from "hono";
import { cors } from "hono/cors";
import { betterAuthServer } from "./lib/auth";
const app = new Hono();

app.use(cors());

app.get("/", (c) =>
  c.json({
    message: "Hello World",
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) =>
  betterAuthServer.handler(c.req.raw),
);

export default app;
