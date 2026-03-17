import { Hono } from "hono";
import { cors } from "hono/cors";
import { betterAuthServer } from "./lib/auth";
const app = new Hono();

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (c) =>
  c.json({
    message: "Hello World",
  }),
);

app.on(["POST", "GET"], "/auth/*", (c) => betterAuthServer.handler(c.req.raw));

export default app;
