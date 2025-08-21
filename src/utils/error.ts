//
// This source file is part of the Stanford Biodesign Digital Health Spezi Web Study Platform open-source project
//
// SPDX-FileCopyrightText: 2025 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";

export interface ErrorPayload {
    code?: string;
    message: string;
}

/**
 * Creates a Zod schema for an error payload, including OpenAPI metadata.
 *
 * The schema always includes a `message` property, and optionally a `code` property
 * if the provided example payload contains one.
 *
 * @example
 * const errorSchema = createErrorSchema({
 *   code: "not_found",
 *   message: "Resource not found",
 * });
 */
export const createErrorSchema = (examplePayload: ErrorPayload) => {
    const messageSchema = z.string();

    if (examplePayload.code) {
        return z.object({
            code: z.string().optional(),
            message: messageSchema,
        });
    }

    return z.object({ message: messageSchema });
};

export const error404Schema = createErrorSchema({
    message: "Resource not found",
});

/**
 * Sends a JSON error response with the specified HTTP status code and payload.
 *
 * @example
 * respondWithError(c, 404, {
 *   code: "not_found",
 *   message: "Resource not found",
 * });
 */
export const respondWithError = <T extends ContentfulStatusCode>(c: Context, status: T, payload: ErrorPayload) => {
    return c.json(payload, status);
};
