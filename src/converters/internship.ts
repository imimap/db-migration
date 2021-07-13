import { Internship as OldInternship } from "../pgModels/internship";
import createProgressLogger from "../fancyPrinter";
import { Types } from "mongoose";
import { isValidEmail, normalizeEmail } from "../helpers/emailAddressHelper";
import { Internship } from "../mongooseModels/internship";
import { InternshipModule } from "../mongooseModels/internshipModule";

export default async function convertInternships(internships: OldInternship[], companies: Map<number, Types.ObjectId>, internshipModules: Map<number, Types.ObjectId>): Promise<Map<number, Types.ObjectId>> {
    let counter = 0;
    const log = createProgressLogger("Internship", internships.length);
    const newInternships = new Map<number, Types.ObjectId>();

    for (const internship of internships) {
        const supervisor: any = {};

        if (internship.supervisorName)
            supervisor.name = internship.supervisorName;

        if (internship.supervisorEmail && isValidEmail(normalizeEmail(internship.supervisorEmail)))
            supervisor.emailAddress = internship.supervisorEmail;

        const newInternship = {
            oldId: internship.id,
            company: companies.get(internship.companyAddressId),
            description: internship.description,
            tasks: internship.tasks,
            operationalArea: internship.operationalArea,
            programmingLanguages: [], // TODO: Add programming languages
            startDate: internship.startDate,
            endDate: internship.endDate,
            workingHoursPerWeek: internship.workingHours,
            livingCosts: internship.livingCosts,
            paymentType: [], // TODO: Add payment types
            salary: internship.salary,
            supervisor: supervisor
        };

        const internshipDoc = await Internship.create(newInternship);
        newInternships.set(internship.id, internshipDoc.id);

        // Add internship to internship module
        const internshipModule = await InternshipModule.findById(internshipModules.get(internship.completeInternshipId));
        if (!internshipModule)
            throw new Error(`Internship Module with id ${internshipDoc.id.toString()} not found`);
        internshipModule.internships?.push(internshipDoc.id);
        await internshipModule.save();

        log(++counter);
    }

    return newInternships;
}
