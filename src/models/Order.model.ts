import { InferSchemaType, Schema, model, models } from 'mongoose';

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enem: ['card', 'paypal', 'crypto', 'cash'],
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof orderSchema>;
export type IOrder = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Order = models.Order || model('Order', orderSchema);
export default Order;
