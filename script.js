"use strict";

/* ==========================================================================
   1. Dynamic Food Items Data (with Clear, Big, Authentic Food Photos)
   ========================================================================== */
const MENU = [
  { 
    id: 1,  
    name: "Crispy Ghee Podi Dosa",     
    category: "Tiffin",    
    price: 90,  
    emoji: "🥞", 
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    description: "Golden crispy dosa made with pure cow ghee and traditional spiced idli podi." 
  },
  { 
    id: 2,  
    name: "Malli Idli Sambar (4 pcs)", 
    category: "Tiffin",    
    price: 70,  
    emoji: "🍚", 
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    description: "Super soft steamed rice cakes served with hot drumstick sambar & fresh chutneys." 
  },
  { 
    id: 3,  
    name: "Medhu Vadai (2 pcs)",   
    category: "Tiffin",    
    price: 60,  
    emoji: "🍩", 
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    description: "Golden crispy urad dal fritters with fresh peppercorns, served with spicy kara chutney." 
  },
  { 
    id: 4,  
    name: "Chettinad Pepper Chicken", 
    category: "Mains", 
    price: 260, 
    emoji: "🍗", 
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    description: "Succulent chicken cooked in stone-ground black pepper, shallots, and Chettinad spices." 
  },
  { 
    id: 5,  
    name: "Paneer Butter Masala", 
    category: "Mains",    
    price: 220, 
    emoji: "🧀", 
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    description: "Fresh cottage cheese cubes simmered in a velvet tomato, butter, and cashew gravy." 
  },
  { 
    id: 6,  
    name: "Malabar Parotta with Salna (2 pcs)", 
    category: "Mains", 
    price: 120, 
    emoji: "🫓", 
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    description: "Crispy, flaky multi-layered flatbread served with aromatic street-style salna gravy." 
  },
  { 
    id: 7,  
    name: "Traditional South Veg Meals",   
    category: "Meals",     
    price: 150, 
    emoji: "🍛", 
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80",
    description: "Steamed Ponni rice, Madras sambar, tomato rasam, kootu, poriyal, appalam & fresh curd." 
  },
  { 
    id: 8,  
    name: "Thalappakatti Chicken Biryani",     
    category: "Biryani",   
    price: 250, 
    emoji: "🍲", 
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    description: "Aromatic Seeraga Samba rice dum-cooked with country chicken and whole hill spices." 
  },
  { 
    id: 9,  
    name: "Royal Veg Dum Biryani",     
    category: "Biryani",   
    price: 180, 
    emoji: "🥘", 
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80",
    description: "Fragrant long-grain basmati rice layered with garden vegetables and saffron milk." 
  },
  { 
    id: 10, 
    name: "Degree Filter Coffee",       
    category: "Beverages", 
    price: 35,  
    emoji: "☕", 
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    description: "Freshly brewed Kumbakonam chicory-rich decoction frothed with boiling thick cow milk." 
  },
  { 
    id: 11, 
    name: "Special Madurai Jigarthanda",         
    category: "Beverages", 
    price: 85,  
    emoji: "🥤", 
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    description: "Chilled coastal dessert drink with almond gum (badam pisin), nannari syrup and malai ice cream." 
  },
  { 
    id: 12, 
    name: "Semiya Paal Payasam",             
    category: "Desserts",  
    price: 65,  
    emoji: "🍮", 
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    description: "Rich vermicelli pudding prepared with sweetened cardamom milk, cashews and golden raisins." 
  }
];

const STORAGE_KEY = "marinaMealsCart";
const GST_RATE = 0.05;               // 5% GST
const FREE_DELIVERY_ABOVE = 500;     // Free delivery above ₹500
const DELIVERY_FEE = 40;             // Flat ₹40 delivery fee

/* ==========================================================================
   2. State & Helper Functions
   ========================================================================== */
let cart = loadCart();               // Restored from Local Storage
let activeCategory = "All";
let searchText = "";

const $ = (id) => document.getElementById(id);
const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

// Feature: Store cart data using Local Storage & Restore it when page is reopened
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const clean = {};
    if (saved && typeof saved === "object") {
      for (const [id, qty] of Object.entries(saved)) {
        if (MENU.some((m) => m.id === Number(id)) && Number.isInteger(qty) && qty > 0) {
          clean[id] = Math.min(qty, 20);
        }
      }
    }
    return clean;
  } catch (e) {
    return {};
  }
}

function saveCart() {
  try { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); 
  } catch (e) {
    console.warn("Local storage is not accessible");
  }
}

