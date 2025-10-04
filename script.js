// Coffee shop location - Updated coordinates for Baillie Park area
// To get exact coordinates: Visit Google Maps, right-click on your exact location, and copy the coordinates
// If the location is still not accurate, you can:
// 1. Report incorrect location to Google Maps (Suggest an edit)
// 2. Update these coordinates with the exact lat/lng from Google Maps
const coffeeShopLocation = {
    lat: -26.7167, // Correct coordinates for 34 Holtzhausen Rd, Potchefstroom
    lng: 27.1000, // Next to Kooperasie Kroeg & Kos
    name: "Surf & Turf Coffee",
    address: "34 Holtzhausen Rd, Potchefstroom"
};

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
        initializeMap();
    }, 500);
});

function initializeMap() {
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // Show loading state
    mapContainer.innerHTML = '<div class="map-loading">Loading map...</div>';

    // Try to load Leaflet with shorter timeout
    Promise.race([
        addLeafletResources(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ])
    .then(() => {
        // Wait a bit for resources to be fully loaded
        setTimeout(() => {
            createMap();
        }, 100);
    })
    .catch((error) => {
        console.error('Leaflet failed, using Google Maps:', error);
        // Use Google Maps embed as primary solution
        createGoogleMapsEmbed();
    });
}

function addLeafletResources() {
    return new Promise((resolve, reject) => {
        // Add Leaflet CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        cssLink.crossOrigin = '';
        document.head.appendChild(cssLink);

        // Add Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Leaflet'));
        
        document.head.appendChild(script);
    });
}

function createMap() {
    try {
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            throw new Error('Leaflet not loaded');
        }

        // Show loading message
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            throw new Error('Map element not found');
        }

        // Initialize the map
        const map = L.map('map').setView([coffeeShopLocation.lat, coffeeShopLocation.lng], 15);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Create custom icon for coffee shop
        const coffeeIcon = L.divIcon({
            html: `
                <div style="
                    background: linear-gradient(135deg, #20b2aa 0%, #008b8b 100%);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    border: 3px solid white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                ">☕</div>
            `,
            className: 'custom-coffee-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Add marker for coffee shop
        const marker = L.marker([coffeeShopLocation.lat, coffeeShopLocation.lng], {
            icon: coffeeIcon
        }).addTo(map);

        // Add popup to marker
        marker.bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 1.2em;">
                    ${coffeeShopLocation.name}
                </h3>
                <p style="margin: 0; color: #7f8c8d; font-size: 0.9em;">
                    ${coffeeShopLocation.address}
                </p>
                <p style="margin: 5px 0 0 0; color: #27ae60; font-size: 0.8em; font-style: italic;">
                    We bring the good vibes ✨
                </p>
                <button onclick="openDirections()" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #20b2aa 0%, #008b8b 100%);
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9em;
                    font-weight: 500;
                ">Get Directions</button>
            </div>
        `).openPopup();

        // Add circle to show approximate area
        L.circle([coffeeShopLocation.lat, coffeeShopLocation.lng], {
            color: '#20b2aa',
            fillColor: '#20b2aa',
            fillOpacity: 0.1,
            radius: 100
        }).addTo(map);

        console.log('Map initialized successfully');
        
    } catch (error) {
        console.error('Error creating map:', error);
        createGoogleMapsEmbed();
    }
}

function createGoogleMapsEmbed() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Create a simple, reliable Google Maps embed without API key
    const address = encodeURIComponent("34 Holtzhausen Rd, Potchefstroom, South Africa");
    
    mapElement.innerHTML = `
        <iframe
            width="100%"
            height="100%"
            style="border:0; border-radius: 20px;"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed">
        </iframe>
    `;
    
    console.log('Google Maps embed loaded successfully');
}

function showMapError() {
    const mapElement = document.getElementById('map');
    mapElement.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            background: #f8f9fa;
            color: #6c757d;
            text-align: center;
            padding: 20px;
        ">
            <div style="font-size: 3em; margin-bottom: 15px;">📍</div>
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Map Unavailable</h3>
            <p style="margin: 0; font-size: 0.9em;">
                ${coffeeShopLocation.name}<br>
                ${coffeeShopLocation.address}
            </p>
            <button onclick="openDirections()" style="
                margin-top: 15px;
                padding: 10px 20px;
                background: linear-gradient(135deg, #20b2aa 0%, #008b8b 100%);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 1em;
                font-weight: 500;
            ">Get Directions</button>
        </div>
    `;
}

function openDirections() {
    const address = encodeURIComponent(coffeeShopLocation.address);
    const coords = `${coffeeShopLocation.lat},${coffeeShopLocation.lng}`;
    
    // Try to open in Google Maps app first, then fallback to web
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}&destination_place_id=${address}`;
    
    // For mobile devices, try to open native apps
    if (/Android/i.test(navigator.userAgent)) {
        window.open(`geo:${coords}?q=${coords}(${encodeURIComponent(coffeeShopLocation.name)})`, '_blank');
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.open(`maps://maps.google.com/maps?daddr=${coords}&amp;ll=`, '_blank');
    } else {
        window.open(googleMapsUrl, '_blank');
    }
}

