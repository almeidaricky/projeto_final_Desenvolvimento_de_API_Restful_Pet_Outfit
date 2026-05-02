console.log('JS CARREGOU');

const API_BASE = 'http://localhost:8083/api';

const HIDDEN_PRODUCTS = [
  'Gravata Borboleta Velvet',
  'Touca Minimalista',
  'Vestido Rosa Fosco',
];

const DISPLAY_CATEGORIES = ['Todos', 'Cães', 'Gatos', 'Coelhos', 'Exóticos'];
const ALLOWED_CATEGORIES = DISPLAY_CATEGORIES.filter((c) => c !== 'Todos');

const state = {
  categories: [],
  products: [],
  filtered: [],
  activeCategory: 'Todos',
  searchTerm: '',
  cart: JSON.parse(localStorage.getItem('petOutfitCart') || '[]'),
  selectedProduct: null,
};

const categoryChips = document.getElementById('categoryChips');
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalAddBtn = document.getElementById('modalAddBtn');

document.getElementById('openCartBtn')?.addEventListener('click', openCart);
document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);

overlay?.addEventListener('click', () => {
  closeCart();
  closeModal();
});

searchInput?.addEventListener('input', (event) => {
  state.searchTerm = event.target.value.trim().toLowerCase();
  renderAll();
});

modalAddBtn?.addEventListener('click', () => {
  if (state.selectedProduct) {
    addToCart(state.selectedProduct);
    closeModal();
    openCart();
  }
});

function safeText(value) {
  return (value ?? '').toString().trim();
}

function normalizeText(value) {
  return safeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function money(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
}

function getCategoryName(product) {
  return safeText(
    product?.category?.name ||
      product?.animalType ||
      product?.categoryName ||
      'Sem categoria'
  );
}

function isHiddenProduct(product) {
  return HIDDEN_PRODUCTS.includes(product.name);
}

function isAllowedCategory(product) {
  const categoryName = normalizeText(getCategoryName(product));
  return (
    categoryName === 'caes' ||
    categoryName === 'gatos' ||
    categoryName === 'coelhos' ||
    categoryName === 'exoticos'
  );
}

function sameCategory(a, b) {
  return normalizeText(a) === normalizeText(b);
}

function resolveImage(product) {
  const src = safeText(product?.imageUrl);

  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('./') ||
    src.startsWith('/') ||
    src.startsWith('images/')
  ) {
    return src;
  }

  const animal = normalizeText(product?.animalType);
  const category = normalizeText(product?.category?.name);

  if (
    animal.includes('cao') ||
    animal.includes('cachorro') ||
    category.includes('cao')
  ) {
    return 'images/dog-01.jpg';
  }

  if (animal.includes('gato') || category.includes('gato')) {
    return 'images/cat-01.jpg';
  }

  if (animal.includes('coelho') || category.includes('coelho')) {
    return 'images/rabbit-01.jpg';
  }

  return 'images/exotic-01.jpg';
}

function renderCategories() {
  if (!categoryChips) return;

  const backendCategories = state.categories
    .map((cat) => safeText(cat?.name))
    .filter(Boolean)
    .filter((name) =>
      ALLOWED_CATEGORIES.some((allowed) => sameCategory(allowed, name))
    );

  const categoriesToRender = [
    'Todos',
    ...new Set([...DISPLAY_CATEGORIES.slice(1), ...backendCategories]),
  ];

  categoryChips.innerHTML = categoriesToRender
    .map((name) => {
      const active = sameCategory(name, state.activeCategory) ? 'active' : '';
      return `
        <button type="button" class="chip ${active}" data-category="${name}">
          ${name}
        </button>
      `;
    })
    .join('');

  categoryChips.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      filterCategory(button.dataset.category || 'Todos');
    });
  });
}

function filterCategory(category) {
  state.activeCategory = category || 'Todos';
  renderCategories();
  renderAll();
}

