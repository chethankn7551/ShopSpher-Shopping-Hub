import { cart, loadFromLocalStorage } from "../data/cart.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";

loadFromLocalStorage();

function saveTolocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((Cartitem) => {
    if (productId === Cartitem.productId) {
      matchingItem = Cartitem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId: "1",
    });
  }

  saveTolocalStorage();
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  
  const cartQuantityElement = document.querySelector(".cart-quantity");
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

export function removeProductFromCart(productId) {
  const filteredCart = cart.filter(
    (cartItem) => cartItem.productId !== productId
  );
  cart.length = 0;
  cart.push(...filteredCart);

  saveTolocalStorage();
  renderOrderSummary();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((Cartitem) => {
    if (productId === Cartitem.productId) {
      matchingItem = Cartitem;
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
}