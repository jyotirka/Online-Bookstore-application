from django.contrib import admin
from .models import Book, Cart, CartItem, Order, OrderItem, Wishlist

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'get_total_items', 'get_total_price']
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['book', 'quantity', 'price', 'get_total_price']

class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'user__username', 'billing_name']
    readonly_fields = ['order_number', 'total_amount', 'created_at', 'updated_at']
    inlines = [OrderItemInline]

    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'total_amount', 'created_at', 'updated_at')
        }),
        ('Billing Information', {
            'fields': ('billing_name', 'billing_email', 'billing_phone', 'billing_address', 'billing_city', 'billing_postal_code')
        }),
    )

class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'added_at']
    list_filter = ['added_at']
    search_fields = ['user__username', 'book__title']

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price', 'stock')    

admin.site.register(Book)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(Wishlist, WishlistAdmin)

# Customize admin site headers
admin.site.site_header = "The Book Haven Administration"
admin.site.site_title = "The Book Haven Admin"
admin.site.index_title = "Welcome to The Book Haven Administration"
