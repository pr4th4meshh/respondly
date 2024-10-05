import mongoose, { Document, Schema } from "mongoose"

export interface IForm extends Document {
  creator: string
  title: string
  fields: Array<{ 
    label: string; 
    type: string;
    options?: string[];
    requiredField: boolean;
    _id: string;
  }>
  responses: Array<{ label: string; value: string }>
}

const FormSchema: Schema = new Schema(
  {
    creator: { type: String, required: true },
    title: { type: String, required: true },
    fields: [
      {
        label: { type: String, required: true },
        type: { type: String, required: true },
        options: { type: [String], default: [] },
        requiredField: { type: Boolean, default: false, required:true },
      },
    ],
    responses: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.models.Form || mongoose.model<IForm>("Form", FormSchema)