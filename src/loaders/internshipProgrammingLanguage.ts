import { Client } from "pg";
import { InternshipProgrammingLanguage } from "../pgModels/internshipProgrammingLanguage";

export async function loadInternshipsProgrammingLanguages(database: Client): Promise<InternshipProgrammingLanguage[]> {
    const internshipsProgrammingLanguages = [];

    const result = await database.query("SELECT * FROM internships_programming_languages");
    for (const row of result.rows) {
        internshipsProgrammingLanguages.push(new InternshipProgrammingLanguage(
            Number.parseInt(row.internship_id),
            Number.parseInt(row.programming_language_id)
        ));
    }

    return internshipsProgrammingLanguages;
}
