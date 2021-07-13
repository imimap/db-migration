export class CompleteInternship {
    id: number;
    semesterId: number;
    studentId: number;
    semesterOfStudy: number;
    aep: boolean;
    passed: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, semesterId: number, studentId: number, semesterOfStudy: number, aep: boolean, passed: boolean, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.semesterId = semesterId;
        this.studentId = studentId;
        this.semesterOfStudy = semesterOfStudy;
        this.aep = aep;
        this.passed = passed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
