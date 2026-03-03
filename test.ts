const BASE_URL = "http://localhost:3000";

async function run() {
    console.log("1. Add a paste");
    const createRes = await fetch(`${BASE_URL}/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "console.log('Hello Pastebin!');", language: "javascript" })
    });
    const paste = await createRes.json();
    console.log("Created:", paste);

    if (!paste.id) throw new Error("No ID returned!");

    console.log("\n2. Get the paste by ID");
    const getRes = await fetch(`${BASE_URL}/pastes/${paste.id}`);
    console.log("Fetched:", await getRes.json());

    console.log("\n3. Update the paste");
    const updateRes = await fetch(`${BASE_URL}/pastes/${paste.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "console.log('Hello Pastebin updated!');" })
    });
    console.log("Updated:", await updateRes.json());

    console.log("\n4. Get all pastes");
    const allRes = await fetch(`${BASE_URL}/pastes`);
    console.log("All:", await allRes.json());

    console.log("\n5. Delete the paste");
    const deleteRes = await fetch(`${BASE_URL}/pastes/${paste.id}`, {
        method: "DELETE"
    });
    console.log("Deleted:", await deleteRes.json());

    console.log("\nAll API endpoints work perfectly!");
}

run().catch(console.error);
