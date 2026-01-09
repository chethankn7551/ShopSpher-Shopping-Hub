import { updateCartQuantity } from "./cart.js";
import { formatCurrency } from "./utils/ProductPrice.js";
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
  // No order found or missing parameters
  trackingContainer.innerHTML = `
    <div class="tracking-error">
      <h2>Order Not Found</h2>
      <p>We couldn't find the tracking information for this order.</p>
      <a href="orders.html" class="button-primary">Back to Orders</a>
    </div>
  `;
} else {
  // Find the specific product in the order
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
    let statusMessage = '';
    
    if (daysSinceOrder >= 7) {
      currentStatus = 'Delivered';
      progressPercentage = 100;
      statusMessage = 'Your package has been delivered!';
    } else if (daysSinceOrder >= 3) {
      currentStatus = 'Shipped';
      progressPercentage = 50;
      statusMessage = 'Your package is on the way!';
    } else {
      currentStatus = 'Preparing';
      progressPercentage = 25;
      statusMessage = 'Your order is being prepared for shipment.';
    }
    
    trackingContainer.innerHTML = `
      <div class="tracking-header">
        <h1 class="tracking-title">Package Tracking</h1>
        <a class="back-to-orders-link link-primary" href="orders.html">
          ← View all orders
        </a>
      </div>

      <div class="tracking-content">
        <div class="order-summary-box">
          <div class="order-summary-item">
            <span class="label">Order Number:</span>
            <span class="value">#${order.orderNumber}</span>
          </div>
          <div class="order-summary-item">
            <span class="label">Order Date:</span>
            <span class="value">${order.orderDate}</span>
          </div>
          <div class="order-summary-item">
            <span class="label">Status:</span>
            <span class="value status-badge status-${currentStatus.toLowerCase()}">${currentStatus}</span>
          </div>
        </div>

        <div class="delivery-status">
          <div class="delivery-date-section">
            <div class="delivery-icon">📦</div>
            <div class="delivery-info">
              <div class="delivery-status-text">${statusMessage}</div>
              <div class="delivery-date">
                ${currentStatus === 'Delivered' ? 'Delivered on' : 'Estimated Delivery:'} <strong>${formattedDeliveryDate}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="tracking-progress-section">
          <h2 class="section-title">Tracking Progress</h2>
          
          <div class="progress-steps">
            <div class="progress-step ${currentStatus === 'Preparing' || currentStatus === 'Shipped' || currentStatus === 'Delivered' ? 'active completed' : ''}">
              <div class="step-icon">✓</div>
              <div class="step-label">Order Placed</div>
              <div class="step-date">${dayjs(orderDate).format('MMM D')}</div>
            </div>
            
            <div class="progress-line ${currentStatus === 'Shipped' || currentStatus === 'Delivered' ? 'completed' : ''}"></div>
            
            <div class="progress-step ${currentStatus === 'Shipped' || currentStatus === 'Delivered' ? 'active completed' : currentStatus === 'Preparing' ? 'active' : ''}">
              <div class="step-icon">${currentStatus === 'Shipped' || currentStatus === 'Delivered' ? '✓' : '🚚'}</div>
              <div class="step-label">In Transit</div>
              <div class="step-date">${daysSinceOrder >= 3 ? dayjs(orderDate).add(3, 'days').format('MMM D') : 'Pending'}</div>
            </div>
            
            <div class="progress-line ${currentStatus === 'Delivered' ? 'completed' : ''}"></div>
            
            <div class="progress-step ${currentStatus === 'Delivered' ? 'active completed' : ''}">
              <div class="step-icon">${currentStatus === 'Delivered' ? '✓' : '📍'}</div>
              <div class="step-label">Delivered</div>
              <div class="step-date">${currentStatus === 'Delivered' ? deliveryDate.format('MMM D') : deliveryDate.format('MMM D')}</div>
            </div>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progressPercentage}%">
              <span class="progress-percentage">${progressPercentage}%</span>
            </div>
          </div>
        </div>

        <div class="product-details-section">
          <h2 class="section-title">Product Details</h2>
          <div class="product-card">
            <img class="product-image" src="${product.image}" alt="${product.name}">
            <div class="product-info-details">
              <h3 class="product-name">${product.name}</h3>
              <div class="product-meta">
                <span class="product-quantity">Quantity: ${product.quantity}</span>
                <span class="product-price">$${formatCurrency(product.priceCents * product.quantity)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="tracking-actions">
          <a href="orders.html" class="button-secondary">Back to Orders</a>
          <a href="amazon.html" class="button-primary">Continue Shopping</a>
        </div>
      </div>
    `;
  }
}