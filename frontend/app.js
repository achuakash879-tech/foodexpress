let allFoods = [];

// LOAD FOODS
async function loadFoods() {
    try {
        const response = await fetch('/api/foods/all');
        allFoods = await response.json();
        const foods = allFoods;
        const container = document.getElementById('food-container');
        if (!container) return;
        container.innerHTML = '';
        foods.forEach((food, i) => {
            const card = document.createElement('div');
            card.className = 'food-card animate-in';
            card.style.animationDelay = `${i * 0.08}s`;
            card.innerHTML = `
                <div class="img-wrapper">
                    <img src="images/${food.image}" alt="${food.name}">
                </div>
                <div class="card-body">
                    <h2>${food.name}</h2>
                    <p class="price">$${food.price}</p>
                    <div class="card-actions">
                        <button class="btn-add-cart" onclick="addToCart('${food.name}', ${food.price})">
                            🛒 Add To Cart
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.log(error);
        showToast('Error Loading Foods', 'error');
    }
}

// SEARCH FOODS
function searchFoods() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredFoods = allFoods.filter(food =>
        food.name.toLowerCase().includes(searchValue)
    );
    const container = document.getElementById('food-container');
    if (!container) return;
    container.innerHTML = '';
    filteredFoods.forEach((food, i) => {
        const card = document.createElement('div');
        card.className = 'food-card animate-in';
        card.style.animationDelay = `${i * 0.06}s`;
        card.innerHTML = `
            <div class="img-wrapper">
                <img src="images/${food.image}" alt="${food.name}">
            </div>
            <div class="card-body">
                <h2>${food.name}</h2>
                <p class="price">$${food.price}</p>
                <div class="card-actions">
                    <button class="btn-add-cart" onclick="addToCart('${food.name}', ${food.price})">
                        🛒 Add To Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// CART
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(foodName, price) {
    cart.push({
        food_name: foodName,
        price: price,
        quantity: 1
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast(`${foodName} added to cart!`);
}

// LOAD CART
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious food to get started!</p>
            </div>
        `;
        return;
    }

    cartItems.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'cart-item animate-in';
        div.style.animationDelay = `${i * 0.08}s`;
        div.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.food_name}</h3>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">$${item.price}</div>
        `;
        cartContainer.appendChild(div);
    });
}

// CHECKOUT
async function checkout() {
    const token = localStorage.getItem('token');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        showToast('Cart is Empty', 'error');
        return;
    }

    try {
        for (let item of cartItems) {
            await fetch('/api/orders/place', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(item)
            });
        }
        showToast('Order Placed Successfully! 🎉');
        localStorage.removeItem('cart');
        cart = [];
        window.location.href = 'orders.html';
    } catch (error) {
        console.log(error);
        showToast('Checkout Failed', 'error');
    }
}

// LOAD USER ORDERS
async function loadOrders() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/orders/myorders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const orders = await response.json();
        const container = document.getElementById('orders-container');
        if (!container) return;
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">📦</div>
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet.</p>
                </div>
            `;
            return;
        }

        orders.forEach((order, i) => {
            const card = document.createElement('div');
            card.className = 'order-card animate-in';
            card.style.animationDelay = `${i * 0.08}s`;
            card.innerHTML = `
                <h3>🍽️ ${order.food_name}</h3>
                <p><strong>Price:</strong> $${order.price}</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
                <div class="status-badge">${order.status}</div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.log(error);
        showToast('Error Loading Orders', 'error');
    }
}

// ADD FOOD
async function addFood() {
    const name = document.getElementById('foodName').value;
    const price = document.getElementById('foodPrice').value;
    const image = document.getElementById('foodImage').value;

    if (!name || !price || !image) {
        showToast('Please fill all fields', 'error');
        return;
    }

    try {
        const response = await fetch('/api/foods/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price, image })
        });
        const data = await response.json();
        showToast(data.message);
        document.getElementById('foodName').value = '';
        document.getElementById('foodPrice').value = '';
        document.getElementById('foodImage').value = '';
        loadAdminFoods();
    } catch (error) {
        console.log(error);
        showToast('Failed To Add Food', 'error');
    }
}

