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
                
                // Center the menu item when it's expanded
                setTimeout(() => {
                    centerMenuItem(item);
                }, 100);
                
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
                
                // Auto-scroll to ensure milk alternatives are visible
                setTimeout(() => {
                    scrollToMilkAlternatives(menuItem);
                }, 100);
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
                cartItemName = `${sizeName}`; // Just show size for full cream milk
            } else if (option.dataset.milk === 'skinny') {
                cartItemName = `${sizeName} (Low Fat)`; // Show size and low fat for low fat milk
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

// Function to center a menu item when it's expanded
function centerMenuItem(menuItem) {
    // Get the position of the entire menu item
    const menuItemRect = menuItem.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if the entire menu item is already centered and visible
    const menuItemTop = menuItemRect.top + window.pageYOffset;
    const menuItemHeight = menuItemRect.height;
    const idealCenter = menuItemTop + (menuItemHeight / 2);
    const viewportCenter = window.pageYOffset + (viewportHeight / 2);
    
    // Calculate how far off-center the menu item is
    const offsetFromCenter = Math.abs(idealCenter - viewportCenter);
    
    // Only scroll if the menu item is significantly off-center (more than 100px)
    if (offsetFromCenter > 100) {
        // Calculate the target scroll position to center the menu item
        const targetScrollTop = menuItemTop - (viewportHeight / 2) + (menuItemHeight / 2);
        
        // Ensure we don't scroll above the top of the page
        const finalScrollTop = Math.max(0, targetScrollTop);
        
        // Smooth scroll to center the menu item
        window.scrollTo({
            top: finalScrollTop,
            behavior: 'smooth'
        });
    }
}

// Function to scroll to center the entire menu item when milk alternatives appear
function scrollToMilkAlternatives(menuItem) {
    const milkAlternatives = menuItem.querySelector('.milk-alternatives');
    if (!milkAlternatives) return;
    
    // Get the position of the entire menu item
    const menuItemRect = menuItem.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if the entire menu item is already centered and visible
    const menuItemTop = menuItemRect.top + window.pageYOffset;
    const menuItemHeight = menuItemRect.height;
    const idealCenter = menuItemTop + (menuItemHeight / 2);
    const viewportCenter = window.pageYOffset + (viewportHeight / 2);
    
    // Calculate how far off-center the menu item is
    const offsetFromCenter = Math.abs(idealCenter - viewportCenter);
    
    // Only scroll if the menu item is significantly off-center (more than 100px)
    if (offsetFromCenter > 100) {
        // Calculate the target scroll position to center the menu item
        const targetScrollTop = menuItemTop - (viewportHeight / 2) + (menuItemHeight / 2);
        
        // Ensure we don't scroll above the top of the page
        const finalScrollTop = Math.max(0, targetScrollTop);
        
        // Smooth scroll to center the menu item
        window.scrollTo({
            top: finalScrollTop,
            behavior: 'smooth'
        });
    }
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
        
        if (milkType === 'regular' || milkType === 'skinny' || milkType === 'warm' || milkType === 'cold') {
            // Full cream milk, low fat milk, warm milk, and cold milk are always free
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
    
    // Prevent background scrolling
    preventBackgroundScroll();
}

// Close clear cart modal
function closeClearCartModal() {
    const modal = document.getElementById('clear-cart-modal');
    modal.classList.remove('show');
    
    // Add a small delay before restoring scroll to prevent conflicts
    setTimeout(() => {
        // Re-enable background scrolling
        enableBackgroundScroll();
    }, 50);
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
    
    // Prevent background scrolling
    preventBackgroundScroll();
    
    // Initialize sticky header functionality
    initializeStickyCheckoutHeader();
    
    // Initialize auto-resizing textareas
    initializeAutoResizeTextareas();
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('show');
    
    // Add a small delay before restoring scroll to prevent conflicts
    setTimeout(() => {
        // Re-enable background scrolling
        enableBackgroundScroll();
        
        // Clean up auto-resize textareas
        cleanupAutoResizeTextareas();
    }, 50);
}

// Prevent background scrolling when modal is open
function preventBackgroundScroll() {
    // Store current scroll position more accurately
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // Add class to body to prevent scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.left = '0';
    document.body.style.right = '0';
    
    // Store scroll position for restoration
    document.body.dataset.scrollY = scrollY.toString();
    
    // Prevent touch scrolling on mobile devices
    document.body.style.touchAction = 'none';
}

// Re-enable background scrolling when modal is closed
function enableBackgroundScroll() {
    // Get the stored scroll position before removing styles
    const scrollY = document.body.dataset.scrollY;
    
    // Remove fixed positioning
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    
    // Clean up the stored scroll position
    delete document.body.dataset.scrollY;
    
    // Restore scroll position with a slight delay to ensure DOM is ready
    if (scrollY) {
        // Use a small timeout to ensure all DOM updates are complete
        setTimeout(() => {
            // Double-check that we have a valid scroll position
            const targetScrollY = parseInt(scrollY);
            if (targetScrollY >= 0) {
                window.scrollTo({
                    top: targetScrollY,
                    left: 0,
                    behavior: 'instant' // Use instant to prevent smooth scrolling
                });
            }
        }, 10);
    }
}

// Initialize auto-resizing textareas
function initializeAutoResizeTextareas() {
    const textareas = document.querySelectorAll('#delivery-address, #delivery-notes');
    
    textareas.forEach(textarea => {
        // Set initial height
        autoResizeTextarea(textarea);
        
        // Add event listeners
        textarea.addEventListener('input', () => autoResizeTextarea(textarea));
        textarea.addEventListener('paste', () => {
            // Handle paste events with a slight delay
            setTimeout(() => autoResizeTextarea(textarea), 10);
        });
        
        // Handle focus events
        textarea.addEventListener('focus', () => autoResizeTextarea(textarea));
    });
}

// Auto-resize textarea function
function autoResizeTextarea(textarea) {
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate the new height based on content
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 50), 200);
    
    // Apply the new height
    textarea.style.height = newHeight + 'px';
    
    // If content exceeds max height, show scrollbar
    if (textarea.scrollHeight > 200) {
        textarea.style.overflowY = 'auto';
    } else {
        textarea.style.overflowY = 'hidden';
    }
}

// Clean up auto-resize textareas
function cleanupAutoResizeTextareas() {
    const textareas = document.querySelectorAll('#delivery-address, #delivery-notes');
    
    textareas.forEach(textarea => {
        // Reset styles
        textarea.style.height = '';
        textarea.style.overflowY = '';
        
        // Remove event listeners by cloning the element
        const newTextarea = textarea.cloneNode(true);
        textarea.parentNode.replaceChild(newTextarea, textarea);
    });
}

