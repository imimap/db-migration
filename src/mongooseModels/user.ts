import { model, Schema } from "mongoose";
import { IStudentProfile, StudentProfileSchema } from "./studentProfile";
import { isValidEmail, normalizeEmail } from "../helpers/emailAddressHelper";

export interface IUser {
  firstName: string,
  lastName: string,
  isAdmin?: boolean,
  emailAddress: string,
  studentProfile?: IStudentProfile,
}

const UserSchema = new Schema<IUser>({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  isAdmin: {
    default: false,
    type: Boolean,
  },
  emailAddress: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: isValidEmail,
      message: "Email address is not valid",
    },
  },
  studentProfile: {
    type: StudentProfileSchema,
  },
});

UserSchema.pre("validate", function () {
  if (this.modifiedPaths().includes("emailAddress")) {
    this.set("emailAddress", normalizeEmail(this.get("emailAddress")));
  }
});

export const User = model<IUser>("User", UserSchema);
