import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { updateCartQuantity } from "./cart.js";
import { cart } from "../data/cart.js";
import { getProduct } from "./utils/getProducts.js";
import { getDeliveryOption } from "./utils/getDeliveryOption.js";

// Update cart quantity on page load
updateCartQuantity();

renderOrderSummary();
renderPaymentSummary();

// Place order function
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Calculate totals
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  const orderItems = [];

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    
    productPriceCents += product.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryOption.priceCents;
    
    orderItems.push({
      name: product.name,
      image: product.image,
      quantity: cartItem.quantity,
      priceCents: product.priceCents
    });
  });

  // Calculate totals
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  // Create order object
  const order = {
    orderNumber: Date.now(),
    orderDate: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    totalCents: totalCents,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    items: orderItems
  };

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("lastOrder", JSON.stringify(order));

  // Clear cart
  cart.length = 0;
  localStorage.setItem("cart", JSON.stringify(cart));

  // Redirect to order confirmation page
  window.location.href = "order-confirmation.html";
}

// Use event delegation to handle dynamically added button
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("place-order-button")) {
    placeOrder();
  }
});