// Initialize sticky checkout header
function initializeStickyCheckoutHeader() {
    const checkoutContent = document.querySelector('.checkout-content');
    const checkoutHeader = document.querySelector('.checkout-header');
    
    if (!checkoutContent || !checkoutHeader) return;
    
    // Add scroll listener to enhance sticky header
    const handleScroll = () => {
        const scrollTop = checkoutContent.scrollTop;
        
        if (scrollTop > 10) {
            checkoutHeader.classList.add('sticky');
        } else {
            checkoutHeader.classList.remove('sticky');
        }
    };
    
    // Add scroll listener
    checkoutContent.addEventListener('scroll', handleScroll);
    
    // Clean up when modal is closed
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const modal = document.getElementById('checkout-modal');
                if (!modal.classList.contains('show')) {
                    checkoutContent.removeEventListener('scroll', handleScroll);
                    checkoutHeader.classList.remove('sticky');
                    observer.disconnect();
                }
            }
        });
    });
    
    observer.observe(document.getElementById('checkout-modal'), {
        attributes: true,
        attributeFilter: ['class']
    });
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

// ==========================================
// CUSTOM ERROR MESSAGE SYSTEM
// ==========================================

// Enhanced error message system
function showErrorMessage(title, message, fieldId = null) {
    // Remove any existing error messages
    removeAllMessages();
    
    // Add error class to field if specified
    if (fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            field.focus();
            
            // Scroll to field if it's not visible
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add a subtle vibration effect (if supported)
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Remove error class after 4 seconds
            setTimeout(() => {
                field.classList.remove('error');
            }, 4000);
        }
    }
    
    // Get appropriate icon based on error type
    let icon = '⚠️';
    if (title.includes('Missing')) icon = '📝';
    else if (title.includes('Invalid')) icon = '❌';
    else if (title.includes('Email')) icon = '📧';
    else if (title.includes('Phone')) icon = '📱';
    else if (title.includes('Date')) icon = '📅';
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    
    // Add special class for name field errors
    if (fieldId === 'customer-name') {
        errorDiv.classList.add('name-error');
    }
    
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">${icon}</span>
            <div>
                <div class="error-title">${title}</div>
                <div class="error-text">${message}</div>
            </div>
        </div>
        <button class="error-close" onclick="removeAllMessages()" title="Close">&times;</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Add click outside to close functionality
    const closeOnClickOutside = (e) => {
        if (!errorDiv.contains(e.target)) {
            removeAllMessages();
            document.removeEventListener('click', closeOnClickOutside);
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    
    // Add escape key to close functionality
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            removeAllMessages();
            document.removeEventListener('click', closeOnClickOutside);
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    
    // Add event listeners after a short delay
    setTimeout(() => {
        document.addEventListener('click', closeOnClickOutside);
        document.addEventListener('keydown', closeOnEscape);
    }, 100);
    
    // Auto-remove after 6 seconds (increased from 5)
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            errorDiv.style.animation = 'slideOutError 0.4s ease';
            setTimeout(() => {
                if (document.body.contains(errorDiv)) {
                    document.body.removeChild(errorDiv);
                }
                document.removeEventListener('click', closeOnClickOutside);
                document.removeEventListener('keydown', closeOnEscape);
            }, 400);
        }
    }, 6000);
}

// Show custom success message
function showSuccessMessage(title, message) {
    removeAllMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <div>
                <div class="success-title">${title}</div>
                <div class="success-text">${message}</div>
            </div>
        </div>
        <button class="success-close" onclick="removeAllMessages()">&times;</button>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (document.body.contains(successDiv)) {
            successDiv.style.animation = 'slideOutError 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
            }, 300);
        }
    }, 4000);
}

// Remove all messages
function removeAllMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    const successMessages = document.querySelectorAll('.success-message');
    
    [...errorMessages, ...successMessages].forEach(message => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    });
}

// Place order function
function placeOrder() {
    // Clear any existing error states
    document.querySelectorAll('.checkout-form input, .checkout-form textarea').forEach(field => {
        field.classList.remove('error');
    });
    
    // Validate form
    const requiredFields = [
        { id: 'customer-name', name: 'Full Name' },
        { id: 'customer-phone', name: 'Phone Number' },
        { id: 'customer-email', name: 'Email Address' },
        { id: 'delivery-address', name: 'Delivery Address' },
        { id: 'delivery-date', name: 'Delivery Date' },
        { id: 'delivery-time', name: 'Delivery Time' }
    ];
    
    for (let field of requiredFields) {
        const fieldElement = document.getElementById(field.id);
        if (!fieldElement || !fieldElement.value.trim()) {
            let helpfulMessage = '';
            switch (field.id) {
                case 'customer-name':
                    helpfulMessage = 'Hi there! 👋 We\'d love to know your name so we can personalize your coffee experience and make sure your order gets to the right person.';
                    break;
                case 'customer-phone':
                    helpfulMessage = 'Your phone number helps us contact you about your order and delivery.';
                    break;
                case 'customer-email':
                    helpfulMessage = 'We\'d love to send you a receipt and order confirmation via email! 📧';
                    break;
                case 'delivery-address':
                    helpfulMessage = 'Please provide your complete delivery address so we know where to bring your order.';
                    break;
                case 'delivery-date':
                    helpfulMessage = 'When would you like your order delivered? Please select a date.';
                    break;
                case 'delivery-time':
                    helpfulMessage = 'What time would be convenient for your delivery?';
                    break;
                default:
                    helpfulMessage = `Please fill in your ${field.name.toLowerCase()}.`;
            }
            
            // Create more friendly titles for specific fields
            let friendlyTitle = `Missing ${field.name}`;
            if (field.id === 'customer-name') {
                friendlyTitle = 'What\'s Your Name?';
            } else if (field.id === 'customer-phone') {
                friendlyTitle = 'Phone Number Needed';
            } else if (field.id === 'customer-email') {
                friendlyTitle = 'Email Address Needed';
            } else if (field.id === 'delivery-address') {
                friendlyTitle = 'Where Should We Deliver?';
            } else if (field.id === 'delivery-date') {
                friendlyTitle = 'When Would You Like It?';
            } else if (field.id === 'delivery-time') {
                friendlyTitle = 'What Time Works Best?';
            }
            
            showErrorMessage(
                friendlyTitle,
                helpfulMessage,
                field.id
            );
            return;
        }
    }
    
    // Validate phone number (basic validation)
    const phoneField = document.getElementById('customer-phone');
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneField.value)) {
        showErrorMessage(
            'Invalid Phone Number',
            'Please enter a valid phone number with at least 10 digits. We need this to contact you about your delivery.',
            'customer-phone'
        );
        return;
    }
    
    // Validate email address
    const emailField = document.getElementById('customer-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
        showErrorMessage(
            'Invalid Email Address',
            'Please enter a valid email address. We\'ll use this to send you your order confirmation and receipt.',
            'customer-email'
        );
        return;
    }
    
    // Validate delivery date (must be in the future)
    const deliveryDate = new Date(document.getElementById('delivery-date').value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deliveryDate < today) {
        showErrorMessage(
            'Invalid Delivery Date',
            'Please select a future date for your delivery. We can\'t deliver to yesterday! 😊',
            'delivery-date'
        );
        return;
    }
    
    // Create order object
    const order = {
        id: 'ST' + Date.now(),
        items: [...cart],
        total: cartTotal,
        customer: {
            name: document.getElementById('customer-name').value.trim(),
            phone: document.getElementById('customer-phone').value.trim(),
            email: document.getElementById('customer-email').value.trim()
        },
        delivery: {
            address: document.getElementById('delivery-address').value.trim(),
            date: document.getElementById('delivery-date').value,
            time: document.getElementById('delivery-time').value,
            notes: document.getElementById('delivery-notes').value.trim()
        },
        payment: {
            method: 'cash', // Since you're collecting payment on delivery
            status: 'pending'
        },
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Process order
    processOrder(order);
}

