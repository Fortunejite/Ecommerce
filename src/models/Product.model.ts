import { Concentrations, Category } from '@/lib/perfumeDetails';
import { InferSchemaType, Schema, model, models } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: { type: String },
    brand: {
      type: Schema.Types.ObjectId,
      required: [true, 'A Brand is required'],
      ref: 'Brand',
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
      required: [true, 'Gender is required'],
    },
    concentration: {
      type: String,
      enum: Concentrations,
      required: [true, 'Concentration is required'],
    },
    category: {
      type: String,
      enum: Category,
      required: [true, 'Category is required'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    size: {
      type: Number,
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
