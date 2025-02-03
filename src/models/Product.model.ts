import { InferSchemaType, Schema, model, models } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: { type: String, required: [true, "Description is required"] },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
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
      required: [true, "Price is required"],
    },
    colors: [
      {
        type: String,
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    mainPic: {
      type: String,
      required: [true, "mainPic is required"],
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

export type IProduct = InferSchemaType<typeof productSchema>

const Product = models.Product || model('Product', productSchema);
export default Product;
