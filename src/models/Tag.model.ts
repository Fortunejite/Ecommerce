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

export type ITag = InferSchemaType<typeof tagSchema>

const Tag = models.Tag || model('Tag', tagSchema);
export default Tag;