import { deliverOptions } from "../../data/deliveryOptions.js";

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliverOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption;
}