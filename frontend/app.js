let allFoods = [];



// LOAD FOODS

async function loadFoods() {

    try {

        const response = await fetch(
            'http://localhost:3000/api/foods/all'
        );

        allFoods = await response.json();

        const foods = allFoods;

        const container =
            document.getElementById('food-container');

        if (!container) return;

        container.innerHTML = '';

        foods.forEach(food => {

            container.innerHTML += `

                <div class="food-card">

                    <img
                        src="images/${food.image}"
                        width="200"
                        height="150"
                    >

                    <h2>${food.name}</h2>

                    <p>Price: $${food.price}</p>

                    <button onclick="addToCart('${food.name}', ${food.price})">

                        Add To Cart

                    </button>

                </div>
            `;
        });

    } catch (error) {

        console.log(error);

        alert('Error Loading Foods');
    }
}



// SEARCH FOODS

function searchFoods() {

    const searchValue =

        document
        .getElementById('searchInput')
        .value
        .toLowerCase();

    const filteredFoods = allFoods.filter(food =>

        food.name
        .toLowerCase()
        .includes(searchValue)
    );

    const container =
        document.getElementById('food-container');

    if (!container) return;

    container.innerHTML = '';

    filteredFoods.forEach(food => {

        container.innerHTML += `

            <div class="food-card">

                <img
                    src="images/${food.image}"
                    width="200"
                    height="150"
                >

                <h2>${food.name}</h2>

                <p>Price: $${food.price}</p>

                <button onclick="addToCart('${food.name}', ${food.price})">

                    Add To Cart

                </button>

            </div>
        `;
    });
}



// CART

let cart = [];

function addToCart(foodName, price) {

    cart.push({

        food_name: foodName,

        price: price,

        quantity: 1
    });

    localStorage.setItem(

        'cart',

        JSON.stringify(cart)
    );

    alert('Added To Cart');
}



// LOAD CART

function loadCart() {

    const cartItems =
        JSON.parse(localStorage.getItem('cart')) || [];

    const cartContainer =
        document.getElementById('cart-container');

    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    cartItems.forEach(item => {

        cartContainer.innerHTML += `

            <div class="food-card">

                <h3>${item.food_name}</h3>

                <p>Price: ${item.price}</p>

                <p>Quantity: ${item.quantity}</p>

            </div>

            <hr>
        `;
    });
}



// CHECKOUT

async function checkout() {

    const token = localStorage.getItem('token');

    const cartItems =
        JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {

        alert('Cart is Empty');

        return;
    }

    try {

        for (let item of cartItems) {

            await fetch(

                'http://localhost:3000/api/orders/place',

                {
                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json',

                        'Authorization': `Bearer ${token}`
                    },

                    body: JSON.stringify(item)
                }
            );
        }

        alert('Order Placed Successfully');

        localStorage.removeItem('cart');

        window.location.href = 'orders.html';

    } catch (error) {

        console.log(error);

        alert('Checkout Failed');
    }
}



// LOAD USER ORDERS

async function loadOrders() {

    const token = localStorage.getItem('token');

    try {

        const response = await fetch(

            'http://localhost:3000/api/orders/myorders',

            {
                method: 'GET',

                headers: {

                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const orders = await response.json();

        const container =
            document.getElementById('orders-container');

        if (!container) return;

        container.innerHTML = '';

        if (orders.length === 0) {

            container.innerHTML =
                '<h3>No Orders Found</h3>';

            return;
        }

        orders.forEach(order => {

            container.innerHTML += `

                <div class="food-card">

                    <h3>${order.food_name}</h3>

                    <p>Price: ${order.price}</p>

                    <p>Quantity: ${order.quantity}</p>

                    <p>Status: ${order.status}</p>

                </div>

                <hr>
            `;
        });

    } catch (error) {

        console.log(error);

        alert('Error Loading Orders');
    }
}



// ADD FOOD

async function addFood() {

    const name =
        document.getElementById('foodName').value;

    const price =
        document.getElementById('foodPrice').value;

    const image =
        document.getElementById('foodImage').value;

    try {

        const response = await fetch(

            'http://localhost:3000/api/foods/add',

            {
                method: 'POST',

                headers: {

                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    name,

                    price,

                    image
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        loadAdminFoods();

    } catch (error) {

        console.log(error);

        alert('Failed To Add Food');
    }
}



// LOAD ADMIN FOODS

async function loadAdminFoods() {

    try {

        const response = await fetch(

            'http://localhost:3000/api/foods/all'
        );

        const foods = await response.json();

        const container =
            document.getElementById('admin-foods');

        if (!container) return;

        container.innerHTML = '';

        foods.forEach(food => {

            container.innerHTML += `

                <div class="food-card">

                    <h3>${food.name}</h3>

                    <p>Price: $${food.price}</p>

                    <p>${food.image}</p>

                    <button onclick="deleteFood(${food.id})">

                        Delete

                    </button>

                    <button onclick="editFood(
                        ${food.id},
                        '${food.name}',
                        ${food.price},
                        '${food.image}'
                    )">

                        Edit

                    </button>

                </div>

                <hr>
            `;
        });

    } catch (error) {

        console.log(error);

        alert('Failed To Load Foods');
    }
}



// DELETE FOOD

async function deleteFood(id) {

    try {

        const response = await fetch(

            `http://localhost:3000/api/foods/delete/${id}`,

            {
                method: 'DELETE'
            }
        );

        const data = await response.json();

        alert(data.message);

        loadAdminFoods();

    } catch (error) {

        console.log(error);

        alert('Delete Failed');
    }
}



// EDIT FOOD

async function editFood(id, oldName, oldPrice, oldImage) {

    const name =
        prompt('Enter Food Name', oldName);

    const price =
        prompt('Enter Price', oldPrice);

    const image =
        prompt('Enter Image Name', oldImage);

    try {

        const response = await fetch(

            `http://localhost:3000/api/foods/update/${id}`,

            {
                method: 'PUT',

                headers: {

                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    name,

                    price,

                    image
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        loadAdminFoods();

    } catch (error) {

        console.log(error);

        alert('Update Failed');
    }
}



// LOAD ADMIN ORDERS

async function loadAdminOrders() {

    try {

        const response = await fetch(

            'http://localhost:3000/api/orders/all'
        );

        const orders = await response.json();

        const container =
            document.getElementById('admin-orders');

        if (!container) return;

        container.innerHTML = '';

        orders.forEach(order => {

            container.innerHTML += `

                <div class="food-card">

                    <h3>${order.food_name}</h3>

                    <p>Price: ${order.price}</p>

                    <p>Quantity: ${order.quantity}</p>

                    <p>Status: ${order.status}</p>

                    <button onclick="updateStatus(${order.id})">

                        Update Status

                    </button>

                </div>

                <hr>
            `;
        });

    } catch (error) {

        console.log(error);
    }
}



// UPDATE ORDER STATUS

async function updateStatus(id) {

    const status =
        prompt('Enter Status');

    try {

        const response = await fetch(

            `http://localhost:3000/api/orders/status/${id}`,

            {
                method: 'PUT',

                headers: {

                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    status
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        loadAdminOrders();

    } catch (error) {

        console.log(error);
    }
}



// PAGE LOADERS

if (window.location.pathname.includes('index.html')) {

    loadFoods();
}

if (window.location.pathname.includes('cart.html')) {

    loadCart();
}

if (window.location.pathname.includes('orders.html')) {

    loadOrders();
}

if (window.location.pathname.includes('admin.html')) {

    loadAdminFoods();
}

if (window.location.pathname.includes('adminOrders.html')) {

    loadAdminOrders();
}