import { IInternship, Internship } from "../mongooseModels/internship";
import { Internship as OldInternship } from "../pgModels/internship";
import createProgressLogger from "../fancyPrinter";
import { Types } from "mongoose";
import { isValidEmail, normalizeEmail } from "../helpers/emailAddressHelper";
import { InternshipModule } from "../mongooseModels/internshipModule";

export default async function convertInternships(internships: OldInternship[], companyIds: Types.ObjectId[], internshipModuleIds: Types.ObjectId[]): Promise<IInternship[]> {
    let counter = 0;
    const log = createProgressLogger("Internship", internships.filter(i => i !== undefined).length);
    const newInternships = [];

    for (let i = 0; i < internships.length; ++i) {
        const internship = internships[i];
        if (internship === undefined)
            continue;

        const supervisor: any = {};

        if (internship.supervisorName)
            supervisor.name = internship.supervisorName;

        if (internship.supervisorEmail && isValidEmail(normalizeEmail(internship.supervisorEmail)))
            supervisor.emailAddress = internship.supervisorEmail;

        const newInternship = {
            company: companyIds[internship.companyAddressId],
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
        newInternships[i] = internshipDoc.id;

        // Add internship to internship module
        const internshipModule = await InternshipModule.findById(internshipModuleIds[internship.completeInternshipId]);
        if (internshipModule === null)
            throw new Error(`Internship Module with id ${internshipDoc.id.toString()} not found`);
        internshipModule.internships.push(internshipDoc.id);
        await internshipModule.save();

        log(++counter);
    }

    return newInternships;
}
