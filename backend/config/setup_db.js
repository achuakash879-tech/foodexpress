const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' }); // Load from backend/

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'aksin123',
    database: process.env.DB_NAME || 'foodexpress',
    multipleStatements: true
};

const connection = mysql.createConnection(dbConfig);

const createTablesSql = `
    SET FOREIGN_KEY_CHECKS = 0;
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS food_items;
    DROP TABLE IF EXISTS foods;
    DROP TABLE IF EXISTS users;
    SET FOREIGN_KEY_CHECKS = 1;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE food_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        food_id INT NOT NULL,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE,
        UNIQUE KEY user_food (user_id, food_id)
    );

    CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        food_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE RESTRICT
    );
`;

connection.connect(async (err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL. Setting up database...');

    connection.query(createTablesSql, async (err) => {
        if (err) {
            console.error('Error creating tables:', err);
            connection.end();
            process.exit(1);
        }
        console.log('Tables created successfully.');

        try {
            // Seed Users
            const adminPassword = await bcrypt.hash('adminpassword', 10);
            const customerPassword = await bcrypt.hash('customerpassword', 10);

            const seedUsersSql = `
                INSERT INTO users (name, email, password, role) VALUES 
                ('Admin User', 'admin@foodexpress.com', ?, 'admin'),
                ('John Customer', 'customer@foodexpress.com', ?, 'customer')
            `;

            connection.query(seedUsersSql, [adminPassword, customerPassword], (err) => {
                if (err) {
                    console.error('Error seeding users:', err);
                    connection.end();
                    process.exit(1);
                }
                console.log('Users seeded successfully (admin@foodexpress.com, customer@foodexpress.com).');

                // Seed Food Items
                const seedFoodsSql = `
                    INSERT INTO food_items (name, price, description, image) VALUES 
                    ('Margherita Pizza', 12.99, 'Fresh mozzarella cheese, aromatic basil, and signature sweet tomato sauce on a crispy thin wood-fired crust.', 'pizza.jpg'),
                    ('Gourmet Double Burger', 14.99, 'Two juicy fire-grilled beef patties, melted sharp cheddar, crisp lettuce, ripe tomatoes, and secret chef sauce.', 'burger.jpg'),
                    ('Fresh Caesar Salad', 11.49, 'Crisp romaine lettuce tossed in creamy garlic Caesar dressing, shredded parmesan, and golden butter croutons.', 'salad.jpg'),
                    ('Schezwan Noodles', 10.99, 'Stir-fried wheat noodles tossed with crisp garden vegetables in a hot, smoky, and spicy Schezwan sauce.', 'nudles.jpg'),
                    ('Creamy Alfredo Pasta', 13.49, 'Fettuccine pasta enrobed in a rich, velvety parmesan cream sauce, topped with cracked black pepper.', 'pasta.jpg'),
                    ('Citrus Cooler Mocktail', 5.99, 'A refreshing zesty blend of freshly squeezed lime, crushed mint leaves, sweet orange, and sparkling club soda.', 'drink.jpg'),
                    ('Chocolate Lava Cake', 7.99, 'Warm, decadent chocolate cake with a molten dark chocolate center, dusted with powdered sugar.', 'chocolate.jpg')
                `;

                connection.query(seedFoodsSql, (err) => {
                    if (err) {
                        console.error('Error seeding foods:', err);
                    } else {
                        console.log('Food items seeded successfully.');
                    }
                    connection.end();
                    console.log('Database setup complete!');
                });
            });

        } catch (hashError) {
            console.error('Password hashing failed:', hashError);
            connection.end();
            process.exit(1);
        }
    });
});
