import { Company } from "../mongooseModels/company";
import { Company as OldCompany } from "../pgModels/company";
import { CompanyAddress as OldCompanyAddress } from "../pgModels/companyAddress";
import { getCompanySize } from "../helpers/companySizes";
import { getLanguage } from "../helpers/isoLanguages";
import createProgressLogger from "../fancyPrinter";
import { Types } from "mongoose";

export default async function convertCompanies(companies: OldCompany[], companyAddresses: OldCompanyAddress[]): Promise<Types.ObjectId[]> {
    let counter = 0;
    const log = createProgressLogger("Company", companyAddresses.filter(c => c !== undefined).length);
    const newCompanies = [];

    for (let i = 0; i < companyAddresses.length; ++i) {
        const companyAddress = companyAddresses[i];
        if (companyAddress === undefined)
            continue;

        const company = companies[companyAddress.companyId];

        const newCompanyAddress = {
            street: companyAddress.street,
            zip: companyAddress.zip,
            city: companyAddress.city,
            country: companyAddress.country,
            coordinates: {
                latitude: companyAddress.latitude,
                longitude: companyAddress.longitude
            }
        };

        const newCompany: any = {
            address: newCompanyAddress,
            comment: company.comment,
            companyName: company.name,
            excludedFromSearch: company.excludedFromSearch,
            industry: company.industry
        };

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
        newCompanies[i] = companyDoc.id;

        log(++counter);
    }

    return newCompanies;
}
