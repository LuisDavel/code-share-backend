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
    .get("/", () => "API do Pastebin está rodando 🚀")

    // Create (Criar texto/código)
    .post("/pastes", async ({ body, set }) => {
        try {
            const id = generateShortId(8); // Cria um ID curto de 8 caracteres
            const result = await insertPaste(id, body.content, body.language || 'text');

            set.status = 201;
            return result;
        } catch (error) {
            console.error(error);
            set.status = 500;
            return { error: "Erro ao criar o paste." };
        }
    }, {
        body: t.Object({
            content: t.String(),
            language: t.Optional(t.String())
        })
    })

    // Read All (Listar todos - em um app real você usaria paginação)
    .get("/pastes", async () => {
        return await getAllPastes();
    })

    // Read One (Buscar um texto específico)
    .get("/pastes/:id", async ({ params: { id }, set }) => {
        const paste = await getPasteById(id);
        if (!paste) {
            set.status = 404;
            return { error: "Texto não encontrado." };
        }
        return paste;
    })

    // Update (Atualizar um texto)
    .put("/pastes/:id", async ({ params: { id }, body, set }) => {
        const existing = await getPasteById(id);

        if (!existing) {
            set.status = 404;
            return { error: "Texto não encontrado." };
        }

        try {
            const result = await updatePasteById(id, body.content, body.language || existing.language);

            return result;
        } catch (error) {
            console.error(error);
            set.status = 500;
            return { error: "Erro ao atualizar o paste." };
        }
    }, {
        body: t.Object({
            content: t.String(),
            language: t.Optional(t.String())
        })
    })

    // Delete (Remover um texto)
    .delete("/pastes/:id", async ({ params: { id }, set }) => {
        const existing = await getPasteById(id);

        if (!existing) {
            set.status = 404;
            return { error: "Texto não encontrado." };
        }

        try {
            await deletePasteById(id);
            return { message: "Texto removido com sucesso." };
        } catch (error) {
            console.error(error);
            set.status = 500;
            return { error: "Erro ao remover o paste." };
        }
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
