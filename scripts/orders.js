import { formatCurrency } from "./utils/ProductPrice.js";
import { updateCartQuantity } from "./cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

updateCartQuantity();

// Get orders from localStorage
const orders = JSON.parse(localStorage.getItem("orders")) || [];

const ordersGrid = document.querySelector(".js-orders-grid");

if (orders.length === 0) {
  ordersGrid.innerHTML = `
    <div class="no-orders-message">
      <p>You haven't placed any orders yet.</p>
      <a href="amazon.html" class="button-primary">Start Shopping</a>
    </div>
  `;
} else {
  let ordersHTML = "";

  // Display orders in reverse chronological order (newest first)
  [...orders].reverse().forEach((order) => {
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order #${order.orderNumber}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${order.items.map(item => {
            // Calculate estimated delivery date (7 days from order date)
            const orderDate = new Date(order.orderDate);
            const deliveryDate = dayjs(orderDate).add(7, 'days');
            const formattedDeliveryDate = deliveryDate.format('MMMM D');
            
            // Create tracking URL with order ID and product name
            const trackingUrl = `tracking.html?orderId=${order.orderNumber}&productName=${encodeURIComponent(item.name)}`;
            
            return `
              <div class="order-item-container">
                <div class="product-image-container">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="product-details-container">
                  <div class="product-name">${item.name}</div>
                  <div class="product-delivery-date">Arriving on: ${formattedDeliveryDate}</div>
                  <div class="product-quantity">Quantity: ${item.quantity}</div>
                  <div class="product-price">$${formatCurrency(item.priceCents * item.quantity)}</div>
                  <div class="product-actions">
                    <button class="buy-again-button" data-product-id="${item.productId || ''}">
                      Buy it again
                    </button>
                    <a href="${trackingUrl}" class="track-package-button">Track package</a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  ordersGrid.innerHTML = ordersHTML;
}