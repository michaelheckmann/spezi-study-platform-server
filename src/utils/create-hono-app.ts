import { Hono } from "hono";
import { createAuth } from "../auth";

export type Variables = {
    auth: ReturnType<typeof createAuth>;
};

export const createHonoApp = () => {
    return new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();
};
