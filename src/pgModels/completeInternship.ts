export class CompleteInternship {
    semesterId: number;
    studentId: number;
    semesterOfStudy: number;
    aep: boolean;
    passed: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(semesterId: number, studentId: number, semesterOfStudy: number, aep: boolean, passed: boolean, createdAt: Date, updatedAt: Date) {
        this.semesterId = semesterId;
        this.studentId = studentId;
        this.semesterOfStudy = semesterOfStudy;
        this.aep = aep;
        this.passed = passed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
