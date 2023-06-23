import { Client } from "pg";
import { Internship } from "../pgModels/internship";

export async function loadInternships(database: Client): Promise<Internship[]> {
    const internships = [];

    const result = await database.query("SELECT * FROM internships");
    for (const row of result.rows) {
        // Skip if start or end date missing
        if (row.startDate === null || row.end_date === null)
            continue;

        let startDate = new Date(row.start_date);
        let endDate = new Date(row.end_date);

        // Move end date one month back if start and end date are equal
        if (startDate.getTime() === endDate.getTime())
            endDate.setMonth(endDate.getMonth() + 1)

        // Swap dates if start date is past end date
        if (startDate.getTime() > endDate.getTime()) {
            let temp = startDate;
            startDate = endDate;
            endDate = temp;
        }
//console.log(row.internship_state_id);
        internships.push(new Internship(
            Number.parseInt(row.id),
            Number.parseInt(row.complete_internship_id),
            Number.parseInt(row.company_address_id),
            Number.parseInt(row.working_hours) || 0,
            Number.parseInt(row.living_costs) || 0,
            Number.parseInt(row.internship_rating_id),
            row.recommend,
            Number.parseInt(row.orientation_id),
            row.description,
            Number.parseInt(row.semester_id),
            Number.parseInt(row.salary) || 0,
            startDate,
            endDate,
            row.tasks,
            row.operational_area,
            Number.parseInt(row.internship_state_id),
            Number.parseInt(row.reading_prof_id),
            Number.parseInt(row.payment_state_id),
            Number.parseInt(row.registration_state_id),
            Number.parseInt(row.contract_state_id),
            Number.parseInt(row.report_state_id),
            Number.parseInt(row.certificate_state_id),
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
        ));
    }

    return internships;
}
