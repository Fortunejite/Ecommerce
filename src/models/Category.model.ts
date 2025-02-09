import { InferSchemaType, Schema, model, models } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof categorySchema>;
export type ICategory = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Category = models.Category || model('Category', categorySchema);
export default Category;
