import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { updateCartQuantity } from "./cart.js";
import { cart } from "../data/cart.js";
import { getProduct } from "./utils/getProducts.js";
import { getDeliveryOption } from "./utils/getDeliveryOption.js";
import { requireAuth } from "./auth/auth.js";

// Update cart quantity on page load
requireAuth();
updateCartQuantity();
toggleCheckoutUI();

/* ----------------------------------
   Toggle Checkout UI
---------------------------------- */
export function toggleCheckoutUI() {
  const emptyState = document.querySelector(".js-empty-cart");
  const checkoutGrid = document.querySelector(".js-checkout-grid");
  const checkoutCount = document.querySelector(".js-checkout-count");

  const totalItems = (cart || []).reduce((sum, item) => sum + item.quantity, 0);

  if (checkoutCount) {
    checkoutCount.innerText = `${totalItems} items`;
  }

  if (!emptyState || !checkoutGrid) return;

  if (cart.length === 0) {
    emptyState.style.display = "block";
    checkoutGrid.style.display = "none";
  } else {
    emptyState.style.display = "none";
    checkoutGrid.style.display = "grid";

    renderOrderSummary();
    renderPaymentSummary();
  }
}

/* ----------------------------------
   Place Order
---------------------------------- */
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let productPriceCents = 0;
  let shippingPriceCents = 0;
  const orderItems = [];

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    productPriceCents += product.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryOption.priceCents;

    orderItems.push({
      productId: cartItem.productId,
      name: product.name,
      image: product.image,
      quantity: cartItem.quantity,
      priceCents: product.priceCents,
    });
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  const order = {
    orderNumber: Date.now(),
    orderDate: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    totalCents,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    items: orderItems,
  };

  // Save order
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("lastOrder", JSON.stringify(order));

  cart.length = 0;
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartQuantity();
  toggleCheckoutUI();

  window.location.href = "order-confirmation.html";
}

/* ----------------------------------
   Event Delegation
---------------------------------- */
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("place-order-button")) {
    placeOrder();
  }
});