// Menu tab functionality
function initializeMenuTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuGrids = document.querySelectorAll('.menu-grid');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all menu grids
            menuGrids.forEach(grid => grid.classList.add('hidden'));
            
            // Show the selected menu grid
            const category = button.getAttribute('data-category');
            const targetGrid = document.getElementById(category);
            if (targetGrid) {
                targetGrid.classList.remove('hidden');
            }
        });
    });
}

// Expandable menu items functionality
function initializeExpandableMenuItems() {
    const expandableItems = document.querySelectorAll('.expandable-item');
    
    expandableItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't expand if clicking on a size option
            if (e.target.closest('.size-option')) {
                return;
            }
            
            const itemDetails = item.querySelector('.item-details');
            const isExpanded = item.classList.contains('expanded');
            
            // Close all other expanded items
            expandableItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('expanded');
                    const otherDetails = otherItem.querySelector('.item-details');
                    otherDetails.classList.remove('show');
                    
                    // Hide alternative milk options when closing other items
                    const milkAlternatives = otherItem.querySelector('.milk-alternatives');
                    if (milkAlternatives) {
                        milkAlternatives.style.display = 'none';
                    }
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                item.classList.remove('expanded');
                itemDetails.classList.remove('show');
                
                // Reset all selections when closing
                resetItemSelections(item);
            } else {
                item.classList.add('expanded');
                itemDetails.classList.add('show');
                
                // Hide alternative milk options when item is first opened
                const milkAlternatives = item.querySelector('.milk-alternatives');
                if (milkAlternatives) {
                    milkAlternatives.style.display = 'none';
                }
            }
        });
    });
}

// Size selection functionality
function initializeSizeSelection() {
    const sizeOptions = document.querySelectorAll('.size-option');
    const alternativeOptions = document.querySelectorAll('.alternative-option');
    
    // Handle size selection
    sizeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent item from collapsing
            
            const menuItem = option.closest('.expandable-item');
            const allSizeOptions = menuItem.querySelectorAll('.size-option');
            const milkAlternatives = menuItem.querySelector('.milk-alternatives');
            
            // Remove selected class from all size options in this item
            allSizeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Store the selected size for potential alternative milk selection
            const sizeName = option.querySelector('.size-name') ? option.querySelector('.size-name').textContent : 'Large';
            const basePrice = parseInt(option.querySelector('.size-price').textContent.replace('R', ''));
            menuItem.dataset.selectedSize = sizeName;
            menuItem.dataset.basePrice = basePrice;
            
            // Show alternative milk options and update prices
            if (milkAlternatives) {
                milkAlternatives.style.display = 'block';
                updateAlternativeMilkPrices(menuItem, basePrice);
            } else {
                // No alternative milk options - add directly to cart
                const itemName = menuItem.querySelector('h3').textContent;
                const selectedSize = sizeName || 'Large';
                addToCart(itemName, selectedSize, basePrice);
                
                // Close the expanded item after adding to cart
                menuItem.classList.remove('expanded');
                const itemDetails = menuItem.querySelector('.item-details');
                itemDetails.classList.remove('show');
            }
        });
    });
    
    // Handle alternative milk selection
    alternativeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const menuItem = option.closest('.expandable-item');
            const allAlternativeOptions = menuItem.querySelectorAll('.alternative-option');
            
            // Remove selected class from all alternative options in this item
            allAlternativeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Get item details
            const itemName = menuItem.querySelector('h3').textContent;
            const sizeName = menuItem.dataset.selectedSize;
            const basePrice = parseInt(menuItem.dataset.basePrice);
            const addPrice = parseInt(option.dataset.addPrice);
            const totalPrice = basePrice + addPrice;
            const milkName = option.querySelector('.milk-name').textContent;
            
            // Format the cart item name based on milk type
            let cartItemName;
            if (option.dataset.milk === 'regular') {
                cartItemName = `${sizeName}`; // Just show size for regular milk
            } else if (option.dataset.milk === 'warm' || option.dataset.milk === 'cold') {
                cartItemName = `${sizeName} (${milkName})`; // Show size and milk type for warm/cold
            } else {
                cartItemName = `${sizeName} (${milkName})`; // Show size and milk type for alternatives
            }
            
            // Add to cart with milk option
            addToCart(itemName, cartItemName, totalPrice);
            
            // Close the expanded item after adding to cart
            menuItem.classList.remove('expanded');
            const itemDetails = menuItem.querySelector('.item-details');
            itemDetails.classList.remove('show');
        });
    });
}

