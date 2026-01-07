import { cart } from "../../data/cart.js";
import { getDeliveryOption } from "../utils/getDeliveryOption.js";
import { getProduct } from "../utils/getProducts.js";
import { formatCurrency } from "../utils/ProductPrice.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let quantity = 0;
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    quantity += cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalAfterTaxCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHtml = `
    <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${quantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(
              productPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              shippingPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalBeforeTaxCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(
              taxCents
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalAfterTaxCents
            )}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;

  document.querySelector(".payment-summary").innerHTML = paymentSummaryHtml;
}
