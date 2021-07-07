import { Client } from "pg";

export async function loadSemesters(db: Client): Promise<string[]> {
    const semesters = [];

    const result = await db.query("SELECT * FROM semesters");
    for (const row of result.rows)
        semesters[row.id] = row.name;

    return semesters;
}