// Function to reset all selections in an item
function resetItemSelections(menuItem) {
    // Clear size selections
    const sizeOptions = menuItem.querySelectorAll('.size-option');
    sizeOptions.forEach(option => option.classList.remove('selected'));
    
    // Clear alternative milk selections
    const alternativeOptions = menuItem.querySelectorAll('.alternative-option');
    alternativeOptions.forEach(option => option.classList.remove('selected'));
    
    // Hide alternative milk options
    const milkAlternatives = menuItem.querySelector('.milk-alternatives');
    if (milkAlternatives) {
        milkAlternatives.style.display = 'none';
    }
    
    // Clear stored data
    delete menuItem.dataset.selectedSize;
    delete menuItem.dataset.basePrice;
}

// Function to update alternative milk prices based on selected size
function updateAlternativeMilkPrices(menuItem, basePrice) {
    const alternativeOptions = menuItem.querySelectorAll('.alternative-option');
    const sizeName = menuItem.dataset.selectedSize;
    
    // Determine add-on price based on size
    let addPrice;
    if (sizeName.toLowerCase().includes('small') || sizeName.toLowerCase().includes('single')) {
        addPrice = 8;
    } else if (sizeName.toLowerCase().includes('medium') || sizeName.toLowerCase().includes('double')) {
        addPrice = 12;
    } else if (sizeName.toLowerCase().includes('large')) {
        addPrice = 16;
    } else {
        addPrice = 8; // Default fallback
    }
    
    // Check if this is an iced coffee drink - use medium pricing for all sizes
    const menuItemName = menuItem.querySelector('h3').textContent.toLowerCase();
    const isIcedCoffee = menuItemName.includes('iced coffee') || 
                        menuItemName.includes('iced americano') || 
                        menuItemName.includes('flavored iced coffee') || 
                        menuItemName.includes('iced mocha');
    
    if (isIcedCoffee) {
        addPrice = 12; // Use medium pricing for all iced coffee drinks
    }
    
    alternativeOptions.forEach(option => {
        const milkType = option.dataset.milk;
        const priceSpan = option.querySelector('.add-price');
        
        if (milkType === 'regular' || milkType === 'warm' || milkType === 'cold') {
            // Regular milk, warm milk, and cold milk are always free
            priceSpan.textContent = '+R0';
            option.dataset.addPrice = 0;
        } else {
            // Alternative milks use size-based pricing
            priceSpan.textContent = `+R${addPrice}`;
            option.dataset.addPrice = addPrice;
        }
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.sticky-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
function initializeHeaderEffect() {
    const header = document.querySelector('.sticky-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Initialize all interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initializeMap();
    
    // Initialize menu tabs
    initializeMenuTabs();
    
    // Initialize expandable menu items
    initializeExpandableMenuItems();
    
    // Initialize size selection
    initializeSizeSelection();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize header effects
    initializeHeaderEffect();
    
    // Add click animations to cards
    const cards = document.querySelectorAll('.address-card, .hours-card, .order-option');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Initialize cart system
    loadCart();
    initializePaymentToggle();
});

// Cart System
let cart = [];
let cartTotal = 0;

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('surfTurfCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('surfTurfCart', JSON.stringify(cart));
}

// Clear cart function
function clearCart() {
    if (cart.length === 0) {
        return; // Cart is already empty
    }
    
    // Show custom confirmation modal
    const modal = document.getElementById('clear-cart-modal');
    modal.classList.add('show');
}

// Close clear cart modal
function closeClearCartModal() {
    const modal = document.getElementById('clear-cart-modal');
    modal.classList.remove('show');
}

// Confirm clear cart
function confirmClearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
    updateCartCount();
    closeClearCartModal();
    closeCart(); // Close the cart sidebar as well
}

// Add item to cart
function addToCart(itemName, sizeName, price) {
    const existingItem = cart.find(item => 
        item.name === itemName && item.size === sizeName
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name: itemName,
            size: sizeName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartCount();
    saveCart();
    
    // Show feedback
    showAddToCartFeedback(itemName, sizeName);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateCartCount();
    saveCart();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
            updateCartCount();
            saveCart();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #636e72;">Your cart is empty</p>';
        cartTotal = 0;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.size} - R${item.price}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
        
        cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    cartTotalElement.textContent = cartTotal;
}

// Update cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Show/hide count badge
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Cart UI functions
function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
}

// Checkout functions
function openCheckout() {
    if (cart.length === 0) {
        showEmptyCartModal();
        return;
    }
    
    closeCart();
    document.getElementById('checkout-modal').classList.add('show');
    updateCheckoutDisplay();
    setMinDeliveryDateTime();
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('show');
}

function updateCheckoutDisplay() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalElement = document.getElementById('checkout-total');
    
    checkoutItemsContainer.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>${item.name} (${item.size}) x${item.quantity}</span>
            <span>R${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    checkoutTotalElement.textContent = cartTotal;
}

// Set minimum delivery date and time
function setMinDeliveryDateTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set minimum date to tomorrow
    document.getElementById('delivery-date').min = tomorrow.toISOString().split('T')[0];
    document.getElementById('delivery-date').value = tomorrow.toISOString().split('T')[0];
    
    // Set minimum time (if ordering for today, set to current time + 2 hours)
    const minTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const timeString = minTime.toTimeString().slice(0, 5);
    document.getElementById('delivery-time').value = timeString;
}

