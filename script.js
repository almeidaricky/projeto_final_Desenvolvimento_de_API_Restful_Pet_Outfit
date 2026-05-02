const API_BASE = "http://localhost:8083/api";

const HIDDEN_PRODUCTS = [
  "Gravata Borboleta Velvet",
  "Touca Minimalista",
  "Vestido Rosa Fosco",
];

const DISPLAY_CATEGORIES = ["Todos", "Cães", "Gatos", "Coelhos"];

const state = {
  categories: [],
  products: [],
  filtered: [],
  activeCategory: "Todos",
  searchTerm: "",
  cart: JSON.parse(localStorage.getItem("petOutfitCart") || "[]"),
  selectedProduct: null,
};

const categoryChips = document.getElementById("categoryChips");
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalAddBtn = document.getElementById("modalAddBtn");

document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);

overlay.addEventListener("click", () => {
  closeCart();
  closeModal();
});

searchInput.addEventListener("input", (event) => {
  state.searchTerm = event.target.value.trim().toLowerCase();
  renderAll();
});

modalAddBtn.addEventListener("click", () => {
  if (state.selectedProduct) {
    addToCart(state.selectedProduct);
    closeModal();
    openCart();
  }
});

async function bootstrap() {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${API_BASE}/categories`),
      fetch(`${API_BASE}/products`),
    ]);

    if (!categoriesRes.ok) {
      throw new Error("Falha ao carregar categorias");
    }

    if (!productsRes.ok) {
      throw new Error("Falha ao carregar produtos");
    }

    state.categories = await categoriesRes.json();
    state.products = await productsRes.json();

    renderCategories();
    renderAll();
    renderCart();
  } catch (error) {
    console.error(error);
    productGrid.innerHTML = `
      <div class="card" style="grid-column:1/-1;padding:24px">
        <h4>Não foi possível carregar a API</h4>
        <p>Verifique se o Spring Boot está rodando na porta 8083 e se o backend respondeu corretamente.</p>
      </div>
    `;
  }
}

function money(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
}

function safeText(value) {
  return (value ?? "").toString().trim();
}

function resolveImage(product) {
  const src = safeText(product.imageUrl);

  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("./") ||
    src.startsWith("/") ||
    src.startsWith("images/")
  ) {
    return src;
  }

  const animal = safeText(product.animalType).toLowerCase();
  const category = safeText(product.category?.name).toLowerCase();

  if (animal.includes("cão") || category.includes("cão") || animal.includes("cachorro")) return "images/dog-01.jpg";
  if (animal.includes("gato") || category.includes("gato")) return "images/cat-01.jpg";
  if (animal.includes("coelho") || category.includes("coelho")) return "images/rabbit-01.jpg";

  return "images/exotic-01.jpg";
}

function isHiddenProduct(product) {
  return HIDDEN_PRODUCTS.includes(product.name);
}

function renderCategories() {
  categoryChips.innerHTML = DISPLAY_CATEGORIES.map((name) => {
    const active = name === state.activeCategory ? "active" : "";
    return `<button class="chip ${active}" data-category="${name}">${name}</button>`;
  }).join("");

  categoryChips.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      renderCategories();
      renderAll();
    });
  });
}

function getVisibleProducts() {
  return state.products.filter((product) => {
    if (isHiddenProduct(product)) return false;

    const productCategory = safeText(product.category?.name || product.animalType || "");

    if (productCategory !== "Cães" && productCategory !== "Gatos" && productCategory !== "Coelhos") {
      return false;
    }

    const matchesCategory =
      state.activeCategory === "Todos" || productCategory === state.activeCategory;

    const text = [
      product.name,
      product.description,
      product.animalType,
      productCategory,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !state.searchTerm || text.includes(state.searchTerm);

    return matchesCategory && matchesSearch && product.active !== false;
  });
}

function renderAll() {
  state.filtered = getVisibleProducts();

  const visible = state.filtered;

  productGrid.innerHTML = renderCards(visible);

  bindCardEvents(productGrid);

  if (visible.length === 0) {
    productGrid.innerHTML = `
      <div class="card" style="grid-column:1/-1;padding:24px">
        <p>Nenhum produto encontrado com esse filtro.</p>
      </div>
    `;
  }
}

function renderCards(products) {
  return products.map((product) => {
    const image = resolveImage(product);
    const categoryName = product.category?.name || product.animalType || "Sem categoria";

    return `
      <article class="card" data-id="${product.id}">
        <div class="card-image">
          <img src="${image}" alt="${safeText(product.name)}" loading="lazy" />
          <span class="badge">${safeText(categoryName)}</span>
        </div>
        <div class="card-body">
          <h4>${safeText(product.name)}</h4>
          <p>${safeText(product.description)}</p>
          <div class="card-meta">
            <span class="price">${money(product.price)}</span>
            <div style="display:flex;gap:8px">
              <button class="small-btn view-btn" data-action="view" data-id="${product.id}">Ver</button>
              <button class="small-btn primary add-btn" data-action="add" data-id="${product.id}">+ Sacola</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function bindCardEvents(container) {
  container.querySelectorAll("[data-action='add']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const product = state.products.find((item) => String(item.id) === button.dataset.id);
      if (product && !isHiddenProduct(product) && isAllowedCategory(product)) {
        addToCart(product);
      }
    });
  });

  container.querySelectorAll("[data-action='view']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const product = state.products.find((item) => String(item.id) === button.dataset.id);
      if (product && !isHiddenProduct(product) && isAllowedCategory(product)) {
        openModal(product);
      }
    });
  });

  container.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const product = state.products.find((item) => String(item.id) === card.dataset.id);
      if (product && !isHiddenProduct(product) && isAllowedCategory(product)) {
        openModal(product);
      }
    });
  });
}

function isAllowedCategory(product) {
  const categoryName = product.category?.name || product.animalType || "";
  return categoryName === "Cães" || categoryName === "Gatos" || categoryName === "Coelhos";
}

function addToCart(product) {
  const existing = state.cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      image: resolveImage(product),
      qty: 1,
    });
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function changeQty(productId, delta) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  renderCart();
}

function renderCart() {
  cartCount.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);

  if (state.cart.length === 0) {
    cartItems.innerHTML = `<p style="color:var(--muted);padding:10px 2px">Sua sacola está vazia.</p>`;
    cartTotal.textContent = money(0);
    return;
  }

  cartItems.innerHTML = state.cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <strong>${item.name}</strong>
        <p>${money(item.price)} • Qtde: ${item.qty}</p>
      </div>
      <div class="qty">
        <button data-dec="${item.id}">−</button>
        <button data-inc="${item.id}">+</button>
        <button data-del="${item.id}">x</button>
      </div>
    </div>
  `).join("");

  cartItems.querySelectorAll("[data-dec]").forEach((button) => {
    button.addEventListener("click", () => changeQty(Number(button.dataset.dec), -1));
  });

  cartItems.querySelectorAll("[data-inc]").forEach((button) => {
    button.addEventListener("click", () => changeQty(Number(button.dataset.inc), 1));
  });

  cartItems.querySelectorAll("[data-del]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.del)));
  });

  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = money(total);
}

function saveCart() {
  localStorage.setItem("petOutfitCart", JSON.stringify(state.cart));
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function openModal(product) {
  state.selectedProduct = product;
  modalImage.src = resolveImage(product);
  modalImage.alt = product.name;
  modalCategory.textContent = product.category?.name || product.animalType || "Categoria";
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = money(product.price);
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");

  if (!cartDrawer.classList.contains("open")) {
    overlay.classList.remove("show");
  }
}

bootstrap();