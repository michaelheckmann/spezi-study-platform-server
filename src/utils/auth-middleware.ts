import { createMiddleware } from "hono/factory";
import { Variables } from "./create-hono-app";
import { respondWithError } from "./error";

export const authMiddleware = createMiddleware<{ Variables: Variables }>(async (c, next) => {
    const auth = c.get("auth");
    try {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers,
        });
        if (session?.session && session.user) {
            await next();
            return;
        }
    } catch (error) {
        return respondWithError(c, 401, {
            message: "Unauthorized access. Please log in.",
        });
    }

    return respondWithError(c, 401, {
        message: "Unauthorized access. Please log in.",
    });
});
