import { cart, loadFromLocalStorage } from "../data/cart.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";

loadFromLocalStorage();

function saveTolocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1",
    });
  }

  saveTolocalStorage();
}

export function updateCartQuantity() {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

  let cartQuantity = 0;
  storedCart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  const cartQuantityElements = document.querySelectorAll(".cart-quantity");
  if (!cartQuantityElements || cartQuantityElements.length === 0) return;

  cartQuantityElements.forEach((el) => {
    el.innerHTML = cartQuantity;
    el.style.display = cartQuantity > 0 ? "flex" : "none";
  });
}

export function removeProductFromCart(productId) {
  const filteredCart = cart.filter(
    (cartItem) => cartItem.productId !== productId
  );

  cart.length = 0;
  cart.push(...filteredCart);

  saveTolocalStorage();
  renderOrderSummary();
  updateCartQuantity();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveTolocalStorage();
  }
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveTolocalStorage();
  }

  updateCartQuantity();
}
