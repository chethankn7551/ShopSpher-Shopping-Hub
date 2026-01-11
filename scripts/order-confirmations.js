import { formatCurrency } from "./utils/ProductPrice.js";
import { updateCartQuantity } from "./cart.js";

updateCartQuantity();

// Get last order from localStorage
const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
const orderDetailsContainer = document.querySelector(".js-order-details");

if (!orderDetailsContainer) {
  console.warn("Order details container not found");
} else if (!lastOrder) {
  // No order found
  orderDetailsContainer.innerHTML = `
    <p class="no-order-message">
      No order information found. Please place an order first.
    </p>
  `;
} else {
  const orderDetailsHTML = `
    <div class="order-info">
      <div class="order-info-row">
        <span class="order-info-label">Order ID:</span>
        <span class="order-info-value">#${lastOrder.orderNumber}</span>
      </div>
    </div>
  `;

  orderDetailsContainer.innerHTML = orderDetailsHTML;
}
