export class Student {
    id: number;
    enrollmentNumber: string;
    lastName: string;
    firstName: string;
    birthday: Date;
    birthplace: string;
    email: string;
    privateEmail: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, enrollmentNumber: string, lastName: string, firstName: string, birthday: Date, birthplace: string, email: string, privateEmail: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.enrollmentNumber = enrollmentNumber;
        this.lastName = lastName;
        this.firstName = firstName;
        this.birthday = birthday;
        this.birthplace = birthplace;
        this.email = email;
        this.privateEmail = privateEmail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
