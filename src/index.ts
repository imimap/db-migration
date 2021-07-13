import { Client } from "pg";
import { config } from "dotenv";
import { loadCompanies } from "./loaders/company";
import { loadCompanyAddresses } from "./loaders/companyAddress";
import { loadStudents } from "./loaders/student";
import { loadCompleteInternships } from "./loaders/completeInternship";
import { loadInternships } from "./loaders/internship";
import convertCompanies from "./converters/company";
import { connect, disconnect } from "mongoose";
import convertInternshipModules from "./converters/internshipModule";
import { loadSemesters } from "./loaders/semester";
import convertInternships from "./converters/internship";
import convertUsers from "./converters/user";
import { loadUsers } from "./loaders/user";
import { loadUserCompanies } from "./loaders/userCompany";

// Load db config from .env file
config();

// Run this script asynchronously
run().catch(console.error);

async function run() {
    // Connect to Postgres
    const db = new Client();
    await db.connect();
    // Connect to MongoDB
    await connect("mongodb://localhost:27017/imimap", {
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
    // Migrate companies
    const companies = await loadCompanies(db);
    const companyAddresses = await loadCompanyAddresses(db);
    const companyIdMap = await convertCompanies(companies, companyAddresses);

    // Migrate internship modules
    const completeInternships = await loadCompleteInternships(db);
    const semesters = await loadSemesters(db);
    const internshipModuleIdMaps = await convertInternshipModules(completeInternships, semesters);

    // Migrate internships
    const internships = await loadInternships(db);
    const internshipIdMap = await convertInternships(internships, companyIdMap, internshipModuleIdMaps.internships);

    // Migrate students
    const users = await loadUsers(db);
    const students = await loadStudents(db);
    const userCompanies = await loadUserCompanies(db);
    const userMap = await convertUsers(users, students, userCompanies, companyIdMap, internshipModuleIdMaps.userMap);
}
