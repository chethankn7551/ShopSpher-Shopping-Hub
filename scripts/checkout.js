import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { updateCartQuantity } from "./cart.js";

// Update cart quantity on page load
updateCartQuantity();

renderOrderSummary();
renderPaymentSummary();
