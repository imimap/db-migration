import { model, Schema } from "mongoose";
import { IAddress, AddressSchema } from "./embedded/address";
import { isoLanguages } from "../helpers/isoLanguages";
import { companySizes } from "../helpers/companySizes";
import { isValidEmail, normalizeEmail } from "../helpers/emailAddressHelper";

export interface ICompany {
  companyName: string;
  branchName: string;
  address: IAddress;
  emailAddress: string;
  industry: string;
  website: string;
  mainLanguage: string;
  size: string;
  comment: string;
  excludedFromSearch: boolean;
}

const CompanySchema = new Schema<ICompany>({
  companyName: {
    type: String,
  },
  branchName: {
    type: String,
  },
  address: {
    type: AddressSchema,
  },
  emailAddress: {
    type: String,
    validate: {
      validator: isValidEmail,
      message: "Email address is not valid",
    },
  },
  industry: {
    type: String,
  },
  website: {
    type: String,
  },
  mainLanguage: {
    default: "en", //2 letter ISO tag, see https://www.loc.gov/standards/iso639-2/php/English_list.php
    type: String,
    enum: Object.keys(isoLanguages),
  },
  size: {
    type: String,
    enum: Object.keys(companySizes),
  },
  comment: {
    type: String,
  },
  excludedFromSearch: {
    default: false,
    type: Boolean,
  },
});

/*
 * Normalizes properties upon saving
 * */
CompanySchema.pre("save", function () {
  if (this.modifiedPaths().includes("emailAddress")) {
    this.set("emailAddress", normalizeEmail(this.get("emailAddress")));
  }
  if (this.modifiedPaths().includes("website")) {
    const givenUrl = this.get("website");
    this.set("website", new URL(givenUrl).href);
  }
});

export const Company = model<ICompany>("Company", CompanySchema);
