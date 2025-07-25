from .models import Book, Cart, CartItem, Order, OrderItem, Wishlist
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .forms import RegisterForm
from django.contrib import messages



def home(request):
    search_query = request.GET.get('search', '')

    if search_query:
        # Search books by title or author (case-insensitive)
        books = Book.objects.filter(
            Q(title__icontains=search_query) |
            Q(author__icontains=search_query)
        )
        messages.info(request, f"Found {books.count()} book(s) matching '{search_query}'")
    else:
        books = Book.objects.all()

    return render(request, 'bookshop/home.html', {
        'books': books,
        'search_query': search_query
    })


def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Account created! Please log in.")
            return redirect('login')
    else:
        form = RegisterForm()
    return render(request, 'bookshop/register.html', {'form': form})

def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
        
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            messages.success(request, "Login successful!")
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password')
    return render(request, 'bookshop/login.html')

def logout_view(request):
    logout(request)
    messages.success(request, "You have been logged out successfully.")
    return redirect('home')

@login_required
def add_to_cart(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    if book.stock <= 0:
        messages.error(request, f"Sorry, {book.title} is out of stock.")
        return redirect('home')

    # Get or create cart for the user
    cart, created = Cart.objects.get_or_create(user=request.user)

    # Get or create cart item
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        book=book,
        defaults={'quantity': 1}
    )

    if not created:
        # If item already exists, increase quantity
        if cart_item.quantity < book.stock:
            cart_item.quantity += 1
            cart_item.save()
            messages.success(request, f"Added another {book.title} to your cart.")
        else:
            messages.warning(request, f"Cannot add more {book.title}. Only {book.stock} available.")
    else:
        messages.success(request, f"Added {book.title} to your cart.")

    return redirect('home')

