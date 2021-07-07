import { Client } from "pg";
import { Student } from "../pgModels/student";

export async function loadStudents(database: Client): Promise<Student[]> {
    const students = [];

    const result = await database.query("SELECT * FROM students");
    for (const row of result.rows) {
        students[row.id] = new Student(
            row.enrolment_number,
            row.last_name,
            row.first_name,
            new Date(row.birthday),
            row.birthplace,
            row.email,
            row.private_email,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }

    return students;
}