// ==========================================
// EMAIL NOTIFICATION SYSTEM
// ==========================================

// EmailJS configuration
const EMAIL_CONFIG = {
    enabled: false,
    publicKey: '',
    serviceId: '',
    templateId: '',
    shopEmail: 'surfandturfcoffee@gmail.com'
};

// Add missing WEBHOOK_CONFIG object
const WEBHOOK_CONFIG = {
    enabled: false,
    url: '',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Add missing SHOP_CONFIG object
const SHOP_CONFIG = {
    phoneNumber: '0847367281',
    whatsappEnabled: true,
    smsEnabled: true
};

// Load email configuration from localStorage
function loadEmailConfig() {
    const savedConfig = localStorage.getItem('surfTurfEmailConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        EMAIL_CONFIG.publicKey = config.publicKey || '';
        EMAIL_CONFIG.serviceId = config.serviceId || '';
        EMAIL_CONFIG.templateId = config.templateId || '';
        EMAIL_CONFIG.shopEmail = config.shopEmail || '';
        EMAIL_CONFIG.enabled = config.enabled || false;
    }
}

// Initialize EmailJS when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load all configurations
    loadEmailConfig();
    loadWebhookConfig();
    loadShopConfig();
    checkAdminSession();
    
    // Initialize EmailJS if configured
    if (EMAIL_CONFIG.enabled && EMAIL_CONFIG.publicKey) {
        emailjs.init(EMAIL_CONFIG.publicKey);
    }
    
    console.log('✅ All configurations loaded successfully');
});

