import { InferSchemaType, Schema, Types, model, models } from 'mongoose';

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, default: 1, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof cartSchema>;
export type ICart = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Cart = models.Cart || model('Cart', cartSchema);
export default Cart;
