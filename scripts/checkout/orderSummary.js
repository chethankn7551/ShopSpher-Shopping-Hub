import { cart } from "../../data/cart.js";
import { deliverOptions } from "../../data/deliveryOptions.js";
import { removeProductFromCart, updateDeliveryOption, updateQuantity } from "../cart.js";
import { getDeliveryOption } from "../utils/getDeliveryOption.js";
import { getProduct } from "../utils/getProducts.js";
import { formatCurrency } from "../utils/ProductPrice.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartHtml = "";

  // Update the checkout header item count and cart quantity on load
  updateCheckoutHeader();

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    cartHtml += `
        <div class="cart-item-container js-cart-item-container-${
          matchingProduct.id
        }">
            <div class="delivery-date">Delivery date: ${dateString(
              deliveryOption.deliveryDays
            )}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )} </div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${
                    cartItem.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${
                    matchingProduct.id
                  }">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Save
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-btn" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHtml(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `;

    function dateString(deliveryOptionDays) {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOptionDays, "days");
      const formattedDate = deliveryDate.format("dddd, MMMM D");
      return formattedDate;
    }

    function deliveryOptionsHtml(matchingProduct, cartItem) {
      let html = "";
      deliverOptions.forEach((deliveryOption) => {
        const priceString =
          deliveryOption.priceCents === 0
            ? "FREE"
            : `$${formatCurrency(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `
      <div class="delivery-option js-delivery-option" data-product-id=${
        matchingProduct.id
      } data-delivery-option-id=${deliveryOption.id}>
          <input
           ${isChecked ? "checked" : ""}
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}"
          />
          <div>
            <div class="delivery-option-date">${dateString(
              deliveryOption.deliveryDays
            )}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
      </div>
      `;
      });

      return html;
    }
  });

  document.querySelector(".order-summary").innerHTML = cartHtml;

  // Delete button functionality
  document.querySelectorAll(".js-delete-btn").forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const productId = deleteButton.dataset.productId;
      removeProductFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      renderPaymentSummary();
    });
  });

  // Update button functionality (14f)
  document.querySelectorAll(".js-update-link").forEach((updateLink) => {
    updateLink.addEventListener("click", () => {
      const productId = updateLink.dataset.productId;
      console.log(productId);

      // 14h: Add the is-editing-quantity class to show input and save link
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });

  // Save button functionality
  document.querySelectorAll(".js-save-link").forEach((saveLink) => {
    saveLink.addEventListener("click", () => {
      const productId = saveLink.dataset.productId;
      
      // Get the new quantity from the input
      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);
      
      // Update the quantity in the cart
      if (newQuantity > 0 && newQuantity < 1000) {
        updateQuantity(productId, newQuantity);
        
        // Re-render to show updated quantity
        renderOrderSummary();
        renderPaymentSummary();
      }
    });
  });

  // Delivery option functionality
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function updateCheckoutHeader() {
  let totalItems = 0;
  cart.forEach((cartItem) => {
    totalItems += cartItem.quantity;
  });
  
  document.querySelector(".return-to-home-link").innerHTML = `${totalItems} items`;
  
  // Update cart quantity if the element exists (for the cart icon in header)
  const cartQuantityElement = document.querySelector(".cart-quantity");
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = totalItems;
  }
}