import { InferSchemaType, Schema, model, models } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: { type: String, required: [true, 'Description is required'] },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      required: [true, 'A category is required'],
      ref: 'Tag',
    },
    sizes: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    volume: {
      type: String,
    },

    variation: {
      type: String,
    },

    discount: {
      type: Number,
      default: 0,
    },
    mainPic: {
      type: String,
      required: [true, 'mainPic is required'],
    },
    otherImages: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sales: { type: Number, default: 0 },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        comment: String,
      },
    ],
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof productSchema>;
export type IProduct = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Product = models.Product || model('Product', productSchema);
export default Product;
