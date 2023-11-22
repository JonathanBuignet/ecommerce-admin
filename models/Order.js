const { Schema, model, models } = require('mongoose');

const OrderSchema = new Schema(
  {
    line_items: Object,
    email: String,
    firstName: String,
    lastName: String,
    streetAddress: String,
    postalCode: String,
    city: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Order = models?.Order || model('Order', OrderSchema);
