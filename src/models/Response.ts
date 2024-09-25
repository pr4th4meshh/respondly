import mongoose, { Document, Schema } from "mongoose";

export interface IResponse extends Document {
  form: mongoose.Types.ObjectId; // Reference to the form
  responses: { label: string; answer: string }[]; // Array of response entries
}

const ResponseSchema: Schema = new Schema({
  form: { type: mongoose.Types.ObjectId, ref: "Form", required: true },
  responses: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
});

export default mongoose.models.Response || mongoose.model<IResponse>("Response", ResponseSchema);
