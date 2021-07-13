import { Client } from "pg";
import { UserCompany } from "../pgModels/userCompany";

export async function loadUserCompanies(database: Client): Promise<UserCompany[]> {
    const userCompanies = [];

    const result = await database.query("SELECT * FROM users");
    for (const row of result.rows) {
        userCompanies.push(new UserCompany(
            Number.parseInt(row.user_id),
            Number.parseInt(row.company_id)
        ));
    }

    return userCompanies;
}
