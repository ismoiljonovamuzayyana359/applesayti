
const cart = [];

// ELEMENTS
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const searchBtn = document.getElementById("searchBtn");
const searchPanel = document.getElementById("searchPanel");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

// PRICE FORMAT
function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

// CART OPEN
function openCart() {
  cartDrawer.classList.add("active");
  overlay.classList.add("active");
}

// CART CLOSE
function hideCart() {
  cartDrawer.classList.remove("active");
  overlay.classList.remove("active");
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
overlay.addEventListener("click", hideCart);

// ADD PRODUCT
document.querySelectorAll(".buy-btn").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        name,
        price,
        quantity: 1
      });
    }

    updateCart();

    const oldText = button.textContent;
    button.textContent = "Qo'shildi ✓";

    setTimeout(() => {
      button.textContent = oldText;
    }, 1000);
  });
});

// UPDATE CART
function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Savatchangiz hozircha bo\'sh.</p>';
  }

  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const element = document.createElement("div");
    element.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const title = document.createElement("h4");
    title.textContent = item.name;

    const price = document.createElement("p");
    price.textContent =
      formatPrice(item.price) + " × " + item.quantity;

    info.append(title, price);

    const remove = document.createElement("button");
    remove.className = "remove-btn";
    remove.textContent = "✕";
    remove.setAttribute("aria-label", item.name + " ni o'chirish");

    remove.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });

    element.append(info, remove);
    cartItems.appendChild(element);
  });

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
}

// SEARCH OPEN
searchBtn.addEventListener("click", () => {
  searchPanel.classList.toggle("active");

  if (searchPanel.classList.contains("active")) {
    searchInput.focus();
  }
});

// SEARCH CLOSE
closeSearch.addEventListener("click", () => {
  searchPanel.classList.remove("active");
  searchInput.value = "";
  filterProducts("");
});

// SEARCH PRODUCTS
function filterProducts(value) {
  const products = document.querySelectorAll(".product-card");
  const query = value.toLowerCase().trim();

  let found = 0;

  products.forEach(product => {
    const name = product.dataset.name.toLowerCase();
    const match = name.includes(query);

    product.style.display = match ? "" : "none";

    if (match) found++;
  });

  document.getElementById("noResults").hidden = found !== 0;
}

searchInput.addEventListener("input", event => {
  filterProducts(event.target.value);
});

// MOBILE MENU
menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");

  menuBtn.textContent =
    navLinks.classList.contains("active") ? "✕" : "☰";
});

// CLOSE MOBILE MENU AFTER CLICK
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuBtn.textContent = "☰";
  });
});

// CHECKOUT
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Savatchangiz bo'sh!");
    return;
  }

  alert(
    "Buyurtmangiz tayyor!\n" +
    "Jami: " + cartTotal.textContent +
    "\n\nBuyurtmani rasmiylashtirish uchun backend va to'lov tizimi ulanishi kerak."
  );
});

// ESCAPE KEY
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    hideCart();
    searchPanel.classList.remove("active");
    navLinks.classList.remove("active");
    menuBtn.textContent = "☰";
  }
});