function getVisibleProducts() {
  return state.products.filter((product) => {
    if (!product) return false;
    if (isHiddenProduct(product)) return false;
    if (!isAllowedCategory(product)) return false;
    if (product.active === false) return false;

    const productCategory = getCategoryName(product);

    const matchesCategory =
      state.activeCategory === 'Todos' ||
      sameCategory(productCategory, state.activeCategory);

    const text = [
      product.name,
      product.description,
      product.animalType,
      productCategory,
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = !state.searchTerm || text.includes(state.searchTerm);

    return matchesCategory && matchesSearch;
  });
}

function renderCards(products) {
  return products
    .map((product) => {
      const image = resolveImage(product);
      const categoryName = getCategoryName(product);

      return `
        <article class="card" data-id="${product.id}">
          <div class="card-image">
            <img src="${image}" alt="${safeText(product.name)}" />
            <span class="badge">${safeText(categoryName)}</span>
          </div>

          <div class="card-body">
            <h4>${safeText(product.name)}</h4>
            <p>${safeText(product.description)}</p>

            <div class="card-meta">
              <strong class="price">${money(product.price)}</strong>
              <div>
                <button type="button" class="small-btn" data-action="view" data-id="${product.id}">
                  Ver
                </button>
                <button type="button" class="small-btn primary" data-action="add" data-id="${product.id}">
                  Sacola
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function bindCardEvents(container) {
  container.querySelectorAll("[data-action='add']").forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const product = state.products.find(
        (item) => String(item.id) === button.dataset.id
      );

      if (product && !isHiddenProduct(product) && isAllowedCategory(product)) {
        addToCart(product);
      }
    });
  });

  container.querySelectorAll("[data-action='view']").forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const product = state.products.find(
        (item) => String(item.id) === button.dataset.id
      );

      if (product && !isHiddenProduct(product) && isAllowedCategory(product)) {
        openModal(product);
      }
    });
  });

  container.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
      const product = state.products.find(
        (item) => String(item.id) === card.dataset.id
      );

      if (product && !isHiddenProduct(product) && isAllowedCategory(product)) {
        openModal(product);
      }
    });
  });
}

function renderAll() {
  state.filtered = getVisibleProducts();

  if (!productGrid) return;

  const visible = state.filtered;

  if (visible.length === 0) {
    productGrid.innerHTML = '<p>Nenhum produto encontrado com esse filtro.</p>';
    return;
  }

  productGrid.innerHTML = renderCards(visible);
  bindCardEvents(productGrid);
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
  if (cartCount) {
    cartCount.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  if (!cartItems || !cartTotal) return;

  if (state.cart.length === 0) {
    cartItems.innerHTML = '<p>Sua sacola está vazia.</p>';
    cartTotal.textContent = money(0);
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${safeText(item.name)}" />
          <div>
            <strong>${safeText(item.name)}</strong>
            <p>${money(item.price)} • Qtde: ${item.qty}</p>
            <div class="qty">
              <div>
                <button type="button" data-dec="${item.id}">−</button>
                <button type="button" data-inc="${item.id}">+</button>
              </div>
              <button type="button" data-del="${item.id}">x</button>
            </div>
          </div>
        </div>
      `
    )
    .join('');

  cartItems.querySelectorAll('[data-dec]').forEach((button) => {
    button.addEventListener('click', () =>
      changeQty(Number(button.dataset.dec), -1)
    );
  });

  cartItems.querySelectorAll('[data-inc]').forEach((button) => {
    button.addEventListener('click', () =>
      changeQty(Number(button.dataset.inc), 1)
    );
  });

  cartItems.querySelectorAll('[data-del]').forEach((button) => {
    button.addEventListener('click', () =>
      removeFromCart(Number(button.dataset.del))
    );
  });

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  cartTotal.textContent = money(total);
}

function saveCart() {
  localStorage.setItem('petOutfitCart', JSON.stringify(state.cart));
}

function openCart() {
  if (!cartDrawer || !overlay) return;
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  if (!cartDrawer || !overlay) return;
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function openModal(product) {
  state.selectedProduct = product;

  if (modalImage) {
    modalImage.src = resolveImage(product);
    modalImage.alt = safeText(product.name);
  }

  if (modalCategory) modalCategory.textContent = getCategoryName(product) || 'Categoria';
  if (modalTitle) modalTitle.textContent = safeText(product.name);
  if (modalDescription) modalDescription.textContent = safeText(product.description);
  if (modalPrice) modalPrice.textContent = money(product.price);

  if (modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  overlay?.classList.add('show');
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');

  if (!cartDrawer?.classList.contains('open')) {
    overlay?.classList.remove('show');
  }
}

async function bootstrap() {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${API_BASE}/categories`),
      fetch(`${API_BASE}/products`),
    ]);

    if (!categoriesRes.ok) {
      throw new Error('Falha ao carregar categorias');
    }

    if (!productsRes.ok) {
      throw new Error('Falha ao carregar produtos');
    }

    state.categories = await categoriesRes.json();
    state.products = await productsRes.json();

    console.log('Categorias:', state.categories);
    console.log('Produtos:', state.products);

    renderCategories();
    renderAll();
    renderCart();
  } catch (error) {
    console.error('Erro ao carregar:', error);

    if (productGrid) {
      productGrid.innerHTML = `
        <p>Não foi possível carregar a API.</p>
        <p>Verifique se o Spring Boot está rodando em ${API_BASE}.</p>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);

window.searchProducts = function searchProducts(value) {
  state.searchTerm = safeText(value).trim().toLowerCase();
  renderAll();
};

window.filterCategory = filterCategory;
window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.closeModal = closeModal;