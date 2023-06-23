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
    let counter = 0, deletedISM = 0;
    const log = createProgressLogger("User", users.length);
    const newUsers = new Map<number, Types.ObjectId>();
    // Used for logging details about users skipped due to import errors
    const skippedUsers = new Map<number, string>();

    for (const user of users) {
        // Find student belonging to user
        let student = students.find(s => (s.id === user.studentId)||(s.email == user.email));
        if (!student) {
            const matches = /s0([0-9]{6})@(student.)?htw-berlin.de/.exec(user.email);
            if (!matches) {
                skippedUsers.set(user.id, "non student profile skipped: " + user.email);
                log(++counter);
                continue;
            }
            student = students.find(s => s.enrollmentNumber === matches[1]);
            if (!student) {
                skippedUsers.set(user.id, "student profile not found");
                log(++counter);
                continue;
            }
        }

        // Get previous internship search results for users
        const internshipsSeen = companiesSeen.filter(c => c.userId === user.id).map(c => companies.get(c.companyId));

        // Create the new user
        const newUser = {
            oldId: user.id,
            firstName: student.firstName,
            lastName: student.lastName,
            isAdmin: false,
            emailAddress: student.email,
            studentProfile: {
                studentId: `s0${student.enrollmentNumber}`,
                companiesSeen: internshipsSeen,
                internship: internshipModules.get(student.id)
            }
        };
        // Remove this internshipModule from list, because we found a fitting student
        // Modules that remain in list after user conversion need to be removed from DB
        if(!internshipModules.delete(student.id))deletedISM++;
        try {
            const existingUser = await User.findOne({emailAddress: newUser.emailAddress});
            if(!existingUser){
                const userDoc = await User.create(newUser);
                newUsers.set(user.id, userDoc.id);    
            } else {
                const doc = await User.findOneAndUpdate({emailAddress: newUser.emailAddress}, newUser, {
                    new: true,
                    upsert: true // Make this update into an upsert
                  });
            }
        } catch (e) {
            // Skip duplicate email addresses
            if (e.message.indexOf("duplicate key error collection: imimap.users index: emailAddress") !== 0) {
                skippedUsers.set(user.id, "duplicate email address");
                log(++counter);
                continue;
            } else
                throw e;
        }

        log(++counter);
    }
    console.log("Del ISMs: " + deletedISM + "remaining: " + internshipModules.size );
    console.log("Skipped users:", skippedUsers);

    return newUsers;
}

export async function createUsers(
    users: OldUser[],
    students: OldStudent[],
    companiesSeen: UserCompany[],
    companies: Map<number, Types.ObjectId>,
    internshipModules: Map<number, Types.ObjectId>
): Promise<Map<number, Types.ObjectId>> {
    let counter = 0, deletedISM = 0;
    const log = createProgressLogger("User", users.length);
    const newUsers = new Map<number, Types.ObjectId>();
    // Used for logging details about users skipped due to import errors
    const skippedUsers = new Map<number, string>();

    //Go through all existing internshipModule students
    for (const studentID of internshipModules.keys()) {
        // Find student belonging to user
        let student = students.find(s => (s.id === studentID));
        if (!student) {
            skippedUsers.set(studentID, "student profile not found");
            continue;
        }
        if (!(student.firstName && student.lastName)) {
            skippedUsers.set(studentID, "student Name not given, skipped");
            continue;
        }

        // Get previous internship search results for users
        const internshipsSeen = companiesSeen.filter(c => c.userId === studentID).map(c => companies.get(c.companyId));

        // Create the new user
        const newUser = {
            firstName: student.firstName,
            lastName: student.lastName,
            isAdmin: false,
            emailAddress: student.email,
            studentProfile: {
                studentId: `s0${student.enrollmentNumber}`,
                companiesSeen: internshipsSeen,
                internship: internshipModules.get(student.id)
            }
        };
        // Remove this internshipModule from list, because we found a fitting student
        // Modules that remain in list after user conversion need to be removed from DB
        try {
            const existingUser = await User.findOne({emailAddress: newUser.emailAddress});
            if(!existingUser){
                const userDoc = await User.create(newUser);
                newUsers.set(studentID, userDoc.id);    
            } else {
                const doc = await User.findOneAndUpdate({emailAddress: newUser.emailAddress}, newUser, {
                    new: true,
                    upsert: true // Make this update into an upsert
                  });
            }
        } catch (e) {
            // Skip duplicate email addresses
            if (e.message.indexOf("duplicate key error collection: imimap.users index: emailAddress") !== 0) {
                skippedUsers.set(studentID, "duplicate email address");
                log(++counter);
                continue;
            } else
                throw e;
        }

        log(++counter);
    }
    console.log("Del ISMs: " + deletedISM + "remaining: " + internshipModules.size );
    console.log("Skipped users:", skippedUsers);

    return newUsers;
}