// Feature: Display operation messages (Toast notifications)
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// Feature: Calculate item subtotals and the overall order total dynamically
function calcTotals() {
  let subtotal = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const item = MENU.find((m) => m.id === Number(id));
    if (item) subtotal += item.price * qty;
  }
  const gst = Math.round(subtotal * GST_RATE);
  const delivery = (subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE) ? 0 : DELIVERY_FEE;
  const total = subtotal + gst + delivery;
  return { subtotal, gst, delivery, total };
}

/* ==========================================================================
   3. Dynamic Category Filtering & Name Search
   ========================================================================== */
// Feature: Filter food items by category
function renderFilters() {
  const categories = ["All", ...new Set(MENU.map((m) => m.category))];
  const box = $("filters");
  box.innerHTML = "";
  categories.forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = cat;
    b.setAttribute("aria-pressed", String(cat === activeCategory));
    b.addEventListener("click", () => {
      activeCategory = cat;
      renderFilters();
      renderMenu();
    });
    box.appendChild(b);
  });
}

// Feature: Display food items dynamically with images, names, descriptions, categories & prices
// Feature: Search food items by name
function renderMenu() {
  const q = searchText.trim().toLowerCase();
  const items = MENU.filter(
    (m) => (activeCategory === "All" || m.category === activeCategory) &&
           m.name.toLowerCase().includes(q)
  );

  const grid = $("menuGrid");
  grid.innerHTML = "";
  $("resultInfo").textContent = items.length
    ? `${items.length} delicious dish${items.length > 1 ? "es" : ""} available`
    : "No dishes match your search. Try searching another item or category!";

  items.forEach((m) => {
    const card = document.createElement("article");
    card.className = "dish";

    const imgBox = document.createElement("div");
    imgBox.className = "dish-img";
    imgBox.textContent = m.emoji; // Fallback emoji if offline/image error
    
    const img = document.createElement("img");
    img.src = m.image;
    img.alt = m.name;
    img.loading = "lazy";
    img.addEventListener("error", () => img.remove());
    imgBox.appendChild(img);

    const body = document.createElement("div");
    body.className = "dish-body";
    body.innerHTML = `
      <span class="cat"></span>
      <h3></h3>
      <p class="desc"></p>
      <div class="dish-foot">
        <span class="price"></span>
      </div>`;
    body.querySelector(".cat").textContent = m.category;
    body.querySelector("h3").textContent = m.name;
    body.querySelector(".desc").textContent = m.description;
    body.querySelector(".price").textContent = rupee(m.price);

    // Feature: Add products to shopping cart
    const add = document.createElement("button");
    add.type = "button";
    add.className = "primary";
    add.textContent = "+ Add to Cart";
    add.addEventListener("click", () => addToCart(m.id));
    body.querySelector(".dish-foot").appendChild(add);

    card.append(imgBox, body);
    grid.appendChild(card);
  });
}

/* ==========================================================================
   4. Shopping Cart Management (+ / - / Remove / Empty Message)
   ========================================================================== */
// Feature: Add food items to cart
function addToCart(id) {
  cart[id] = Math.min((cart[id] || 0) + 1, 20);
  saveCart();
  renderCart();
  const item = MENU.find((m) => m.id === id);
  if (item) showToast(`Added ${item.name} to cart!`);
}

// Feature: Increase or decrease the quantity of each item
function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) {
    delete cart[id];
  } else {
    cart[id] = Math.min(next, 20);
  }
  saveCart();
  renderCart();
}

// Feature: Remove food items from shopping cart
function removeItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
  showToast("Item removed from cart");
}

