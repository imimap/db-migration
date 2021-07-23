import { Internship as OldInternship } from "../pgModels/internship";
import createProgressLogger from "../fancyPrinter";
import { Types } from "mongoose";
import { isValidEmail, normalizeEmail } from "../helpers/emailAddressHelper";
import { Internship, InternshipStatuses } from "../mongooseModels/internship";
import { InternshipModule } from "../mongooseModels/internshipModule";
import { InternshipProgrammingLanguage } from "../pgModels/internshipProgrammingLanguage";


export default async function convertInternships(
    internships: OldInternship[],
    companies: Map<number, Types.ObjectId>,
    internshipModules: Map<number, Types.ObjectId>,
    programmingLanguages: string[],
    internshipsProgrammingLangs: InternshipProgrammingLanguage[],
    paymentStates: string[]
): Promise<Map<number, Types.ObjectId>> {
    let counter = 0;
    const log = createProgressLogger("Internship", internships.length);
    const newInternships = new Map<number, Types.ObjectId>();
    // State map is used for logging details about the migrated internships
    const stateMap = new Map<string, number>();

    for (const internship of internships) {
        // Create supervisor model
        const supervisor: any = {};
        if (internship.supervisorName)
            supervisor.name = internship.supervisorName;
        if (internship.supervisorEmail && isValidEmail(normalizeEmail(internship.supervisorEmail)))
            supervisor.emailAddress = internship.supervisorEmail;

        // Map programming languages from ids to name strings
        const langs = internshipsProgrammingLangs
            .filter(i => i.internshipId === internship.id)
            .map(i => programmingLanguages[i.programmingLanguageId]);

        // Get the current state of the internship
        const status = getInternshipStatus(internship);
        stateMap.set(status.valueOf(), (stateMap.get(status.valueOf()) ?? 0) + 1);

        const newInternship = {
            oldId: internship.id,
            company: companies.get(internship.companyAddressId),
            description: internship.description,
            tasks: internship.tasks,
            operationalArea: internship.operationalArea,
            programmingLanguages: langs,
            startDate: internship.startDate,
            endDate: internship.endDate,
            workingHoursPerWeek: internship.workingHours,
            livingCosts: internship.livingCosts,
            paymentTypes: [paymentStates[internship.paymentStateId]],
            salary: internship.salary,
            supervisor: supervisor,
            status: status
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

    console.log("States:", stateMap);

    return newInternships;
}

function getInternshipStatus(internship: OldInternship): InternshipStatuses {
    // TODO: Check if correct
    if (internship.internshipStateId === 2)
        return InternshipStatuses.REJECTED;
    if (internship.internshipStateId === 1)
        return InternshipStatuses.PASSED;
    if (internship.reportStateId === 3 && internship.contractStateId === 3 && internship.registrationStateId === 2)
        return InternshipStatuses.PASSED;
    if (internship.reportStateId !== 1 && internship.endDate.getTime() < Date.now()) {
        console.log(`\nreport: ${internship.reportStateId}, internship: ${internship.internshipStateId}, contract: ${internship.contractStateId}, registration: ${internship.registrationStateId}`);
        return InternshipStatuses.READY_FOR_GRADING;
    }
    if (internship.endDate.getTime() < Date.now())
        return InternshipStatuses.OVER;
    if (internship.contractStateId !== 1 && internship.registrationStateId !== 6)
        return InternshipStatuses.APPROVED;
    if (internship.registrationStateId === 6)
        return InternshipStatuses.REQUESTED;
    return InternshipStatuses.PLANNED;
}
