import { Client } from "pg";
import { Postponement } from "../pgModels/postponement";

export async function loadPostponements(database: Client): Promise<Postponement[]> {
    const postponements = [];

    const result = await database.query("SELECT * FROM postponements");
    for (const row of result.rows) {
        postponements.push(new Postponement(
            Number.parseInt(row.student_id),
            Number.parseInt(row.semester_id),
            Number.parseInt(row.semester_of_study),
            row.reason,
            row.approved_at !== null,
            new Date(row.placed_at)
        ));
    }

    return postponements;
}
