import { InferSchemaType, Schema, model, models } from 'mongoose';

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'canceled'],
      default: 'processing',
    },
    paymentMethod: {
      type: String,
      enem: ['paystack', 'cash'],
      required: true,
    },
    paymentReference: {
      type: String,
      unique: [true, 'Payment Reference must be unique'],
    },
    shipmentInfo: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
      },
      phoneNumber: {
        type: String,
        required: [true, 'Phone is required'],
      },
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
