import { InternshipModule } from "../mongooseModels/internshipModule";
import { CompleteInternship } from "../pgModels/completeInternship";
import createProgressLogger from "../fancyPrinter";
import { Types } from "mongoose";

export default async function convertInternshipModules(completeInternships: CompleteInternship[], semesters: string[]): Promise<Types.ObjectId[]> {
    let counter = 0;
    const log = createProgressLogger("Internship Module", completeInternships.filter(c => c !== undefined).length);
    const internshipModules = [];

    for (let i = 0; i < completeInternships.length; ++i) {
        const internship = completeInternships[i];
        if (internship === undefined)
            continue;

        const internshipModule = {
            aepPassed: internship.aep,
            inSemester: semesters[internship.semesterId],
            inSemesterOfStudy: internship.semesterOfStudy
        };

        const internshipModuleDoc = await InternshipModule.create(internshipModule);
        internshipModules[i] = internshipModuleDoc.id;

        log(++counter);
    }

    return internshipModules;
}
