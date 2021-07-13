import { Client } from "pg";
import { CompleteInternship } from "../pgModels/completeInternship";

export async function loadCompleteInternships(database: Client): Promise<CompleteInternship[]> {
    const completeInternships = [];

    const result = await database.query("SELECT * FROM complete_internships");
    for (const row of result.rows) {
        completeInternships.push(new CompleteInternship(
            Number.parseInt(row.id),
            Number.parseInt(row.semester_id),
            Number.parseInt(row.student_id),
            Number.parseInt(row.semester_of_study) || 0,
            row.aep,
            row.passed,
            row.createdAt,
            row.updated_at
        ));
    }

    return completeInternships;
}
