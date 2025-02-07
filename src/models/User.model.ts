import { InferSchemaType, Schema, model, models } from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"]
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      min: [6, 'Must be atleast 6 characters'],
      required: true,
    },
    avatar: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    favourite: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.name = this.name.trim();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export type IUser = InferSchemaType<typeof userSchema>

const User = models.User || model('User', userSchema);
export default User;
