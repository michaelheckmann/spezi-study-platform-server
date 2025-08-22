import { cors } from "hono/cors";
import { createAuth } from "./auth";
import studiesRouter from "./routes/studies";
import teamsRouter from "./routes/teams";
import usersRouter from "./routes/users";
import { createHonoApp } from "./utils/create-hono-app";

const app = createHonoApp();

// CORS configuration for auth routes
app.use(
    "/api/*",
    cors({
        origin: ["http://localhost:3000", "https://spezi.health"],
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    })
);

// Middleware to initialize auth instance for each request
app.use("*", async (c, next) => {
    const auth = createAuth(c.env, (c.req.raw as any).cf || {});
    c.set("auth", auth);
    await next();
});

// Handle all auth routes
app.all("/api/auth/*", async c => {
    const auth = c.get("auth");
    return auth.handler(c.req.raw);
});

app.route("/api", studiesRouter);
app.route("/api", teamsRouter);
app.route("/api", usersRouter);

app.get("/health", c => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
