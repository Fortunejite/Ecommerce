import { InferSchemaType, Schema, model, models } from 'mongoose';

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof tagSchema>;
export type ITag = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Tag = models.Tag || model('Tag', tagSchema);
export default Tag;