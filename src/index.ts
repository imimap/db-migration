import { Client } from "pg";
import { config } from "dotenv";
import { loadCompanies } from "./loaders/company";
import { loadCompanyAddresses } from "./loaders/companyAddress";
import { loadStudents } from "./loaders/student";
import { loadCompleteInternships } from "./loaders/completeInternship";
import { loadInternships } from "./loaders/internship";
import convertCompanies from "./converters/company";
import { connect, createConnection, disconnect } from "mongoose";
import convertInternshipModules from "./converters/internshipModule";
import { loadSemesters } from "./loaders/semester";
import convertInternships from "./converters/internship";
import convertUsers, { createUsers } from "./converters/user";
import { loadUsers } from "./loaders/user";
import { loadUserCompanies } from "./loaders/userCompany";
import { loadPostponements } from "./loaders/postponement";
import { loadProgrammingLanguages } from "./loaders/programmingLanguage";
import { loadInternshipsProgrammingLanguages } from "./loaders/internshipProgrammingLanguage";
import { loadPaymentStates } from "./loaders/paymentState";
import { InternshipModule } from "./mongooseModels/internshipModule";

const readline = require('readline');

function askQuestion(query :String) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, (ans: any) => {
        rl.close();
        resolve(ans);
    }))
}


config();

// Run this script asynchronously
run().catch(console.error);

async function run() {
    const ans = await askQuestion("Are you sure you want to irrevocably DELETE DB imimap? (y/N) ");
    if(ans !=='y') process.exit();

    // Load db config from .env file
    // Connect to Postgres
    const db = new Client();
    await db.connect();
    const conn = createConnection('mongodb://localhost:27019/imimap');
    // Deletes the entire 'mydb' database
    await conn.dropDatabase();
    await conn.close();

    // Connect to MongoDB again
    await connect("mongodb://localhost:27019/imimap", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    // Run migrations
    try {
        await migrate(db);
    } catch (e) {
        console.error(e);
    }

    // Close database connections
    await db.end();
    await disconnect();
}

async function migrate(db: Client) {
    const users = await loadUsers(db);
    const students = await loadStudents(db);
    const userCompanies = await loadUserCompanies(db);

    // Migrate companies
    const companies = await loadCompanies(db);
    const companyAddresses = await loadCompanyAddresses(db);
    const companyIdMap = await convertCompanies(companies, companyAddresses);

    // Migrate internship modules
    const completeInternships = await loadCompleteInternships(db);
    const semesters = await loadSemesters(db);
    const postponements = await loadPostponements(db);
    const internshipModuleIdMaps = await convertInternshipModules(completeInternships, semesters, postponements);

    // Migrate internships
    const internships = await loadInternships(db);
    const programmingLanguages = await loadProgrammingLanguages(db);
    const internshipsProgrammingLanguages = await loadInternshipsProgrammingLanguages(db);
    const paymentStates = await loadPaymentStates(db);
    const internshipIdMap = await convertInternships(
        internships,
        companyIdMap,
        internshipModuleIdMaps.internships,
        programmingLanguages,
        internshipsProgrammingLanguages,
        paymentStates
    );

    // Migrate students, DS the users where very uncomplete, many students without a user??
    // const userMap = await convertUsers(users, students, userCompanies, companyIdMap, internshipModuleIdMaps.userMap);
    // DS DEcided to create a user from the student, when there was a student, an completeModule with at least one 
    // internship in it...
    const userMap = await createUsers(users, students, userCompanies, companyIdMap, internshipModuleIdMaps.userMap);
    //Remove internshipModules for which NO user was found
    //console.log(internshipModuleIdMaps);
    // for(let entry of internshipModuleIdMaps.userMap.values()){
    //     let e = await InternshipModule.findById(entry)
    //     //console.log(e);
    // }
    // for(let entry of internshipModuleIdMaps.userMap.keys()){
    //     let student = students.find(s => (s.id === entry));
    //     //console.log(student);
    // }
    

}
