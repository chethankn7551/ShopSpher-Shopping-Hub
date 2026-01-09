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

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
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

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary" data-product-id="${
            product.id
          }">
            Add to Cart
          </button>
        </div>`;
  });

  document.querySelector(".js-products-grid").innerHTML = productsHtml;

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );
      const quantity = Number(quantitySelector.value);

      addToCart(productId, quantity);
      updateCartQuantity();

      // Show "Added to Cart" message
      const addedMessage = document.querySelector(
        `.js-added-to-cart-${productId}`
      );
      addedMessage.style.opacity = "1";

      setTimeout(() => {
        addedMessage.style.opacity = "0";
      }, 2000);
    });
  });
}

// Search functionality with suggestions
const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");

// Create suggestions dropdown
const suggestionsContainer = document.createElement("div");
suggestionsContainer.className = "search-suggestions";
searchBar.parentElement.appendChild(suggestionsContainer);

function getSuggestions(query) {
  if (!query.trim()) {
    return [];
  }

  const suggestions = new Set();
  const queryLower = query.toLowerCase();

  products.forEach((product) => {
    // Add matching product names
    if (product.name.toLowerCase().includes(queryLower)) {
      suggestions.add(product.name);
    }

    // Add matching keywords
    product.keywords.forEach((keyword) => {
      if (keyword.toLowerCase().includes(queryLower)) {
        suggestions.add(keyword);
      }
    });
  });

  return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
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

  // Add click handlers to suggestions
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

  if (searchQuery === "") {
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

// Search bar input event for suggestions
searchBar.addEventListener("input", () => {
  const query = searchBar.value;
  const suggestions = getSuggestions(query);
  showSuggestions(suggestions);
});

// Search bar focus event
searchBar.addEventListener("focus", () => {
  const query = searchBar.value;
  if (query.trim()) {
    const suggestions = getSuggestions(query);
    showSuggestions(suggestions);
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", (event) => {
  if (!searchBar.contains(event.target) && !suggestionsContainer.contains(event.target)) {
    suggestionsContainer.style.display = "none";
  }
});

searchButton.addEventListener("click", performSearch);

searchBar.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    performSearch();
  }
});

// Initial render and cart quantity update
updateCartQuantity();
renderProducts(products);