import { Client } from "pg";
import { Company } from "../pgModels/company";

export async function loadCompanies(database: Client): Promise<Company[]> {
    const companies = [];

    const result = await database.query("SELECT * FROM companies");
    for (const row of result.rows) {
        companies[row.id] = new Company(
            row.name,
            row.number_employees,
            row.industry,
            row.website,
            new Date(row.created_at),
            new Date(row.updated_at),
            row.main_language,
            row.excluded_from_search,
            row.comment
        );
    }

    return companies;
}