// Process order (simulate backend processing)
function processOrder(order) {
    // Show loading state
    const placeOrderBtn = document.querySelector('.place-order-btn');
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate processing time
    setTimeout(async () => {
        // Save order to localStorage (in real app, send to backend)
        const orders = JSON.parse(localStorage.getItem('surfTurfOrders') || '[]');
        orders.push(order);
        localStorage.setItem('surfTurfOrders', JSON.stringify(orders));
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Close checkout and show receipt
        closeCheckout();
        
        // Small delay to ensure checkout is closed before showing receipt
        setTimeout(() => {
            generateReceipt(order);
        }, 300);
        
        // Send email notifications
        setTimeout(() => {
            sendEmailNotificationsImproved(order);
        }, 1000);
        
        // Show success message after receipt is displayed
        setTimeout(() => {
            showSuccessMessage(
                'Order Placed Successfully!',
                `Your order #${order.id} has been confirmed. We'll contact you soon!`
            );
        }, 500);
        
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
    
    // Prevent background scrolling for confirmation modal too
    preventBackgroundScroll();
}

function closeConfirmation() {
    document.getElementById('confirmation-modal').classList.remove('show');
    
    // Add a small delay before restoring scroll to prevent conflicts
    setTimeout(() => {
        // Re-enable background scrolling
        enableBackgroundScroll();
    }, 50);
}

// Empty cart modal functions
function showEmptyCartModal() {
    document.getElementById('empty-cart-modal').classList.add('show');
    
    // Prevent background scrolling
    preventBackgroundScroll();
}

function closeEmptyCartModal() {
    document.getElementById('empty-cart-modal').classList.remove('show');
    
    // Add a small delay before restoring scroll to prevent conflicts
    setTimeout(() => {
        // Re-enable background scrolling
        enableBackgroundScroll();
    }, 50);
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

// ==========================================
// RECEIPT SYSTEM
// ==========================================

// SHOP_CONFIG is already defined above

// Generate and display receipt
function generateReceipt(order) {
    const receiptBody = document.getElementById('receipt-body');
    
    const receiptHTML = `
        <div class="receipt-summary">
            <div class="receipt-order-id">
                <h3>Order #${order.id}</h3>
                <span class="receipt-status">✅ Confirmed</span>
            </div>
            
            <div class="receipt-customer">
                <p><strong>${order.customer.name}</strong></p>
                <p>📞 ${order.customer.phone}</p>
                ${order.customer.email ? `<p>📧 ${order.customer.email}</p>` : ''}
            </div>
            
            <div class="receipt-delivery">
                <p><strong>Delivery:</strong></p>
                <p>📅 ${formatDate(order.delivery.date)} at ${order.delivery.time}</p>
                <p>📍 ${order.delivery.address}</p>
                ${order.delivery.notes ? `<p><em>${order.delivery.notes}</em></p>` : ''}
            </div>
        </div>
        
        <div class="receipt-items">
            ${order.items.map(item => `
                <div class="receipt-item">
                    <span class="item-name">${item.name} (${item.size})</span>
                    <span class="item-qty">x${item.quantity}</span>
                    <span class="item-price">R${item.price * item.quantity}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="receipt-total-simple">
            <div class="total-line">
                <span>Total</span>
                <span><strong>R${order.total}</strong></span>
            </div>
            <p class="payment-info">💳 Payment: ${order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment'}</p>
        </div>
        
        <div class="receipt-actions">
            <button class="receipt-btn primary" onclick="closeReceipt()">
                Close
            </button>
        </div>
        
        <div class="receipt-footer-simple">
            <p>✅ Order sent to shop automatically</p>
            <p>Thank you for choosing Surf & Turf Coffee! ☕</p>
        </div>
    `;
    
    receiptBody.innerHTML = receiptHTML;
    
    // Show receipt modal
    const receiptModal = document.getElementById('receipt-modal');
    receiptModal.classList.add('show');
    preventBackgroundScroll();
    
    // Ensure modal is visible
    console.log('📄 Receipt modal displayed for order:', order.id);
}

// Close receipt modal
function closeReceipt() {
    document.getElementById('receipt-modal').classList.remove('show');
    
    setTimeout(() => {
        enableBackgroundScroll();
    }, 50);
}

// Print receipt
function printReceipt() {
    window.print();
}

// Send email notifications
function sendEmailNotifications(order) {
    if (!EMAIL_CONFIG.enabled) {
        console.log('📧 Email notifications not configured');
        return;
    }

    // Send customer receipt if email provided
    if (order.customer.email) {
        sendCustomerReceipt(order);
    }

    // Send shop notification
    sendShopNotification(order);
}

// Send customer receipt email
function sendCustomerReceipt(order) {
    if (!EMAIL_CONFIG.enabled || !order.customer.email) return;

    const templateParams = {
        customer_email: order.customer.email,
        customer_name: order.customer.name,
        order_id: order.id,
        order_date: formatDateTime(order.timestamp),
        delivery_date: formatDate(order.delivery.date),
        delivery_time: order.delivery.time,
        delivery_address: order.delivery.address,
        order_details: order.items.map(item => `${item.name} (${item.size}) x${item.quantity} - R${item.price * item.quantity}`).join('\n'),
        total: order.total,
        payment_method: order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment',
        shop_name: 'Surf & Turf Coffee',
        shop_phone: '+27 12 345 6789',
        shop_address: '34 Holtzhausen Rd, Potchefstroom'
    };

    emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
        .then(() => {
            console.log('✅ Customer receipt sent');
        })
        .catch((error) => {
            console.error('❌ Customer receipt failed:', error);
        });
}

// Send shop notification email
function sendShopNotification(order) {
    if (!EMAIL_CONFIG.enabled) return;

    const templateParams = {
        customer_email: 'surfandturfcoffee@gmail.com', // Shop email as recipient
        customer_name: 'Surf & Turf Coffee Team',
        order_id: order.id,
        order_date: formatDateTime(order.timestamp),
        delivery_date: formatDate(order.delivery.date),
        delivery_time: order.delivery.time,
        delivery_address: order.delivery.address,
        order_details: `NEW ORDER RECEIVED\n\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nEmail: ${order.customer.email || 'Not provided'}\n\nOrder Items:\n${order.items.map(item => `${item.name} (${item.size}) x${item.quantity} - R${item.price * item.quantity}`).join('\n')}\n\nTotal: R${order.total}\nPayment: ${order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment'}\n\nSpecial Instructions: ${order.delivery.notes || 'None'}`,
        total: order.total,
        payment_method: order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment',
        shop_name: 'Surf & Turf Coffee',
        shop_phone: '+27 12 345 6789',
        shop_address: '34 Holtzhausen Rd, Potchefstroom'
    };

    emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
        .then(() => {
            console.log('✅ Shop notification sent');
        })
        .catch((error) => {
            console.error('❌ Shop notification failed:', error);
        });
}

// Send webhook notification
async function sendWebhookNotification(order) {
    try {
        const webhookData = {
            orderId: order.id,
            timestamp: order.timestamp,
            customer: {
                name: order.customer.name,
                phone: order.customer.phone
            },
            delivery: {
                address: order.delivery.address,
                date: order.delivery.date,
                time: order.delivery.time,
                notes: order.delivery.notes
            },
            items: order.items.map(item => ({
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            total: order.total,
            paymentMethod: order.payment.method,
            message: generateShopReceiptMessage(order)
        };

        const response = await fetch(WEBHOOK_CONFIG.url, {
            method: WEBHOOK_CONFIG.method,
            headers: WEBHOOK_CONFIG.headers,
            body: JSON.stringify(webhookData)
        });

        if (response.ok) {
            console.log('✅ Webhook notification sent successfully');
            showSuccessMessage(
                'Order Sent!',
                'Order notification has been sent to the shop via webhook.'
            );
        } else {
            console.error('❌ Webhook failed:', response.status);
            // Fallback to WhatsApp
            sendOrderToShop(order);
        }
    } catch (error) {
        console.error('❌ Webhook error:', error);
        // Fallback to WhatsApp
        sendOrderToShop(order);
    }
}

// Automatically send order to shop (WhatsApp fallback)
function sendOrderToShop(order) {
    if (!SHOP_CONFIG.phoneNumber) {
        console.log('📱 Shop phone not configured, skipping automatic notification');
        return;
    }
    
    // Generate shop receipt message
    const shopMessage = generateShopReceiptMessage(order);
    
    // Try WhatsApp first, then SMS
    if (SHOP_CONFIG.whatsappEnabled) {
        sendWhatsAppMessage(shopMessage);
        console.log('📱 Order automatically sent to shop via WhatsApp');
    } else if (SHOP_CONFIG.smsEnabled) {
        sendSMSMessage(shopMessage);
        console.log('📱 Order automatically sent to shop via SMS');
    }
}

// Send receipt to shop phone (manual function - kept for compatibility)
function sendReceiptToShop(orderId) {
    const order = getOrderById(orderId);
    if (!order) {
        showErrorMessage('Order Not Found', 'Could not find the order details.');
        return;
    }
    
    if (!SHOP_CONFIG.phoneNumber) {
        showErrorMessage(
            'Shop Phone Not Configured',
            'Please contact the administrator to set up the shop phone number for receiving orders.',
            null
        );
        return;
    }
    
    // Generate shop receipt message
    const shopMessage = generateShopReceiptMessage(order);
    
    // Try WhatsApp first, then SMS
    if (SHOP_CONFIG.whatsappEnabled) {
        sendWhatsAppMessage(shopMessage);
    } else if (SHOP_CONFIG.smsEnabled) {
        sendSMSMessage(shopMessage);
    }
    
    showSuccessMessage(
        'Receipt Sent!',
        'The order receipt has been sent to the shop phone.'
    );
}

// Generate shop receipt message
function generateShopReceiptMessage(order) {
    const itemsText = order.items.map((item, index) => 
        `${index + 1}. ${item.name} (${item.size}) x${item.quantity} - R${item.price * item.quantity}`
    ).join('\n');
    
    return `🆕 NEW ORDER RECEIVED!

Order ID: ${order.id}
Time: ${formatDateTime(order.timestamp)}

👤 CUSTOMER DETAILS:
Name: ${order.customer.name}
Phone: ${order.customer.phone}

🚚 DELIVERY INFORMATION:
Address: ${order.delivery.address}
Date: ${formatDate(order.delivery.date)}
Time: ${order.delivery.time}
Notes: ${order.delivery.notes || 'None'}

☕ ORDER ITEMS:
${itemsText}

💰 TOTAL: R${order.total}
💳 Payment: ${order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment'}

---
Sent from Surf & Turf Coffee Website`;
}

// Send WhatsApp message
function sendWhatsAppMessage(message) {
    const phoneNumber = SHOP_CONFIG.phoneNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Send SMS message
function sendSMSMessage(message) {
    const phoneNumber = SHOP_CONFIG.phoneNumber.replace(/[^0-9]/g, '');
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
}

// Get order by ID
function getOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('surfTurfOrders') || '[]');
    return orders.find(order => order.id === orderId);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format date and time for display
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Set shop phone number (to be called by user)
function setShopPhoneNumber(phoneNumber) {
    SHOP_CONFIG.phoneNumber = phoneNumber;
    localStorage.setItem('surfTurfShopConfig', JSON.stringify(SHOP_CONFIG));
    showSuccessMessage(
        'Shop Phone Set!',
        `Shop phone number has been set to ${phoneNumber}. Orders will now be sent to this number.`
    );
}

// Set webhook configuration
function setWebhookConfig(url, enabled = true) {
    WEBHOOK_CONFIG.url = url;
    WEBHOOK_CONFIG.enabled = enabled;
    localStorage.setItem('surfTurfWebhookConfig', JSON.stringify(WEBHOOK_CONFIG));
    showSuccessMessage(
        'Webhook Configured!',
        `Webhook URL set to ${url}. Orders will be sent automatically via webhook.`
    );
}

// Load webhook configuration
function loadWebhookConfig() {
    const savedConfig = localStorage.getItem('surfTurfWebhookConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        WEBHOOK_CONFIG.url = config.url || '';
        WEBHOOK_CONFIG.enabled = config.enabled !== false;
    }
}

// Load shop configuration
function loadShopConfig() {
    const savedConfig = localStorage.getItem('surfTurfShopConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        SHOP_CONFIG.phoneNumber = config.phoneNumber || '0847367281';
        SHOP_CONFIG.whatsappEnabled = config.whatsappEnabled !== false;
        SHOP_CONFIG.smsEnabled = config.smsEnabled !== false;
    } else {
        // Set default shop number if no saved config
        SHOP_CONFIG.phoneNumber = '0847367281';
    }
}


// ==========================================
// ADMIN AUTHENTICATION SYSTEM
// ==========================================

// Admin credentials (change these for security)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'surfturf2025'
};

// Check if admin is logged in
function isAdminLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Open admin login modal
function openAdminLogin() {
    if (isAdminLoggedIn()) {
        openEmailSetup();
        return;
    }
    
    document.getElementById('admin-login-modal').classList.add('show');
    preventBackgroundScroll();
}

// Close admin login modal
function closeAdminLogin() {
    document.getElementById('admin-login-modal').classList.remove('show');
    
    setTimeout(() => {
        enableBackgroundScroll();
    }, 50);
}

// Admin login function
function adminLogin() {
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Login successful
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        
        // Update UI
        document.getElementById('admin-login-btn').style.display = 'none';
        document.getElementById('admin-logout-btn').style.display = 'flex';
        
        // Close login modal and open email setup
        closeAdminLogin();
        openEmailSetup();
        
        showSuccessMessage(
            'Admin Login Successful!',
            'Welcome to the admin panel.'
        );
    } else {
        showErrorMessage(
            'Invalid Credentials',
            'Please check your username and password.',
            'admin-username'
        );
    }
}

// Admin logout function
function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    
    // Update UI
    document.getElementById('admin-login-btn').style.display = 'flex';
    document.getElementById('admin-logout-btn').style.display = 'none';
    
    showSuccessMessage(
        'Logged Out',
        'You have been successfully logged out.'
    );
}

// Check admin session on page load
function checkAdminSession() {
    if (isAdminLoggedIn()) {
        // Check if session is still valid (24 hours)
        const loginTime = parseInt(localStorage.getItem('adminLoginTime') || '0');
        const now = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - loginTime > sessionDuration) {
            // Session expired
            adminLogout();
            return;
        }
        
        // Update UI for logged in state
        document.getElementById('admin-login-btn').style.display = 'none';
        document.getElementById('admin-logout-btn').style.display = 'flex';
    }
}

// ==========================================
// EMAIL SETUP FUNCTIONS
// ==========================================

// Open email setup modal
function openEmailSetup() {
    if (!isAdminLoggedIn()) {
        openAdminLogin();
        return;
    }
    
    document.getElementById('email-setup-modal').classList.add('show');
    preventBackgroundScroll();
    
    // Load current configuration
    document.getElementById('emailjs-public-key').value = EMAIL_CONFIG.publicKey || '';
    document.getElementById('emailjs-service-id').value = EMAIL_CONFIG.serviceId || '';
    document.getElementById('emailjs-template-id').value = EMAIL_CONFIG.templateId || '';
    document.getElementById('shop-email').value = EMAIL_CONFIG.shopEmail || '';
    document.getElementById('email-enabled').checked = EMAIL_CONFIG.enabled;
}

// Close email setup modal
function closeEmailSetup() {
    document.getElementById('email-setup-modal').classList.remove('show');
    
    setTimeout(() => {
        enableBackgroundScroll();
    }, 50);
}

// Save email configuration
function saveEmailConfig() {
    const publicKey = document.getElementById('emailjs-public-key').value.trim();
    const serviceId = document.getElementById('emailjs-service-id').value.trim();
    const templateId = document.getElementById('emailjs-template-id').value.trim();
    const shopEmail = document.getElementById('shop-email').value.trim();
    const enabled = document.getElementById('email-enabled').checked;

    // Validate required fields if enabled
    if (enabled) {
        if (!publicKey || !serviceId || !templateId || !shopEmail) {
            showErrorMessage(
                'Configuration Required',
                'Please fill in all EmailJS fields and shop email address.',
                'emailjs-public-key'
            );
            return;
        }
    }

    // Update configuration
    EMAIL_CONFIG.publicKey = publicKey;
    EMAIL_CONFIG.serviceId = serviceId;
    EMAIL_CONFIG.templateId = templateId;
    EMAIL_CONFIG.shopEmail = shopEmail;
    EMAIL_CONFIG.enabled = enabled;

    // Save to localStorage
    localStorage.setItem('surfTurfEmailConfig', JSON.stringify(EMAIL_CONFIG));

    // Initialize EmailJS if enabled
    if (enabled && publicKey) {
        emailjs.init(publicKey);
    }

    // Close modal and show success
    closeEmailSetup();
    
    showSuccessMessage(
        'Email Configuration Saved!',
        enabled ? 'Email notifications are now enabled.' : 'Email notifications are disabled.'
    );
}

// Save shop configuration
function saveShopConfig() {
    const phoneInput = document.getElementById('shop-phone');
    const whatsappCheckbox = document.getElementById('whatsapp-enabled');
    const smsCheckbox = document.getElementById('sms-enabled');
    const webhookUrlInput = document.getElementById('webhook-url');
    const webhookCheckbox = document.getElementById('webhook-enabled');
    
    const phoneNumber = phoneInput.value.trim();
    const webhookUrl = webhookUrlInput.value.trim();
    
    // Validate webhook URL if enabled
    if (webhookCheckbox.checked && webhookUrl) {
        try {
            new URL(webhookUrl);
        } catch (error) {
            showErrorMessage(
                'Invalid Webhook URL',
                'Please enter a valid webhook URL (e.g., https://hooks.zapier.com/...).',
                'webhook-url'
            );
            return;
        }
    }
    
    // Validate phone number if webhook is not enabled
    if (!webhookCheckbox.checked && !phoneNumber) {
        showErrorMessage(
            'Phone Number Required',
            'Please enter a shop phone number or enable webhook notifications.',
            'shop-phone'
        );
        return;
    }
    
    if (phoneNumber) {
        // Basic phone number validation
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phoneNumber)) {
            showErrorMessage(
                'Invalid Phone Number',
                'Please enter a valid phone number with at least 10 digits.',
                'shop-phone'
            );
            return;
        }
    }
    
    // Update shop configuration
    SHOP_CONFIG.phoneNumber = phoneNumber;
    SHOP_CONFIG.whatsappEnabled = whatsappCheckbox.checked;
    SHOP_CONFIG.smsEnabled = smsCheckbox.checked;
    
    // Update webhook configuration
    WEBHOOK_CONFIG.url = webhookUrl;
    WEBHOOK_CONFIG.enabled = webhookCheckbox.checked;
    
    // Save to localStorage
    localStorage.setItem('surfTurfShopConfig', JSON.stringify(SHOP_CONFIG));
    localStorage.setItem('surfTurfWebhookConfig', JSON.stringify(WEBHOOK_CONFIG));
    
    // Close modal and show success
    closeShopSetup();
    
    let successMessage = 'Configuration saved! ';
    if (webhookCheckbox.checked && webhookUrl) {
        successMessage += `Webhook notifications enabled with URL: ${webhookUrl}`;
    } else if (phoneNumber) {
        successMessage += `Phone notifications enabled for ${phoneNumber}`;
    }
    
    showSuccessMessage(
        'Configuration Saved!',
        successMessage
    );
}

// Test function for receipt system (for development/testing)
function testReceiptSystem() {
    const testOrder = {
        id: 'ST' + Date.now(),
        items: [
            {
                name: 'Cappuccino',
                size: 'Medium',
                price: 35,
                quantity: 2
            },
            {
                name: 'Latte',
                size: 'Large',
                price: 40,
                quantity: 1
            }
        ],
        total: 110,
        customer: {
            name: 'Test Customer',
            phone: '+27123456789',
            email: 'test@example.com'
        },
        delivery: {
            address: '123 Test Street, Potchefstroom',
            date: '2025-01-15',
            time: '14:30',
            notes: 'Please ring the doorbell'
        },
        payment: {
            method: 'cash',
            status: 'pending'
        },
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
    
    generateReceipt(testOrder);
}

// Test function for email notifications
function testEmailNotifications() {
    console.log('🧪 Testing email notifications...');
    
    const testOrder = {
        id: 'TEST' + Date.now(),
        items: [
            {
                name: 'Test Cappuccino',
                size: 'Medium',
                price: 35,
                quantity: 1
            }
        ],
        total: 35,
        customer: {
            name: 'Test Customer',
            phone: '+27123456789',
            email: 'test@example.com'
        },
        delivery: {
            address: '123 Test Street, Potchefstroom',
            date: '2025-01-15',
            time: '14:30',
            notes: 'Test order'
        },
        payment: {
            method: 'cash',
            status: 'pending'
        },
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Test email notifications
    sendEmailNotifications(testOrder);
    
    showSuccessMessage(
        'Email Test Complete!',
        'Check console for email test results. Check your email inboxes.'
    );
}

// Test function specifically for your EmailJS template
function testEmailJSTemplate() {
    console.log('🧪 Testing EmailJS template (eqzelr5)...');
    
    if (!EMAIL_CONFIG.enabled) {
        showErrorMessage(
            'Email Not Configured',
            'Please configure EmailJS settings first.',
            'emailjs-public-key'
        );
        return;
    }
    
    const templateParams = {
        customer_email: 'test@example.com',
        customer_name: 'Test Customer',
        order_id: 'TEST' + Date.now(),
        order_date: formatDateTime(new Date().toISOString()),
        delivery_date: formatDate('2025-01-15'),
        delivery_time: '14:30',
        delivery_address: '123 Test Street, Potchefstroom',
        order_details: 'Test Cappuccino (Medium) x1 - R35\nTest Latte (Large) x1 - R40',
        total: 75,
        payment_method: 'Cash on Delivery',
        shop_name: 'Surf & Turf Coffee',
        shop_phone: '+27 12 345 6789',
        shop_address: '34 Holtzhausen Rd, Potchefstroom'
    };
    
    emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
        .then((response) => {
            console.log('✅ EmailJS test successful:', response);
            showSuccessMessage(
                'EmailJS Test Successful!',
                'Check your email inboxes for the test email.'
            );
        })
        .catch((error) => {
            console.error('❌ EmailJS test failed:', error);
            showErrorMessage(
                'EmailJS Test Failed',
                'Check console for error details. Verify your EmailJS configuration.',
                'emailjs-public-key'
            );
        });
}

// Add test functions to global scope for console access
window.testReceiptSystem = testReceiptSystem;
window.testEmailNotifications = testEmailNotifications;
window.testEmailJSTemplate = testEmailJSTemplate;

// ==========================================
// IMPROVED EMAIL SYSTEM WITH RETRY LOGIC
// Add this code to the end of your script.js file (before the closing tag)
// ==========================================

// Email queue for failed sends
const emailQueue = [];

// Retry logic with exponential backoff
async function sendEmailWithRetry(serviceId, templateId, params, maxRetries = 3) {
    const startTime = Date.now();
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await emailjs.send(serviceId, templateId, params);
            const duration = Date.now() - startTime;
            console.log(`✅ Email sent successfully on attempt ${i + 1} (${duration}ms)`);
            return response;
        } catch (error) {
            console.log(`❌ Attempt ${i + 1} failed:`, error);
            
            if (i < maxRetries - 1) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = 1000 * Math.pow(2, i);
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // Add to queue for later retry
                emailQueue.push({ serviceId, templateId, params, attempts: 0 });
                console.error('❌ Email failed after 3 attempts, added to queue');
                throw error;
            }
        }
    }
}

