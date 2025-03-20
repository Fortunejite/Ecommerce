import { InferSchemaType, Schema, model, models } from 'mongoose';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof brandSchema>;
export type IBrand = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Brand = models.Brand || model('Brand', brandSchema);
export default Brand;
