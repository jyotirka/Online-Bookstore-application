# The Book Haven - Online Bookstore

A modern, full-stack e-commerce web application for online book sales built with Django and PostgreSQL.

## Features

### 🛒 E-commerce Functionality
- Browse books with search functionality
- Shopping cart with quantity management
- Wishlist system
- Secure checkout process
- Order history and billing

### 🎨 Modern UI/UX
- Beautiful responsive design with Bootstrap
- Real-time dynamic search
- Smooth SPA navigation
- Instant cart updates
- Loading animations and transitions

### 👤 User Management
- User registration and authentication
- User profiles with order history
- Admin panel for order management
- Superuser can cancel orders

### 🔧 Technical Features
- Single Page Application (SPA) functionality
- Client-side form validation
- Stock management system
- Real-time search without page reloads
- Browser history management

## Tech Stack

- **Backend:** Django 5.2.4
- **Database:** PostgreSQL
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Styling:** Bootstrap 5.3.0 + Custom CSS
- **Icons:** Font Awesome 6.0.0
- **Fonts:** Google Fonts (Playfair Display, Crimson Text)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd store
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL database**
   - Create database: `bookstore_db`
   - Create user: `bookstore_user` with password `ollie20`

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the server**
   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   - Main site: http://127.0.0.1:8000/
   - Admin panel: http://127.0.0.1:8000/admin/

## Project Structure

```
store/
├── bookshop/                 # Main Django app
│   ├── models.py            # Database models
│   ├── views.py             # View functions
│   ├── urls.py              # URL patterns
│   └── templates/           # HTML templates
├── static/                  # Static files
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   └── images/              # Images and favicon
├── myproject/               # Django project settings
├── requirements.txt         # Python dependencies

```

## Key Features Explained

### Dynamic Search
- Real-time search results as you type
- Search by book title or author
- No page reloads required

### Cart Management
- Add/remove items with instant feedback
- Quantity controls with stock validation
- Real-time total calculations

### Admin Features
- View all customer orders
- Cancel orders with automatic stock restoration
- Order status management

### SPA Navigation
- Smooth page transitions
- Browser back/forward button support
- Loading indicators

## Usage

1. **Browse Books:** Visit the homepage to see all available books
2. **Search:** Use the search bar for real-time book filtering
3. **Register/Login:** Create an account or login to access cart features
4. **Shopping:** Add books to cart, manage quantities, and checkout
5. **Admin:** Login as superuser to manage orders

