from django.urls import path
from . import views


urlpatterns = [

    path('', views.home, name='home'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('add-to-cart/<int:book_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:book_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('update-cart-quantity/<int:book_id>/', views.update_cart_quantity, name='update_cart_quantity'),
    path('cart/', views.view_cart, name='view_cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('bill/<int:order_id>/', views.order_bill, name='order_bill'),
    path('book/<int:book_id>/', views.book_detail, name='book_detail'),

    # Search URL
    path('search/', views.home, name='search'),

    # Profile URLs
    path('profile/', views.user_profile, name='user_profile'),
    path('profile/orders/', views.user_orders, name='user_orders'),
    path('profile/wishlist/', views.user_wishlist, name='user_wishlist'),
    path('add-to-wishlist/<int:book_id>/', views.add_to_wishlist, name='add_to_wishlist'),
    path('remove-from-wishlist/<int:book_id>/', views.remove_from_wishlist, name='remove_from_wishlist'),
    
    # Admin URLs
    path('manage-orders/', views.admin_orders, name='admin_orders'),
    path('cancel-order/<int:order_id>/', views.cancel_order, name='cancel_order'),

  
]