// LOAD ADMIN FOODS
async function loadAdminFoods() {
    try {
        const response = await fetch('/api/foods/all');
        const foods = await response.json();
        const container = document.getElementById('admin-foods');
        if (!container) return;
        container.innerHTML = '';

        foods.forEach((food, i) => {
            const card = document.createElement('div');
            card.className = 'food-card animate-in';
            card.style.animationDelay = `${i * 0.08}s`;
            card.innerHTML = `
                <div class="card-body">
                    <h3>${food.name}</h3>
                    <p class="price">$${food.price}</p>
                    <p style="color:var(--dark-400);font-size:0.82rem;">📷 ${food.image}</p>
                    <div class="card-actions">
                        <button class="btn-secondary btn-sm" onclick="editFood(${food.id}, '${food.name}', ${food.price}, '${food.image}')">
                            ✏️ Edit
                        </button>
                        <button class="btn-danger btn-sm" onclick="deleteFood(${food.id})">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.log(error);
        showToast('Failed To Load Foods', 'error');
    }
}

// DELETE FOOD
async function deleteFood(id) {
    if (!confirm('Are you sure you want to delete this food?')) return;
    try {
        const response = await fetch(`/api/foods/delete/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        showToast(data.message);
        loadAdminFoods();
    } catch (error) {
        console.log(error);
        showToast('Delete Failed', 'error');
    }
}

// EDIT FOOD
async function editFood(id, oldName, oldPrice, oldImage) {
    const name = prompt('Enter Food Name', oldName);
    if (name === null) return;
    const price = prompt('Enter Price', oldPrice);
    if (price === null) return;
    const image = prompt('Enter Image Name', oldImage);
    if (image === null) return;

    try {
        const response = await fetch(`/api/foods/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price, image })
        });
        const data = await response.json();
        showToast(data.message);
        loadAdminFoods();
    } catch (error) {
        console.log(error);
        showToast('Update Failed', 'error');
    }
}

// LOAD ADMIN ORDERS
async function loadAdminOrders() {
    try {
        const response = await fetch('/api/orders/all');
        const orders = await response.json();
        const container = document.getElementById('admin-orders');
        if (!container) return;
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">📋</div>
                    <h3>No Orders Yet</h3>
                    <p>Orders will appear here when customers place them.</p>
                </div>
            `;
            return;
        }

        orders.forEach((order, i) => {
            const card = document.createElement('div');
            card.className = 'order-card animate-in';
            card.style.animationDelay = `${i * 0.06}s`;
            card.innerHTML = `
                <h3>🍽️ ${order.food_name}</h3>
                <p><strong>Price:</strong> $${order.price}</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
                <div class="status-badge">${order.status}</div>
                <div class="card-actions" style="margin-top:12px;">
                    <button class="btn-primary btn-sm" onclick="updateStatus(${order.id})">
                        🔄 Update Status
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.log(error);
    }
}

// UPDATE ORDER STATUS
async function updateStatus(id) {
    const status = prompt('Enter Status (Pending / Preparing / Delivered)');
    if (status === null) return;

    try {
        const response = await fetch(`/api/orders/status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        showToast(data.message);
        loadAdminOrders();
    } catch (error) {
        console.log(error);
    }
}

// REGISTER
async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (data.message) {
            showToast(data.message);
            window.location.href = 'login.html';
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.log(error);
        showToast('Register Failed', 'error');
    }
}

// TOAST NOTIFICATION
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
        toast.style.borderLeftColor = '#dc2626';
    }
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

// MOBILE NAV TOGGLE
function toggleNav() {
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('active');
}

// PAGE LOADERS
const path = window.location.pathname;

if (path.includes('menu.html')) {
    loadFoods();
}

if (path.includes('cart.html')) {
    loadCart();
}

if (path.includes('orders.html') && !path.includes('admin')) {
    loadOrders();
}

if (path.includes('admin.html') && !path.includes('adminOrders')) {
    loadAdminFoods();
}

if (path.includes('adminOrders.html')) {
    loadAdminOrders();
}