import { Schema, Types } from "mongoose";
import { isValidStudentId, normalizeStudentId } from "../helpers/studentIdHelper";

export interface IStudentProfile {
  studentId: string,
  internshipsSeen?: Types.ObjectId[],
  internship?: Types.ObjectId,
}

export const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    studentId: {
      required: true,
      type: String,
      validate: {
        validator: isValidStudentId,
        message: "StudentId (Matrikelnummer) is not valid. Needs to be of form s0xxxxxx.",
      },
    },
    internshipsSeen: [
      {
        ref: "Internship",
        type: Schema.Types.ObjectId,
      },
    ],
    internship: {
      ref: "InternshipModule",
      type: Schema.Types.ObjectId,
    },
  },
  { _id: false }
);

StudentProfileSchema.pre("save", function () {
  if (this.modifiedPaths().includes("studentId")) {
    const givenId = this.get("studentId");
    this.set("studentId", normalizeStudentId(givenId));
  }
});