// Process email queue
function processEmailQueue() {
    if (emailQueue.length === 0) {
        console.log('📭 Email queue is empty');
        return;
    }
    
    console.log(`📧 Processing ${emailQueue.length} queued emails...`);
    const email = emailQueue[0];
    email.attempts++;
    
    sendEmailWithRetry(email.serviceId, email.templateId, email.params)
        .then(() => {
            emailQueue.shift(); // Remove from queue
            console.log('✅ Queued email sent successfully');
            if (emailQueue.length > 0) {
                processEmailQueue(); // Process next
            }
        })
        .catch(() => {
            if (email.attempts >= 5) {
                console.error('❌ Email failed permanently after 5 attempts');
                emailQueue.shift(); // Remove failed email
            }
            // Try again later
            setTimeout(processEmailQueue, 30000); // 30 seconds
        });
}

// Improved email notifications with parallel sending
async function sendEmailNotificationsImproved(order) {
    if (!EMAIL_CONFIG.enabled) {
        console.log('📧 Email notifications not configured');
        return;
    }

    const startTime = Date.now();
    console.log('📧 Sending email notifications...');
    const promises = [];
    
    // Send customer receipt if email provided
    if (order.customer.email) {
        console.log('📨 Sending customer receipt...');
        promises.push(sendCustomerReceiptImproved(order));
    }
    
    // Send shop notification
    console.log('📨 Sending shop notification...');
    promises.push(sendShopNotificationImproved(order));
    
    try {
        // Wait for both emails to send in parallel
        await Promise.all(promises);
        const duration = Date.now() - startTime;
        console.log(`✅ All emails sent in ${duration}ms`);
    } catch (error) {
        console.error('❌ Some emails failed:', error);
    }
}

