export class User {
    id: number;
    studentId: number;
    email: string;

    constructor(id: number, studentId: number, email: string) {
        this.id = id;
        this.studentId = studentId;
        this.email = email;
    }
}
