import { ICart } from '@/models/Cart.model';
import { IProduct } from '@/models/Product.model';

export const calculateTotalAmount = (items: ICart['items']) =>
  items.reduce((acc, item) => {
    return acc + (item.product as IProduct).price * item.quantity;
  }, 0);

export const calculateTotalItems = (items: ICart['items']) =>
  items.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
