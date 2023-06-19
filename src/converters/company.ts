import { Company as OldCompany } from "../pgModels/company";
import { CompanyAddress as OldCompanyAddress } from "../pgModels/companyAddress";
import { getCompanySize } from "../helpers/companySizes";
import { getLanguage } from "../helpers/isoLanguages";
import createProgressLogger from "../fancyPrinter";
import { Types } from "mongoose";
import { Company } from "../mongooseModels/company";

export default async function convertCompanies(companies: OldCompany[], companyAddresses: OldCompanyAddress[]): Promise<Map<number, Types.ObjectId>> {
    let counter = 0;
    const log = createProgressLogger("Company", companyAddresses.length);
    const newCompanies = new Map<number, Types.ObjectId>();

    for (const companyAddress of companyAddresses) {
        const company = companies.find(c => c.id === companyAddress.companyId);
        // Skip addresses which don't have an associated company
        if (!company)
            throw new Error(`Company with id ${companyAddress.companyId} not found`);

        // Create new address model
        const newCompanyAddress = {
            street: companyAddress.street,
            zip: companyAddress.zip.trim().length > 0 ? companyAddress.zip : "unknown",
            city: companyAddress.city.trim().length > 0 ? companyAddress.city : "unknown",
            country: companyAddress.country,
            coordinates: {
                latitude: companyAddress.latitude,
                longitude: companyAddress.longitude
            }
        };

        // Create new company model
        const newCompany: any = {
            oldId: company.id,
            address: newCompanyAddress,
            comment: company.comment,
            companyName: company.name,
            excludedFromSearch: company.excludedFromSearch,
            industry: company.industry
        };

        // Add optional properties
        if (company.website) {
            company.website = company.website.trim();
            if (!company.website.startsWith("http"))
                company.website = "https://" + company.website;
            newCompany.website = company.website;
        }
        if (company.mainLanguage)
            newCompany.mainLanguage = getLanguage(company.mainLanguage.split(",")[0]);
        if (company.numberEmployees)
            newCompany.size = getCompanySize(company.numberEmployees);

        const companyDoc = await Company.create(newCompany);
        // new companies have companyAddress as KEY, because in internship conversion we ONLY have the 
        // companyAddress.id as a reference NOT the company.id!!
        newCompanies.set(companyAddress.id, companyDoc.id);

        log(++counter);
    }

    return newCompanies;
}
