import { z } from "zod";
import { studyFixtures } from "./entities/study/fixtures";
import { studySchema } from "./entities/study/schema";
import { teamFixtures } from "./entities/team/fixtures";
import { teamSchema } from "./entities/team/schema";
import { userFixtures } from "./entities/user/fixtures";
import { userSchema } from "./entities/user/schema";

const devDatabaseSchema = z.object({
    studies: studySchema.array(),
    teams: teamSchema.array(),
    users: userSchema.array(),
});

type DevDatabase = z.infer<typeof devDatabaseSchema>;

// Fixtures with different scenarios for seeding the development database
const devDatabaseFixtures: Record<string, DevDatabase> = {
    default: {
        studies: studyFixtures,
        teams: teamFixtures,
        users: userFixtures,
    },
    empty: {
        studies: [],
        teams: [],
        users: userFixtures,
    },
};

// Current development database, change this to test different scenarios
const initialDevDatabase: DevDatabase = devDatabaseFixtures.default;

/**
 * Retrieves the development database from the file system.
 *
 * If the database file exists and its contents are valid according to the schema,
 * returns the parsed database. If the file exists but is invalid, resets the file
 * to the default development database and returns it. If the file does not exist, creates
 * it with the default development database and returns it.
 */
export const getDevDatabase = async (env: CloudflareBindings): Promise<DevDatabase> => {
    const db = await env.KV.get("database");
    if (db) {
        const parsed = devDatabaseSchema.safeParse(JSON.parse(db));
        if (parsed.success) {
            return parsed.data;
        }
        // If the format is invalid, reset to the default development database
        await env.KV.put("database", JSON.stringify(initialDevDatabase));
        return initialDevDatabase;
    }

    await env.KV.put("database", JSON.stringify(initialDevDatabase));
    return initialDevDatabase;
};

/**
 * Updates the development database with the provided partial data.
 * This function only allows a shallow merge with the existing database.
 */
export const setDevDatabase = async (env: CloudflareBindings, data: Partial<DevDatabase>) => {
    const currentDatabase = await getDevDatabase(env);
    const newDatabase = { ...currentDatabase, ...data };
    const parsed = devDatabaseSchema.safeParse(newDatabase);
    if (parsed.success) {
        await env.KV.put("database", JSON.stringify(parsed.data));
    } else {
        throw new Error("Invalid database schema");
    }
};
