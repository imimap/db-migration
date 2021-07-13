import { Client } from "pg";

export async function loadProgrammingLanguages(db: Client): Promise<string[]> {
    const programmingLanguages = [];

    const result = await db.query("SELECT * FROM programming_languages");
    for (const row of result.rows)
        programmingLanguages[row.id] = row.name;

    return programmingLanguages;
}
