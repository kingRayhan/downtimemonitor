import { Hono } from "hono";
import { cors } from "hono/cors";
import { betterAuthServer } from "./lib/auth";
import { APP_ENV } from "./lib/env";

const app = new Hono();

const corsMiddleware = cors({
  origin: APP_ENV.AUTH_CLIENT_URLS.split(","),
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
});

app.use(corsMiddleware);

app.get("/", (c) =>
  c.json({
    message: "Hello World",
  }),
);

app.on(["POST", "GET"], "/auth/**", (c) => {
  return betterAuthServer.handler(c.req.raw);
});

export default app;
