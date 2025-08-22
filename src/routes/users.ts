import { getDevDatabase } from "../database";
import { authMiddleware } from "../utils/auth-middleware";
import { createHonoApp } from "../utils/create-hono-app";
import { respondWithError } from "../utils/error";

export const router = createHonoApp();

router.use(authMiddleware);

router.get("/users/:id", async c => {
    const { id } = c.req.param();
    const auth = c.get("auth");

    const db = await getDevDatabase(c.env);

    if (id === "me") {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers,
        });
        const email = session?.user.email;
        if (!email) {
            return respondWithError(c, 401, {
                message: "Unauthorized access. Please log in.",
            });
        }
        const user = db.users.find(user => user.email === email);
        if (!user) {
            return respondWithError(c, 404, {
                message: "User not found.",
            });
        }
        return c.json(user, 200);
    }

    const user = db.users.find(user => user.id === id);
    if (!user) {
        return respondWithError(c, 404, {
            message: "User not found.",
        });
    }
    return c.json(user, 200);
});

export default router;
