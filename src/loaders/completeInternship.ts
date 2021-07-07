import { Client } from "pg";
import { CompleteInternship } from "../pgModels/completeInternship";

export async function loadCompleteInternships(database: Client): Promise<CompleteInternship[]> {
    const completeInternships = [];

    const result = await database.query("SELECT * FROM complete_internships");
    for (const row of result.rows) {
        completeInternships[row.id] = new CompleteInternship(
            row.semester_id,
            row.student_id,
            row.semester_of_study,
            row.aep,
            row.passed,
            row.createdAt,
            row.updated_at
        );
    }

    return completeInternships;
}
