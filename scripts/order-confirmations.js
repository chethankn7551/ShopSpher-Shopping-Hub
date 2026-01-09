import { formatCurrency } from "./utils/ProductPrice.js";
import { updateCartQuantity } from "./cart.js";

updateCartQuantity();

// Get the last order from localStorage
const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));

if (lastOrder) {
  const orderDetailsHTML = `
    <div class="order-info">
      <div class="order-info-row">
        <span class="order-info-label">Order Number:</span>
        <span class="order-info-value">#${lastOrder.orderNumber}</span>
      </div>
      <div class="order-info-row">
        <span class="order-info-label">Order Date:</span>
        <span class="order-info-value">${lastOrder.orderDate}</span>
      </div>
      <div class="order-info-row">
        <span class="order-info-label">Total Amount:</span>
        <span class="order-info-value order-total">$${formatCurrency(lastOrder.totalCents)}</span>
      </div>
      <div class="order-info-row">
        <span class="order-info-label">Items:</span>
        <span class="order-info-value">${lastOrder.itemCount} item(s)</span>
      </div>
    </div>
    
    <div class="order-items">
      <h2>Order Items:</h2>
      ${lastOrder.items.map(item => `
        <div class="order-item">
          <img src="${item.image}" alt="${item.name}" class="order-item-image">
          <div class="order-item-details">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-info">
              <span>Quantity: ${item.quantity}</span>
              <span class="order-item-price">$${formatCurrency(item.priceCents * item.quantity)}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.querySelector(".js-order-details").innerHTML = orderDetailsHTML;
} else {
  document.querySelector(".js-order-details").innerHTML = `
    <p class="no-order-message">No order information found. Please place an order first.</p>
  `;
}