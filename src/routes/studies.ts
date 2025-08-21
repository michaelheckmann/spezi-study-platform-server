import { getDevDatabase } from "../database";
import { authMiddleware } from "../utils/auth-middleware";
import { createHonoApp } from "../utils/create-hono-app";
import { respondWithError } from "../utils/error";

const router = createHonoApp();

router.use(authMiddleware);

router.get("/studies", async c => {
    const query = c.req.query();

    const db = await getDevDatabase(c.env);

    let selectedStudies = db.studies;
    if (query.team_id) {
        selectedStudies = selectedStudies.filter(study => study.teamId === query.team_id);
    }

    return c.json(selectedStudies, 200);
});

router.get("/studies/:id", async c => {
    const { id } = c.req.param();

    const db = await getDevDatabase(c.env);

    const study = db.studies.find(study => study.id === id);
    if (!study) {
        return respondWithError(c, 404, {
            message: `Study with id ${id} not found. Make sure it exists and you have access to it.`,
        });
    }

    return c.json(study, 200);
});

export default router;
