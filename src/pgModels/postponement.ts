export class Postponement {
    studentId: number;
    semesterId: number;
    semesterOfStudy: number;
    reason: string;
    approved: boolean;
    timestamp: Date;

    constructor(studentId: number, semesterId: number, semesterOfStudy: number, reason: string, approved: boolean, timestamp: Date) {
        this.studentId = studentId;
        this.semesterId = semesterId;
        this.semesterOfStudy = semesterOfStudy;
        this.reason = reason;
        this.approved = approved;
        this.timestamp = timestamp;
    }
}
