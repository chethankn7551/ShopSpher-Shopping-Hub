import { products } from "../data/products.js";
import { addToCart } from "./cart.js";
import { updateCartQuantity } from "./cart.js";
import { formatCurrency } from "./utils/ProductPrice.js";

let filteredProducts = [...products];

function renderProducts(productsToRender) {
  let productsHtml = "";

  productsToRender.forEach((product) => {
    productsHtml += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="rating">
            <div class="rating-dots">
              ${[1,2,3,4,5].map((i) => {
                const filled = product.rating.stars >= i;
                return `<span class="dot ${filled ? 'filled' : ''}"></span>`;
              }).join("")}
            </div>

            <div class="rating-meta">
              <span class="rating-value">${product.rating.stars.toFixed(1)}</span>
              <span class="rating-separator">·</span>
              <span class="rating-count">${product.rating.count}</span>
            </div>
          </div>

          <div class="product-price">
            $${formatCurrency(product.priceCents)}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>
          <div class="added-message js-added-message">
            Added
          </div>

          <button 
            class="add-to-cart-button button-primary" 
            data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
  });

  document.querySelector(".js-products-grid").innerHTML = productsHtml;

  /* -------------------------------
     Add to Cart Handlers
  -------------------------------- */

  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      const card = button.closest(".product-container");
      const quantitySelector = card.querySelector(
        `.js-quantity-selector-${productId}`
      );
      const addedMessage = card.querySelector(".js-added-message");

      const quantity = Number(quantitySelector.value);

      addToCart(productId, quantity);
      updateCartQuantity();

      if (!addedMessage) return;

      addedMessage.style.display = "inline-flex";
      addedMessage.style.opacity = "1";
      if (addedMessage.hideTimer) {
        clearTimeout(addedMessage.hideTimer);
      }

      addedMessage.hideTimer = setTimeout(() => {
        addedMessage.style.opacity = "0";

        setTimeout(() => {
          addedMessage.style.display = "none";
        }, 300);
      }, 1800);
    });
  });
}

/* -------------------------------
   Search Logic
-------------------------------- */

const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");

let suggestionsContainer = null;

if (searchBar && searchButton) {
  suggestionsContainer = document.createElement("div");
  suggestionsContainer.className = "search-suggestions";

  const searchWrapper = searchBar.closest(".shop-search");
  searchWrapper.appendChild(suggestionsContainer);
}

function getSuggestions(query) {
  if (!query.trim()) return [];

  const suggestions = new Set();
  const queryLower = query.toLowerCase();

  products.forEach((product) => {
    if (product.name.toLowerCase().includes(queryLower)) {
      suggestions.add(product.name);
    }

    product.keywords.forEach((keyword) => {
      if (keyword.toLowerCase().includes(queryLower)) {
        suggestions.add(keyword);
      }
    });
  });

  return Array.from(suggestions).slice(0, 8);
}

function showSuggestions(suggestions) {
  if (suggestions.length === 0) {
    suggestionsContainer.style.display = "none";
    return;
  }

  let suggestionsHTML = "";
  suggestions.forEach((suggestion) => {
    suggestionsHTML += `
      <div class="suggestion-item" data-suggestion="${suggestion}">
        <img src="images/icons/search-icon.png" class="suggestion-icon">
        <span>${suggestion}</span>
      </div>
    `;
  });

  suggestionsContainer.innerHTML = suggestionsHTML;
  suggestionsContainer.style.display = "block";

  document.querySelectorAll(".suggestion-item").forEach((item) => {
    item.addEventListener("click", () => {
      const suggestion = item.dataset.suggestion;
      searchBar.value = suggestion;
      performSearch();
      suggestionsContainer.style.display = "none";
    });
  });
}

function performSearch() {
  const searchQuery = searchBar.value.toLowerCase().trim();

  if (!searchQuery) {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(searchQuery);
      const matchesKeywords = product.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchQuery)
      );
      return matchesName || matchesKeywords;
    });
  }

  renderProducts(filteredProducts);
  suggestionsContainer.style.display = "none";
}

searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim();

  if (!query) {
    filteredProducts = [...products];
    renderProducts(filteredProducts);
    suggestionsContainer.style.display = "none";
    return;
  }

  showSuggestions(getSuggestions(query));
});


searchBar.addEventListener("focus", () => {
  const query = searchBar.value;
  if (query.trim()) {
    showSuggestions(getSuggestions(query));
  }
});

document.addEventListener("click", (event) => {
  if (
    !searchBar.contains(event.target) &&
    !suggestionsContainer.contains(event.target)
  ) {
    suggestionsContainer.style.display = "none";
  }
});

searchButton.addEventListener("click", performSearch);

searchBar.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    performSearch();
  }
});

/* -------------------------------
   Initial Load
-------------------------------- */

updateCartQuantity();
renderProducts(products);