// Improved customer receipt with retry
async function sendCustomerReceiptImproved(order) {
    if (!EMAIL_CONFIG.enabled || !order.customer.email) return;

    const templateParams = {
        customer_email: order.customer.email,
        customer_name: order.customer.name,
        order_id: order.id,
        order_date: formatDateTime(order.timestamp),
        delivery_date: formatDate(order.delivery.date),
        delivery_time: order.delivery.time,
        delivery_address: order.delivery.address,
        order_details: order.items.map(item => `${item.name} (${item.size}) x${item.quantity} - R${item.price * item.quantity}`).join('\n'),
        total: order.total,
        payment_method: order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment',
        shop_name: 'Surf & Turf Coffee',
        shop_phone: '+27 12 345 6789',
        shop_address: '34 Holtzhausen Rd, Potchefstroom'
    };

    return sendEmailWithRetry(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams);
}

// Improved shop notification with retry
async function sendShopNotificationImproved(order) {
    if (!EMAIL_CONFIG.enabled) return;

        const templateParams = {
            customer_email: 'orderssurfandturf@gmail.com',
            customer_name: 'Surf & Turf Coffee Team',
        order_id: order.id,
        order_date: formatDateTime(order.timestamp),
        delivery_date: formatDate(order.delivery.date),
        delivery_time: order.delivery.time,
        delivery_address: order.delivery.address,
        order_details: `NEW ORDER RECEIVED\n\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nEmail: ${order.customer.email || 'Not provided'}\n\nOrder Items:\n${order.items.map(item => `${item.name} (${item.size}) x${item.quantity} - R${item.price * item.quantity}`).join('\n')}\n\nTotal: R${order.total}\nPayment: ${order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment'}\n\nSpecial Instructions: ${order.delivery.notes || 'None'}`,
        total: order.total,
        payment_method: order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment',
        shop_name: 'Surf & Turf Coffee',
        shop_phone: '+27 12 345 6789',
        shop_address: '34 Holtzhausen Rd, Potchefstroom'
    };

    return sendEmailWithRetry(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams);
}

