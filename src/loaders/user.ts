import { Client } from "pg";
import { User } from "../pgModels/user";

export async function loadUsers(database: Client): Promise<User[]> {
    const users = [];

    const result = await database.query("SELECT * FROM users");
    for (const row of result.rows) {
        users.push(new User(
            Number.parseInt(row.id),
            Number.parseInt(row.student_id),
            row.email
        ));
    }

    return users;
}
