import { getDevDatabase } from "../database";
import { authMiddleware } from "../utils/auth-middleware";
import { createHonoApp } from "../utils/create-hono-app";
import { respondWithError } from "../utils/error";

export const router = createHonoApp();

router.use(authMiddleware);

router.get("/teams", async c => {
    const db = await getDevDatabase(c.env);
    return c.json(db.teams, 200);
});

router.get("/teams/:id", async c => {
    const { id } = c.req.param();

    const db = await getDevDatabase(c.env);

    const team = db.teams.find(team => team.id === id);
    if (!team) {
        return respondWithError(c, 404, {
            message: `Team with id ${id} not found. Make sure it exists and you have access to it.`,
        });
    }

    return c.json(team, 200);
});

export default router;
