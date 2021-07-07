import { Client } from "pg";
import { CompanyAddress } from "../pgModels/companyAddress";

export async function loadCompanyAddresses(database: Client): Promise<CompanyAddress[]> {
    const companyAddresses = [];

    const result = await database.query("SELECT * FROM company_addresses");
    for (const row of result.rows) {
        companyAddresses[row.id] = new CompanyAddress(
            row.company_id,
            row.street,
            row.zip,
            row.city,
            row.country,
            row.phone,
            row.fax,
            row.latitude,
            row.longitude,
            new Date(row.created_at),
            new Date(row.updated_at)
        );
    }

    return companyAddresses;
}
