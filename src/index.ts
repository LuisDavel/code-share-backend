import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { generateShortId } from "./utils/id";
import {
    getAllPastes,
    getPasteById,
    insertPaste,
    updatePasteById,
    deletePasteById,
    type Paste,
} from "./db/db";

const app = new Elysia()
    .use(cors())

    // Handler global de erros
    .onError(({ code, error, set }) => {
        console.error(`[${code}]`, error);

        if (code === "VALIDATION") {
            set.status = 422;
            return {
                error: "Dados inválidos.",
                details: error.message,
            };
        }

        if (code === "NOT_FOUND") {
            set.status = 404;
            return { error: "Rota não encontrada." };
        }

        set.status = 500;
        return {
            error: "Erro interno no servidor.",
            details: error instanceof Error ? error.message : String(error),
        };
    })

    .get("/", () => "API do Pastebin está rodando 🚀")

    // Create (Criar texto/código)
    .post("/pastes", async ({ body, set }) => {
        const id = generateShortId(8);
        const result = await insertPaste(id, body.content, body.language || "text");
        set.status = 201;
        return result;
    }, {
        body: t.Object({
            content: t.String({ minLength: 1 }),
            language: t.Optional(t.String()),
        }),
    })

    // Read All
    .get("/pastes", async () => {
        return await getAllPastes();
    })

    // Read One
    .get("/pastes/:id", async ({ params: { id }, set }) => {
        const paste = await getPasteById(id);
        if (!paste) {
            set.status = 404;
            return { error: "Texto não encontrado." };
        }
        return paste;
    })

    // Update
    .put("/pastes/:id", async ({ params: { id }, body, set }) => {
        const existing = await getPasteById(id);
        if (!existing) {
            set.status = 404;
            return { error: "Texto não encontrado." };
        }
        const result = await updatePasteById(id, body.content, body.language || existing.language);
        return result;
    }, {
        body: t.Object({
            content: t.String({ minLength: 1 }),
            language: t.Optional(t.String()),
        }),
    })

    // Delete
    .delete("/pastes/:id", async ({ params: { id }, set }) => {
        const existing = await getPasteById(id);
        if (!existing) {
            set.status = 404;
            return { error: "Texto não encontrado." };
        }
        await deletePasteById(id);
        return { message: "Texto removido com sucesso." };
    })

    .listen(3000);


console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
