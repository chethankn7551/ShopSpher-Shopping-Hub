import { updateCartQuantity } from "./cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

updateCartQuantity();

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const productName = urlParams.get('productName');

// Get orders from localStorage
const orders = JSON.parse(localStorage.getItem("orders")) || [];

// Find the order
const order = orders.find(o => o.orderNumber.toString() === orderId);

const trackingContainer = document.querySelector(".js-order-tracking");

if (!order || !productName) {
  trackingContainer.innerHTML = `
    <div class="tracking-error">
      <h2>Order Not Found</h2>
      <p>We couldn't find the tracking information for this order.</p>
      <a href="orders.html" class="button-primary">Back to Orders</a>
    </div>
  `;
} else {
  const product = order.items.find(item => item.name === productName);
  
  if (!product) {
    trackingContainer.innerHTML = `
      <div class="tracking-error">
        <h2>Product Not Found</h2>
        <p>We couldn't find this product in your order.</p>
        <a href="orders.html" class="button-primary">Back to Orders</a>
      </div>
    `;
  } else {
    // Calculate delivery date (7 days from order date)
    const orderDate = new Date(order.orderDate);
    const deliveryDate = dayjs(orderDate).add(7, 'days');
    const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');
    
    // Calculate current progress
    const today = dayjs();
    const daysSinceOrder = today.diff(dayjs(orderDate), 'days');
    
    let currentStatus = 'Preparing';
    let progressPercentage = 0;
    
    if (daysSinceOrder >= 7) {
      currentStatus = 'Delivered';
      progressPercentage = 100;
    } else if (daysSinceOrder >= 3) {
      currentStatus = 'Shipped';
      progressPercentage = 50;
    } else {
      currentStatus = 'Preparing';
      progressPercentage = 25;
    }
    
    trackingContainer.innerHTML = `
      <div class="tracking-header">
        <h1>Package Tracking</h1>
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>
      </div>

      <div class="delivery-date">
        Arriving on ${formattedDeliveryDate}
      </div>

      <div class="product-info">
        ${product.name}
      </div>

      <div class="product-info">
        Quantity: ${product.quantity}
      </div>

      <img class="product-image" src="${product.image}" alt="${product.name}">

      <div class="progress-labels-container">
        <div class="progress-label ${currentStatus === 'Preparing' || currentStatus === 'Shipped' || currentStatus === 'Delivered' ? 'completed' : ''}">
          Preparing
        </div>
        <div class="progress-label ${currentStatus === 'Shipped' ? 'current-status' : ''} ${currentStatus === 'Shipped' || currentStatus === 'Delivered' ? 'completed' : ''}">
          Shipped
        </div>
        <div class="progress-label ${currentStatus === 'Delivered' ? 'current-status completed' : ''}">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${progressPercentage}%"></div>
      </div>
    `;
  }
}