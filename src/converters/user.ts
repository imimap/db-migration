import createProgressLogger from "../fancyPrinter";
import { User as OldUser } from "../pgModels/user";
import { Student as OldStudent } from "../pgModels/student";
import { Types } from "mongoose";
import { User } from "../mongooseModels/user";
import { UserCompany } from "../pgModels/userCompany";

export default async function convertUsers(
    users: OldUser[],
    students: OldStudent[],
    companiesSeen: UserCompany[],
    companies: Map<number, Types.ObjectId>,
    internshipModules: Map<number, Types.ObjectId>
): Promise<Map<number, Types.ObjectId>> {
    let counter = 0;
    const log = createProgressLogger("Company", users.length);
    const newUsers = new Map<number, Types.ObjectId>();
    const skippedUsers = new Map<number, string>();

    for (const user of users) {
        // Find student belonging to user
        let student = students.find(s => s.id === user.studentId);
        if (!student) {
            const matches = /s0([0-9]{6})@htw-berlin.de/.exec(user.email);
            if (!matches) {
                skippedUsers.set(user.id, "student profile not found");
                continue;
            }
            student = students.find(s => s.enrollmentNumber === matches[1]);
            if (!student) {
                skippedUsers.set(user.id, "student profile not found");
                continue;
            }
        }

        const internshipsSeen = companiesSeen.filter(c => c.userId === user.id).map(c => companies.get(c.companyId));

        const newUser = {
            oldId: user.id,
            firstName: student.firstName,
            lastName: student.lastName,
            isAdmin: false,
            emailAddress: student.email,
            studentProfile: {
                studentId: `s0${student.enrollmentNumber}`,
                internshipsSeen: internshipsSeen,
                internship: internshipModules.get(student.id)
            }
        };

        try {
            const userDoc = await User.create(newUser);
            newUsers.set(user.id, userDoc.id);
        } catch (e) {
            if (e.message.indexOf("duplicate key error collection: imimap.users index: emailAddress") !== 0) {
                skippedUsers.set(user.id, "duplicate email address");
                continue;
            } else
                throw e;
        }

        log(++counter);
    }
    console.log("\nSkipped users: ", skippedUsers);

    return newUsers;
}
