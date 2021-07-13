import { Client } from "pg";

export async function loadPaymentStates(db: Client): Promise<string[]> {
    const paymentStates = [];

    const result = await db.query("SELECT * FROM payment_states");
    for (const row of result.rows)
        paymentStates[row.id] = row.name;

    return paymentStates;
}
