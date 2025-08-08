
ReciBook is a **full-stack recipe web application** where food lovers can browse, explore, and interact with recipes.  
Whether you’re a home cook or a foodie, you can **find recipes, like them, rate them, and save your favourites** — all in one place.
✨ Features

- 🔑 **Authentication** — Secure login & registration with JWT  
- 📜 **Recipe Listing** — Browse all recipes with images & details  
- 🍴 **Recipe Details** — View ingredients, steps, and more in a dedicated page  
- ❤️ **Likes** — Show love to your favourite dishes  
- ⭐ **Ratings** — Rate recipes and see average ratings  
- 🔒 **Security** — Encrypted passwords & protected routes  
🛠 Tech Stack
Frontend:
HTML5 • CSS3 • JavaScript 

**Backend:**  
Node.js • Express.js • MongoDB (Mongoose) • JWT  
📂 Project Structure
ReciBook/
│
├── backend/            # Node.js + Express server
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── server.js
│
├── frontend/
│   ├── index.html      # Recipe listing page
│   ├── recipe.html     # Recipe details page
│   ├── login.html      # User login
│   ├── register.html   # User registration
│   └── assets/         # CSS, images, JS scripts
│
├── .env                # Environment variables
├── package.json
└── README.md