@login_required
def view_cart(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart_items = cart.items.all()
    except Cart.DoesNotExist:
        cart = None
        cart_items = []

    return render(request, 'bookshop/cart.html', {
        'cart': cart,
        'cart_items': cart_items
    })

@login_required
def checkout(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart_items = cart.items.all()

        if not cart_items:
            messages.error(request, "Your cart is empty.")
            return redirect('view_cart')

    except Cart.DoesNotExist:
        messages.error(request, "Your cart is empty.")
        return redirect('view_cart')

    if request.method == 'POST':
        # Generate order number
        import random
        import string
        order_number = 'ORD' + ''.join(random.choices(string.digits, k=8))

        # Create order with dummy billing info
        order = Order.objects.create(
            user=request.user,
            order_number=order_number,
            total_amount=cart.get_total_price(),
            billing_name=request.user.get_full_name() or request.user.username,
            billing_email=request.user.email or f"{request.user.username}@example.com",
            billing_phone="9876543210",  # Dummy phone
            billing_address="123 Main Street, Apartment 4B",  # Dummy address
            billing_city="Mumbai",  # Dummy city
            billing_postal_code="400001",  # Dummy postal code
            status='confirmed'
        )

        # Create order items and update stock
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                book=cart_item.book,
                quantity=cart_item.quantity,
                price=cart_item.book.price
            )

            # Update book stock
            cart_item.book.stock -= cart_item.quantity
            cart_item.book.save()

        # Clear the cart
        cart.delete()

        return redirect('order_bill', order_id=order.id)

    return render(request, 'bookshop/checkout.html', {
        'cart': cart,
        'cart_items': cart_items
    })

@login_required
def order_bill(request, order_id):
    from decimal import Decimal

    order = get_object_or_404(Order, id=order_id, user=request.user)
    order_items = order.items.all()

    # Calculate tax (18% GST) - using Decimal for precision
    subtotal = order.total_amount
    tax_rate = Decimal('0.18')  # Convert to Decimal
    tax_amount = subtotal * tax_rate
    total_with_tax = subtotal + tax_amount

    return render(request, 'bookshop/bill.html', {
        'order': order,
        'order_items': order_items,
        'subtotal': subtotal,
        'tax_rate': tax_rate * 100,  # Convert to percentage
        'tax_amount': tax_amount,
        'total_with_tax': total_with_tax,
    })

@login_required
def user_profile(request):
    """User profile dashboard"""
    user = request.user

    # Get recent orders (last 5)
    recent_orders = Order.objects.filter(user=user).order_by('-created_at')[:5]

    # Get wishlist count
    wishlist_count = Wishlist.objects.filter(user=user).count()

    # Get total orders count
    total_orders = Order.objects.filter(user=user).count()

    return render(request, 'bookshop/profile/dashboard.html', {
        'user': user,
        'recent_orders': recent_orders,
        'wishlist_count': wishlist_count,
        'total_orders': total_orders,
    })

@login_required
def user_orders(request):
    """User orders page"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')

    return render(request, 'bookshop/profile/orders.html', {
        'orders': orders,
    })

@login_required
def user_wishlist(request):
    """User wishlist page"""
    wishlist_items = Wishlist.objects.filter(user=request.user).order_by('-added_at')

    return render(request, 'bookshop/profile/wishlist.html', {
        'wishlist_items': wishlist_items,
    })

@login_required
def add_to_wishlist(request, book_id):
    """Add book to wishlist"""
    book = get_object_or_404(Book, id=book_id)

    wishlist_item, created = Wishlist.objects.get_or_create(
        user=request.user,
        book=book
    )

    if created:
        messages.success(request, f"Added {book.title} to your wishlist.")
    else:
        messages.info(request, f"{book.title} is already in your wishlist.")

    return redirect('home')

@login_required
def remove_from_wishlist(request, book_id):
    """Remove book from wishlist"""
    book = get_object_or_404(Book, id=book_id)

    try:
        wishlist_item = Wishlist.objects.get(user=request.user, book=book)
        wishlist_item.delete()
        messages.success(request, f"Removed {book.title} from your wishlist.")
    except Wishlist.DoesNotExist:
        messages.error(request, "Book not found in your wishlist.")

    return redirect('user_wishlist')

@login_required
def remove_from_cart(request, book_id):
    """Remove book from cart"""
    book = get_object_or_404(Book, id=book_id)

    try:
        cart = Cart.objects.get(user=request.user)
        cart_item = CartItem.objects.get(cart=cart, book=book)
        cart_item.delete()
        messages.success(request, f"Removed {book.title} from your cart.")
    except (Cart.DoesNotExist, CartItem.DoesNotExist):
        messages.error(request, "Book not found in your cart.")

    return redirect('view_cart')

@login_required
def update_cart_quantity(request, book_id):
    """Update cart item quantity"""
    if request.method == 'POST':
        book = get_object_or_404(Book, id=book_id)
        action = request.POST.get('action')
        
        try:
            cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.get(cart=cart, book=book)
            
            if action == 'decrease':
                if cart_item.quantity > 1:
                    cart_item.quantity -= 1
                    cart_item.save()
                    messages.success(request, f"Decreased {book.title} quantity.")
                else:
                    cart_item.delete()
                    messages.success(request, f"Removed {book.title} from your cart.")
            
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            messages.error(request, "Book not found in your cart.")
    
    return redirect('view_cart')

def book_detail(request, book_id):
    """View book details"""
    book = get_object_or_404(Book, id=book_id)

    # Check if book is in user's wishlist (if logged in)
    in_wishlist = False
    if request.user.is_authenticated:
        in_wishlist = Wishlist.objects.filter(user=request.user, book=book).exists()

    return render(request, 'bookshop/book_detail.html', {
        'book': book,
        'in_wishlist': in_wishlist
    })

@login_required
def cancel_order(request, order_id):
    """Cancel order - only for superusers"""
    if not request.user.is_superuser:
        messages.error(request, "You don't have permission to cancel orders.")
        return redirect('home')
    
    order = get_object_or_404(Order, id=order_id)
    
    if order.status == 'cancelled':
        messages.warning(request, f"Order {order.order_number} is already cancelled.")
        return redirect('admin_orders')
    
    # Restore stock for cancelled items
    for item in order.items.all():
        item.book.stock += item.quantity
        item.book.save()
    
    # Update order status
    order.status = 'cancelled'
    order.save()
    
    messages.success(request, f"Order {order.order_number} has been cancelled successfully.")
    return redirect('admin_orders')

@login_required
def admin_orders(request):
    """Admin view to see all orders"""
    if not request.user.is_superuser:
        messages.error(request, "You don't have permission to view this page.")
        return redirect('home')
    
    orders = Order.objects.all().order_by('-created_at')
    return render(request, 'bookshop/admin_orders.html', {
        'orders': orders
    })



   
