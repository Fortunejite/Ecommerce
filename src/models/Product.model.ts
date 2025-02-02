import { Schema, model, models } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
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
      required: true,
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
      required: true,
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

const Product = models.Product || model('Product', productSchema);
export default Product;
