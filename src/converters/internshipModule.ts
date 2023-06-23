import { CompleteInternship } from "../pgModels/completeInternship";
import createProgressLogger from "../fancyPrinter";
import { Types } from "mongoose";
import { InternshipModule, InternshipModuleStatuses } from "../mongooseModels/internshipModule";
import { Postponement } from "../pgModels/postponement";
import { imimapAdmin } from "../helpers/imimapAsAdminHelper";
import { EventTypes, IEvent } from "../mongooseModels/event";

export default async function convertInternshipModules(
    completeInternships: CompleteInternship[],
    semesters: string[],
    postponements: Postponement[]
): Promise<{
    internships: Map<number, Types.ObjectId>,
    userMap: Map<number, Types.ObjectId>
}> {
    let counter = 0;
    const log = createProgressLogger("Internship Module", completeInternships.length);
    const internshipModules = new Map<number, Types.ObjectId>();
    const internshipUserMap = new Map<number, Types.ObjectId>();
    const admin = await imimapAdmin;

    for (const internship of completeInternships) {
        // Get postponement requests
        const postponementList = postponements
            .filter(p => p.studentId === internship.studentId)
            .map(p => ({
                timestamp: p.timestamp.getTime(),
                creator: admin._id,
                type: EventTypes.INTERNSHIP_MODULE_POSTPONEMENT,
                changes: {
                    newSemester: semesters[p.semesterId],
                    newSemesterOfStudy: p.semesterOfStudy
                },
                accept: p.approved,
                comment: p.reason
            } as IEvent));
        const status = getInternshipModuleStatus(internship, postponementList);
        if(status !== InternshipModuleStatuses.POSTPONEMENT_REQUESTED){
            //DS something is planned or even finished ==> create planned event!!
            postponementList.push({
                type: EventTypes.INTERNSHIP_MODULE_UPDATE,
                creator: new Types.ObjectId('0000a0000000000000000000'),
                accept: true,
                changes: {
                  newSemester: "SS2023",
                  newSemesterOfStudy: 4,
                  aepPassed: false,
                  status: InternshipModuleStatuses.PLANNED,
                },
              });
            }
        const internshipModule = {
            oldId: internship.id,
            aepPassed: internship.aep,
            inSemester: semesters[internship.semesterId],
            inSemesterOfStudy: internship.semesterOfStudy,
            internships: [],
            events: postponementList,
            status
        };
            
        const internshipModuleDoc = await InternshipModule.create(internshipModule);
        internshipModules.set(internship.id, internshipModuleDoc.id);
        internshipUserMap.set(internship.studentId, internshipModuleDoc.id);

        log(++counter);
    }

    return { internships: internshipModules, userMap: internshipUserMap };
}

function getInternshipModuleStatus(internship: CompleteInternship, postponements: IEvent[]) {
    const latestRequest = postponements.sort((l, r) => (l.timestamp ?? 0) - (r.timestamp ?? 0))[0];
    if (latestRequest?.accept === false)
        return InternshipModuleStatuses.POSTPONEMENT_REQUESTED;
    return internship.passed ? InternshipModuleStatuses.PASSED : InternshipModuleStatuses.PLANNED;
}
