import { CompleteInternship } from "../pgModels/completeInternship";
import createProgressLogger from "../fancyPrinter";
import { Types } from "mongoose";
import { InternshipModule } from "../mongooseModels/internshipModule";

export default async function convertInternshipModules(completeInternships: CompleteInternship[], semesters: string[]): Promise<{
    internships: Map<number, Types.ObjectId>,
    userMap: Map<number, Types.ObjectId>
}> {
    let counter = 0;
    const log = createProgressLogger("Internship Module", completeInternships.length);
    const internshipModules = new Map<number, Types.ObjectId>();
    const internshipUserMap = new Map<number, Types.ObjectId>();

    for (const internship of completeInternships) {
        const internshipModule = {
            oldId: internship.id,
            aepPassed: internship.aep,
            inSemester: semesters[internship.semesterId],
            inSemesterOfStudy: internship.semesterOfStudy,
            internships: []
        };

        const internshipModuleDoc = await InternshipModule.create(internshipModule);
        internshipModules.set(internship.id, internshipModuleDoc.id);
        internshipUserMap.set(internship.studentId, internshipModuleDoc.id);

        log(++counter);
    }

    return { internships: internshipModules, userMap: internshipUserMap };
}