// Performance monitoring
function trackEmailPerformance(emailType, startTime) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`📊 ${emailType} took ${duration}ms`);
    
    if (duration > 5000) {
        console.warn(`⚠️ ${emailType} is slow (${duration}ms)`);
    } else if (duration < 2000) {
        console.log(`⚡ ${emailType} was fast! (${duration}ms)`);
    }
    
    return duration;
}

// Test improved email system
function testImprovedEmailSystem() {
    console.log('🧪 Testing improved email system...');
    
    if (!EMAIL_CONFIG.enabled) {
        showErrorMessage(
            'Email Not Configured',
            'Please configure EmailJS settings first.',
            'emailjs-public-key'
        );
        return;
    }
    
    const testOrder = {
        id: 'IMPROVED' + Date.now(),
        items: [
            { name: 'Test Cappuccino', size: 'Medium', price: 35, quantity: 1 },
            { name: 'Test Latte', size: 'Large', price: 40, quantity: 1 }
        ],
        total: 75,
        customer: {
            name: 'Test Customer',
            phone: '+27123456789',
            email: 'test@example.com'
        },
        delivery: {
            address: '123 Test Street, Potchefstroom',
            date: '2025-01-15',
            time: '14:30',
            notes: 'Test order - improved system'
        },
        payment: {
            method: 'cash',
            status: 'pending'
        },
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
    
    sendEmailNotificationsImproved(testOrder);
    
    showSuccessMessage(
        'Improved Email Test Started!',
        'Check console for detailed performance metrics and email status.'
    );
}

// Monitor email queue periodically
function startEmailQueueMonitor() {
    setInterval(() => {
        if (emailQueue.length > 0) {
            console.log(`📧 ${emailQueue.length} emails in queue, processing...`);
            processEmailQueue();
        }
    }, 30000); // Check every 30 seconds
}

// Add to global scope
window.sendEmailNotificationsImproved = sendEmailNotificationsImproved;
window.testImprovedEmailSystem = testImprovedEmailSystem;
window.processEmailQueue = processEmailQueue;
window.emailQueue = emailQueue;
window.trackEmailPerformance = trackEmailPerformance;
window.startEmailQueueMonitor = startEmailQueueMonitor;

// ==========================================
// IMPROVED EMAIL SYSTEM WITH RETRY LOGIC
// ==========================================

// emailQueue is already defined above

// Retry logic with exponential backoff
async function sendEmailWithRetry(serviceId, templateId, params, maxRetries = 3) {
    const startTime = Date.now();
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await emailjs.send(serviceId, templateId, params);
            const duration = Date.now() - startTime;
            console.log(`✅ Email sent successfully on attempt ${i + 1} (${duration}ms)`);
            return response;
        } catch (error) {
            console.log(`❌ Attempt ${i + 1} failed:`, error);
            
            if (i < maxRetries - 1) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = 1000 * Math.pow(2, i);
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // Add to queue for later retry
                emailQueue.push({ serviceId, templateId, params, attempts: 0 });
                console.error('❌ Email failed after 3 attempts, added to queue');
                throw error;
            }
        }
    }
}

