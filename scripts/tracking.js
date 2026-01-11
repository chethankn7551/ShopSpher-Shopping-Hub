import { updateCartQuantity } from "./cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

updateCartQuantity();

const trackingContainer = document.querySelector(".js-order-tracking");

// -----------------------------
// Read URL params
// -----------------------------
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");
const productName = params.get("productName");

// -----------------------------
// Load orders
// -----------------------------
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const order = orders.find(
  (o) => o.orderNumber.toString() === orderId
);

// -----------------------------
// Validate + Render
// -----------------------------
if (!order || !productName) {
  showError("Order not found.");
} else {
  const product = order.items.find(
    (item) => item.name === productName
  );

  if (!product) {
    showError("Product not found in this order.");
  } else {
    renderTracking(order, product);
  }
}

// -----------------------------
// UI Functions
// -----------------------------
function renderTracking(order, product) {
  const orderDate = dayjs(order.orderDate);
  const deliveryDate = orderDate.add(7, "days");

  const today = dayjs();
  const daysSinceOrder = today.diff(orderDate, "day");

  let status = "Preparing";
  let progress = 25;

  if (daysSinceOrder >= 7) {
    status = "Delivered";
    progress = 100;
  } else if (daysSinceOrder >= 3) {
    status = "Shipped";
    progress = 60;
  }

  trackingContainer.innerHTML = `
    <div class="tracking-card-header">
      <a href="orders.html" class="back-to-orders-link">
        ← Back to Orders
      </a>
    </div>

    <div class="delivery-date">
      Arriving on ${deliveryDate.format("dddd, MMMM D")}
    </div>

    <div class="product-info">${product.name}</div>
    <div class="product-info">Quantity: ${product.quantity}</div>

    <img
      class="product-image"
      src="${product.image}"
      alt="${product.name}"
    />

    <div class="progress-labels-container">
      <div class="progress-label ${
        status !== "Preparing" ? "completed" : "current"
      }">Preparing</div>

      <div class="progress-label ${
        status === "Shipped" || status === "Delivered"
          ? status === "Shipped"
            ? "current"
            : "completed"
          : ""
      }">Shipped</div>

      <div class="progress-label ${
        status === "Delivered" ? "current completed" : ""
      }">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width:${progress}%"></div>
    </div>
  `;
}

function showError(message) {
  trackingContainer.innerHTML = `
    <div class="tracking-error">
      <h2>${message}</h2>
      <p>Please check your order and try again.</p>
      <a href="orders.html" class="button-primary">
        Back to Orders
      </a>
    </div>
  `;
}
