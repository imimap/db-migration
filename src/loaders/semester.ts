import { Client } from "pg";

export async function loadSemesters(db: Client): Promise<string[]> {
    const semesters = [];

    const result = await db.query("SELECT * FROM semesters");
    for (const row of result.rows)
        semesters[row.id] = row.name.slice(0, 2) + "20" + row.name.slice(3, 5);

    return semesters;
}
