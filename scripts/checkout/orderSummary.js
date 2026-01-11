import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliverOptions } from "../../data/deliveryOptions.js";
import {
  removeProductFromCart,
  updateDeliveryOption,
  updateQuantity,
} from "../cart.js";
import { formatCurrency } from "../utils/ProductPrice.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { toggleCheckoutUI } from "../checkout.js";

/* ----------------------------------
   Helpers
---------------------------------- */

function dateString(deliveryDays) {
  return dayjs().add(deliveryDays, "days").format("dddd, MMMM D");
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getDeliveryOption(deliveryOptionId) {
  return deliverOptions.find((option) => option.id === deliveryOptionId);
}

/* ----------------------------------
   Render Order Summary
---------------------------------- */

export function renderOrderSummary() {
  let cartHtml = "";

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    cartHtml += `
      <div class="delivery-date">
        Delivery date: ${dateString(deliveryOption.deliveryDays)}
      </div>

      <div class="cart-item-container">
        <img
          class="product-image"
          src="${product.image}"
        />

        <div class="cart-item-details">
          <div class="product-name">
            ${product.name}
          </div>

          <div class="product-price">
            $${formatCurrency(product.priceCents)}
          </div>

          <div class="product-quantity">
            <span>
              Quantity: 
              <span class="quantity-label">${cartItem.quantity}</span>
            </span>

            <span
              class="update-link link-primary js-update-link"
              data-product-id="${product.id}"
            >
              Update
            </span>

            <input
              class="quantity-input js-quantity-input-${product.id}"
              type="number"
              min="1"
              value="${cartItem.quantity}"
              style="display:none;"
            />

            <span
              class="save-link link-primary js-save-link"
              data-product-id="${product.id}"
              style="display:none;"
            >
              Save
            </span>


            <span
              class="delete-link link-primary js-delete-link"
              data-product-id="${product.id}"
            >
              Delete
            </span>
          </div>
        </div>
      </div>

      <div class="delivery-options">
        ${deliverOptions
          .map((option) => {
            const isChecked = option.id === cartItem.deliveryOptionId;

            return `
              <label class="delivery-option">
                <input
                  type="radio"
                  ${isChecked ? "checked" : ""}
                  name="delivery-option-${product.id}"
                  data-product-id="${product.id}"
                  data-delivery-option-id="${option.id}"
                />

                <div>
                  <div>
                    ${dateString(option.deliveryDays)}
                  </div>
                  <div>
                    ${
                      option.priceCents === 0
                        ? "FREE Shipping"
                        : `$${formatCurrency(option.priceCents)} - Shipping`
                    }
                  </div>
                </div>
              </label>
            `;
          })
          .join("")}
      </div>
    `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartHtml;

  /* ----------------------------------
     Event Listeners
  ---------------------------------- */

  // Delete product
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeProductFromCart(productId);
      renderOrderSummary();
      toggleCheckoutUI()
    });
  });

  // Update quantity
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const input = document.querySelector(`.js-quantity-input-${productId}`);

      const saveBtn = document.querySelector(
        `.js-save-link[data-product-id="${productId}"]`
      );

      // Show input and save button
      input.style.display = "inline-block";
      saveBtn.style.display = "inline-block";

      input.focus();
    });
  });

  // Save quantity
  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const input = document.querySelector(`.js-quantity-input-${productId}`);

      const newQuantity = Number(input.value);

      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
        renderOrderSummary();
        renderPaymentSummary();
      }
    });
  });

  // Delivery option change
  document.querySelectorAll(".delivery-option input").forEach((input) => {
    input.addEventListener("change", () => {
      const { productId, deliveryOptionId } = input.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