// Process email queue
function processEmailQueue() {
    if (emailQueue.length === 0) {
        console.log('📭 Email queue is empty');
        return;
    }
    
    console.log(`📧 Processing ${emailQueue.length} queued emails...`);
    const email = emailQueue[0];
    email.attempts++;
    
    sendEmailWithRetry(email.serviceId, email.templateId, email.params)
        .then(() => {
            emailQueue.shift(); // Remove from queue
            console.log('✅ Queued email sent successfully');
            if (emailQueue.length > 0) {
                processEmailQueue(); // Process next
            }
        })
        .catch(() => {
            if (email.attempts >= 5) {
                console.error('❌ Email failed permanently after 5 attempts');
                emailQueue.shift(); // Remove failed email
            }
            // Try again later
            setTimeout(processEmailQueue, 30000); // 30 seconds
        });
}

// Improved email notifications with parallel sending
async function sendEmailNotificationsImproved(order) {
    if (!EMAIL_CONFIG.enabled) {
        console.log('📧 Email notifications not configured');
        return;
    }

    const startTime = Date.now();
    console.log('📧 Sending email notifications...');
    const promises = [];
    
    // Send customer receipt if email provided
    if (order.customer.email) {
        console.log('📨 Sending customer receipt...');
        promises.push(sendCustomerReceiptImproved(order));
    }
    
    // Send shop notification
    console.log('📨 Sending shop notification...');
    promises.push(sendShopNotificationImproved(order));
    
    try {
        // Wait for both emails to send in parallel
        await Promise.all(promises);
        const duration = Date.now() - startTime;
        console.log(`✅ All emails sent in ${duration}ms`);
    } catch (error) {
        console.error('❌ Some emails failed:', error);
    }
}

// Improved customer receipt with retry
async function sendCustomerReceiptImproved(order) {
    if (!EMAIL_CONFIG.enabled || !order.customer.email) return;

    const templateParams = {
        customer_email: order.customer.email,
        customer_name: order.customer.name,
        order_id: order.id,
        order_date: formatDateTime(order.timestamp),
        delivery_date: formatDate(order.delivery.date),
        delivery_time: order.delivery.time,
        delivery_address: order.delivery.address,
        order_details: order.items.map(item => `${item.name} (${item.size}) x${item.quantity} - R${item.price * item.quantity}`).join('\n'),
        total: order.total,
        payment_method: order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment',
        shop_name: 'Surf & Turf Coffee',
        shop_phone: '+27 12 345 6789',
        shop_address: '34 Holtzhausen Rd, Potchefstroom'
    };

    return sendEmailWithRetry(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams);
}

// Improved shop notification with retry
async function sendShopNotificationImproved(order) {
    if (!EMAIL_CONFIG.enabled) return;

        const templateParams = {
            customer_email: 'orderssurfandturf@gmail.com',
            customer_name: 'Surf & Turf Coffee Team',
        order_id: order.id,
        order_date: formatDateTime(order.timestamp),
        delivery_date: formatDate(order.delivery.date),
        delivery_time: order.delivery.time,
        delivery_address: order.delivery.address,
        order_details: `NEW ORDER RECEIVED\n\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nEmail: ${order.customer.email || 'Not provided'}\n\nOrder Items:\n${order.items.map(item => `${item.name} (${item.size}) x${item.quantity} - R${item.price * item.quantity}`).join('\n')}\n\nTotal: R${order.total}\nPayment: ${order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment'}\n\nSpecial Instructions: ${order.delivery.notes || 'None'}`,
        total: order.total,
        payment_method: order.payment.method === 'cash' ? 'Cash on Delivery' : 'Card Payment',
        shop_name: 'Surf & Turf Coffee',
        shop_phone: '+27 12 345 6789',
        shop_address: '34 Holtzhausen Rd, Potchefstroom'
    };

    return sendEmailWithRetry(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams);
}

// Monitor email queue periodically
function startEmailQueueMonitor() {
    setInterval(() => {
        if (emailQueue.length > 0) {
            console.log(`📧 ${emailQueue.length} emails in queue, processing...`);
            processEmailQueue();
        }
    }, 30000); // Check every 30 seconds
}

// Add to global scope
window.sendEmailNotificationsImproved = sendEmailNotificationsImproved;
window.testImprovedEmailSystem = testImprovedEmailSystem;
window.processEmailQueue = processEmailQueue;
window.emailQueue = emailQueue;
window.startEmailQueueMonitor = startEmailQueueMonitor;

console.log('✅ Improved email system loaded');
console.log('📧 Available functions:');
console.log('  - testImprovedEmailSystem() - Test the improved email system');
console.log('  - processEmailQueue() - Process queued emails');
console.log('  - startEmailQueueMonitor() - Start automatic queue monitoring');
console.log('  - trackEmailPerformance(type, startTime) - Monitor email performance');
