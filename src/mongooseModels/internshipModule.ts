import { model, Schema, Types } from "mongoose";
import { IPdfDocument, PdfDocumentSchema } from "./embedded/pdfDocument";
import { EventSchema, IEvent } from "./embedded/event";
import { Semester } from "../helpers/semesterHelper";

export interface IInternshipModule {
  internships: Types.ObjectId[];
  inSemester: string;
  inSemesterOfStudy: number;
  aepPassed: boolean;
  reportPdf: IPdfDocument;
  completeDocumentsPdf: IPdfDocument;
  events: IEvent[];
}

const InternshipModuleSchema = new Schema<IInternshipModule>({
  internships: [
    {
      ref: "Internship",
      type: Schema.Types.ObjectId,
    },
  ],
  inSemester: {
    type: String,
    default: Semester.getUpcoming().toString(),
  },
  inSemesterOfStudy: {
    type: Number,
    default: 4,
  },
  aepPassed: {
    type: Boolean,
    default: false,
  },
  reportPdf: {
    type: PdfDocumentSchema,
  },
  completeDocumentsPdf: {
    type: PdfDocumentSchema,
  },
  events: [
    {
      type: EventSchema,
    },
  ],
});

export const InternshipModule = model<IInternshipModule>("InternshipModule", InternshipModuleSchema);