// Place order function
function placeOrder() {
    // Validate form
    const requiredFields = [
        'customer-name', 'customer-phone', 'customer-email',
        'delivery-address', 'delivery-date', 'delivery-time'
    ];
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            alert(`Please fill in ${field.placeholder || fieldId}`);
            field.focus();
            return;
        }
    }
    
    // Validate payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    if (paymentMethod === 'card') {
        const cardFields = ['card-number', 'card-expiry', 'card-cvv', 'card-name'];
        for (let fieldId of cardFields) {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                alert(`Please fill in ${field.placeholder}`);
                field.focus();
                return;
            }
        }
    }
    
    // Create order object
    const order = {
        id: 'ST' + Date.now(),
        items: [...cart],
        total: cartTotal,
        customer: {
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value
        },
        delivery: {
            address: document.getElementById('delivery-address').value,
            date: document.getElementById('delivery-date').value,
            time: document.getElementById('delivery-time').value,
            notes: document.getElementById('delivery-notes').value
        },
        payment: {
            method: paymentMethod,
            status: paymentMethod === 'cash' ? 'pending' : 'processing'
        },
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Process order
    processOrder(order);
}

// Process order (simulate backend processing)
function processOrder(order) {
    // Show loading state
    const placeOrderBtn = document.querySelector('.place-order-btn');
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
        // Save order to localStorage (in real app, send to backend)
        const orders = JSON.parse(localStorage.getItem('surfTurfOrders') || '[]');
        orders.push(order);
        localStorage.setItem('surfTurfOrders', JSON.stringify(orders));
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Close checkout and show confirmation
        closeCheckout();
        showOrderConfirmation(order);
        
        // Reset button
        placeOrderBtn.textContent = 'Place Order';
        placeOrderBtn.disabled = false;
    }, 2000);
}

// Show order confirmation
function showOrderConfirmation(order) {
    const modal = document.getElementById('confirmation-modal');
    const orderDetails = document.getElementById('order-details');
    
    orderDetails.innerHTML = `
        <div style="text-align: left; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Total:</strong> R${order.total}</p>
            <p><strong>Delivery Date:</strong> ${order.delivery.date}</p>
            <p><strong>Delivery Time:</strong> ${order.delivery.time}</p>
            <p><strong>Payment:</strong> ${order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment'}</p>
        </div>
        <p style="color: #20b2aa; font-weight: 600;">
            We'll contact you shortly to confirm your delivery details!
        </p>
    `;
    
    modal.classList.add('show');
}

function closeConfirmation() {
    document.getElementById('confirmation-modal').classList.remove('show');
}

// Empty cart modal functions
function showEmptyCartModal() {
    document.getElementById('empty-cart-modal').classList.add('show');
}

function closeEmptyCartModal() {
    document.getElementById('empty-cart-modal').classList.remove('show');
}

function browseMenu() {
    closeEmptyCartModal();
    closeCart(); // Close the cart sidebar as well
    // Scroll to menu section
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        const headerHeight = document.querySelector('.sticky-header').offsetHeight;
        const targetPosition = menuSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Add to cart feedback
function showAddToCartFeedback(itemName, sizeName) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = `${itemName} (${sizeName}) added to cart!`;
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #20b2aa;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1004;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 300);
    }, 3000);
}

// Payment method toggle
function initializePaymentToggle() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('card-payment-form');
    
    if (paymentRadios.length > 0 && cardForm) {
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'card') {
                    cardForm.style.display = 'block';
                } else {
                    cardForm.style.display = 'none';
                }
            });
        });
    }
}

// Add CSS animation for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

