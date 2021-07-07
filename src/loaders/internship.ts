import { Client } from "pg";
import { Internship } from "../pgModels/internship";

export async function loadInternships(database: Client): Promise<Internship[]> {
    const internships = [];

    const result = await database.query("SELECT * FROM internships");
    for (const row of result.rows) {
        internships[row.id] = new Internship(
            row.complete_internship_id,
            row.company_address_id,
            row.working_hours,
            row.living_costs,
            row.internship_rating_id,
            row.recommend,
            row.orientation_id,
            row.description,
            row.semester_id,
            row.salary,
            new Date(row.start_date),
            new Date(row.end_date),
            row.tasks,
            row.operational_area,
            row.internship_state_id,
            row.reading_prof_id,
            row.payment_state_id,
            row.registration_state_id,
            row.contract_state_id,
            row.report_state_id,
            row.certificate_state_id,
            new Date(row.certificate_signed_by_internship_officer),
            new Date(row.certificate_signed_by_prof),
            new Date(row.certificate_to_prof),
            row.comment,
            row.supervisor_email,
            row.supervisor_name,
            row.supervisor_phone,
            row.completed,
            row.approved,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }

    return internships;
}