function renderCart() {
  const box = $("cartItems");
  box.innerHTML = "";
  const ids = Object.keys(cart);
  const count = ids.reduce((n, id) => n + cart[id], 0);
  $("cartCount").textContent = count;

  // Feature: Display appropriate message when cart is empty
  if (!ids.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "Your cart is currently empty. Browse our menu and add your favorite dishes to start your order.";
    box.appendChild(p);
  }

  // Render items in cart with subtotal calculation per item
  ids.forEach((id) => {
    const m = MENU.find((x) => x.id === Number(id));
    if (!m) return;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-top">
        <span class="n"></span>
        <span class="s"></span>
      </div>
      <div class="cart-item-bot">
        <div class="qty">
          <button type="button" class="minus" aria-label="Decrease quantity">−</button>
          <span class="q"></span>
          <button type="button" class="plus" aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="remove">Remove</button>
      </div>`;
    row.querySelector(".n").textContent = m.name;
    row.querySelector(".s").textContent = rupee(m.price * cart[id]);
    row.querySelector(".q").textContent = cart[id];
    row.querySelector(".minus").addEventListener("click", () => changeQty(m.id, -1));
    row.querySelector(".plus").addEventListener("click", () => changeQty(m.id, 1));
    row.querySelector(".remove").addEventListener("click", () => removeItem(m.id));
    box.appendChild(row);
  });

  // Dynamic Totals calculation
  const t = calcTotals();
  $("totals").hidden = !ids.length;
  $("tSub").textContent = rupee(t.subtotal);
  $("tGst").textContent = rupee(t.gst);
  $("tDel").textContent = t.delivery ? rupee(t.delivery) : "Free (Orders above ₹500)";
  $("tTotal").textContent = rupee(t.total);
  $("reviewBtn").disabled = !ids.length;
  $("clearBtn").hidden = !ids.length;
}

/* ==========================================================================
   5. Form Validation & Order Review Submission
   ========================================================================== */
// Feature: Validate customer details and required order information
const RULES = {
  name:    (v) => (/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v) ? "" : "Enter your full name (letters only, min 3 characters)."),
  phone:   (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9."),
  email:   (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email address (e.g., name@example.com)."),
  address: (v) => (v.length >= 10 ? "" : "Enter complete delivery address with landmark (min 10 characters)."),
  pincode: (v) => (/^[1-9]\d{5}$/.test(v) ? "" : "Enter a valid 6-digit postal pincode."),
  payment: (v) => (v ? "" : "Please select your preferred payment method.")
};

function validateField(name) {
  const input = $(name);
  const message = RULES[name](input.value.trim());
  $("err-" + name).textContent = message;
  input.closest(".field").classList.toggle("invalid", Boolean(message));
  return !message;
}

// Feature: Display an order summary with items, quantities, and prices
function openCheckout() {
  if (!Object.keys(cart).length) {
    showToast("Your cart is empty! Add dishes to proceed.");
    return;
  }
  const list = $("summaryList");
  list.innerHTML = "";
  Object.keys(cart).forEach((id) => {
    const m = MENU.find((x) => x.id === Number(id));
    if (!m) return;
    const li = document.createElement("li");
    const left = document.createElement("span");
    const right = document.createElement("span");
    left.textContent = `${m.name} × ${cart[id]}`;
    right.textContent = rupee(m.price * cart[id]);
    li.append(left, right);
    list.appendChild(li);
  });
  $("summaryTotal").textContent = rupee(calcTotals().total);
  $("checkoutView").hidden = false;
  $("successView").hidden = true;
  $("cartPanel").classList.remove("open");
  $("checkout").showModal();
}

// Feature: Display appropriate messages when an order is submitted
function placeOrder(event) {
  event.preventDefault();
  const allValid = Object.keys(RULES).map(validateField).every(Boolean);
  if (!allValid) {
    showToast("Please fill in all required customer details correctly.");
    return;
  }
  if (!Object.keys(cart).length) {
    showToast("Your cart is empty!");
    return;
  }

  const orderNo = "MM-" + Date.now().toString().slice(-6);
  const total = rupee(calcTotals().total);
  const name = $("name").value.trim();

  // Submission message
  $("successMsg").textContent =
    `Thank you, ${name}! Your order #${orderNo} amounting to ${total} has been confirmed. Our delivery rider will reach your address shortly.`;
  
  // Clear cart and local storage upon order placement
  cart = {};
  saveCart();
  renderCart();
  $("orderForm").reset();
  $("checkoutView").hidden = true;
  $("successView").hidden = false;
}

/* ==========================================================================
   6. Event Listeners & Initialization
   ========================================================================== */
$("search").addEventListener("input", (e) => {
  searchText = e.target.value;
  renderMenu();
});

$("reviewBtn").addEventListener("click", openCheckout);

$("clearBtn").addEventListener("click", () => {
  cart = {};
  saveCart();
  renderCart();
  showToast("Shopping cart cleared");
});

$("cartToggle").addEventListener("click", () => {
  const open = $("cartPanel").classList.toggle("open");
  $("cartToggle").setAttribute("aria-expanded", String(open));
});

$("orderForm").addEventListener("submit", placeOrder);
$("backBtn").addEventListener("click", () => $("checkout").close());
$("doneBtn").addEventListener("click", () => $("checkout").close());

Object.keys(RULES).forEach((name) => {
  $(name).addEventListener("blur", () => validateField(name));
});

// Initial Render
renderFilters();
renderMenu();
renderCart();
      
