document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Elements
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const modalImage = document.getElementById('modal-product-image');
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const colorOptions = document.querySelectorAll('.color-option');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const viewDetailsBtn = document.querySelector('.view-details-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const viewProductBtns = document.querySelectorAll('.view-product-btn');
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const priceRange = document.getElementById('price-range');
    const currentMaxPrice = document.getElementById('current-max-price');
    
    // ==========================================
    // Mobile Navigation
    // ==========================================
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close the mobile menu when clicking outside of it
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    }
    
    // ==========================================
    // Product Image Gallery
    // ==========================================
    // Thumbnail click handler
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update active thumbnail
            thumbnails.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Update main image
            const imgSrc = this.getAttribute('data-img');
            mainProductImage.src = imgSrc;
            if (modalImage) {
                modalImage.src = imgSrc;
            }
            
            // Add a small zoom effect
            mainProductImage.classList.add('zoom-effect');
            setTimeout(() => {
                mainProductImage.classList.remove('zoom-effect');
            }, 300);
        });
    });
    
    // Quick view modal trigger
    if (mainProductImage && quickViewModal) {
        mainProductImage.addEventListener('click', function() {
            openModal(quickViewModal);
        });
    }
    
    // Close modal when clicking the close button
    if (closeModalBtn && quickViewModal) {
        closeModalBtn.addEventListener('click', function() {
            closeModal(quickViewModal);
        });
    }
    
    // Close modal when clicking outside the modal content
    if (quickViewModal) {
        quickViewModal.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                closeModal(quickViewModal);
            }
        });
    }
    
    // Redirect to full product page from quick view
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function() {
            closeModal(quickViewModal);
            // In a real application, this would redirect to a product details page
            // For this demo, it just scrolls to the product section
            document.querySelector('.product-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // ==========================================
    // Quantity Selector
    // ==========================================
    if (quantityInput && minusBtn && plusBtn) {
        // Increase quantity
        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            const max = parseInt(quantityInput.getAttribute('max'));
            
            if (currentValue < max) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        // Decrease quantity
        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            const min = parseInt(quantityInput.getAttribute('min'));
            
            if (currentValue > min) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        // Validate input on change
        quantityInput.addEventListener('change', function() {
            let currentValue = parseInt(this.value);
            const min = parseInt(this.getAttribute('min'));
            const max = parseInt(this.getAttribute('max'));
            
            if (isNaN(currentValue) || currentValue < min) {
                this.value = min;
            } else if (currentValue > max) {
                this.value = max;
            }
        });
    }
    
    // ==========================================
    // Add to Cart Button
    // ==========================================
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            const color = document.querySelector('.color-option.active').getAttribute('data-color');
            
            // Simulate adding to cart
            addToCart({
                name: 'SoundWave Pro X7',
                color: color,
                quantity: quantity,
                price: 299.99
            });
            
            // Show success animation
            this.classList.add('success');
            setTimeout(() => {
                this.classList.remove('success');
            }, 1000);
        });
    }
    
    // Cart functionality
    let cart = [];
    
    // Add to cart function
    function addToCart(product) {
        // Check if the product is already in cart
        const existingProductIndex = cart.findIndex(item => 
            item.name === product.name && item.color === product.color);
        
        if (existingProductIndex > -1) {
            // Update quantity if product already exists
            cart[existingProductIndex].quantity += product.quantity;
        } else {
            // Add new product to cart
            cart.push({...product, id: Date.now()});
        }
        
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Animate cart icon
            cartIcon.classList.add('pulse');
            setTimeout(() => {
                cartIcon.classList.remove('pulse');
            }, 1000);
        }
        
        // Update cart UI
        updateCartUI();
        
        // Open the cart sidebar
        if (cartSidebar) {
            cartSidebar.classList.add('open');
        }
    }
    
    // Update cart UI
    function updateCartUI() {
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Color: ${item.color}</p>
                        <div class="cart-item-price">
                            <span>$${item.price.toFixed(2)}</span>
                            <span>x ${item.quantity}</span>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                removeFromCart(itemId);
            });
        });
    }
    
    // Remove item from cart
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCartUI();
        
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    // ==========================================
    // Color Options
    // ==========================================
    if (colorOptions.length) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Update active color
                colorOptions.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                
                // In a real application, this would update product images based on color
                const color = this.getAttribute('data-color');
                console.log(`Selected color: ${color}`);
            });
        });
    }
    
    // ==========================================
    // Wishlist Button
    // ==========================================
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                
                // Show notification (in a real app, this would be a better UI notification)
                alert('Added to wishlist!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                
                // Show notification
                alert('Removed from wishlist');
            }
        });
    }
    
    // ==========================================
    // Product Tabs
    // ==========================================
    if (tabBtns.length && tabPanels.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active tab button
                tabBtns.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                
                // Show the corresponding tab panel
                const targetTabId = this.getAttribute('data-tab');
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetTabId) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }
    
    // ==========================================
    // Load More Reviews Button
    // ==========================================
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // In a real application, this would load more reviews via AJAX
            // For this demo, we'll just show a message
            this.textContent = 'Loading...';
            setTimeout(() => {
                this.textContent = 'No more reviews to load';
                this.disabled = true;
            }, 1000);
        });
    }
    
    // ==========================================
    // Helper Functions
    // ==========================================
    // Open modal function
    function openModal(modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    // Close modal function
    function closeModal(modal) {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Add CSS class for animated elements
    document.querySelectorAll('.product-card, .footer-column, .tab-panel').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Simple animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Custom CSS for animations (adding this dynamically)
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .zoom-effect {
            animation: zoom 0.3s ease;
        }
        
        .pulse {
            animation: pulse 0.5s ease;
        }
        
        .add-to-cart-btn.success {
            background-color: var(--success-color);
        }
        
        @keyframes zoom {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Cart icon click event
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.add('open');
        });
    }
    
    // Close cart button click event
    if (closeCartBtn && cartSidebar) {
        closeCartBtn.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
                cartSidebar.classList.remove('open');
            }
        }
    });
    
    // View product buttons click handlers
    if (viewProductBtns) {
        viewProductBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // In a real app, this would navigate to the product page
                // For this demo, we'll just show the product section
                if (document.querySelector('.product-section')) {
                    // Show the product details section
                    document.querySelector('.hero').style.display = 'none';
                    document.querySelector('.featured-products').style.display = 'none';
                    document.querySelector('.features-section').style.display = 'none';
                    document.querySelector('.product-page-only').style.display = 'block';
                    document.querySelector('.product-section').style.display = 'grid';
                    document.querySelector('.product-tabs').style.display = 'block';
                    document.querySelector('.related-products').style.display = 'block';
                    
                    window.scrollTo(0, 0);
                }
            });
        });
    }
    
    // Quick add buttons click handlers
    if (quickAddBtns) {
        quickAddBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('$', ''));
                
                addToCart({
                    name: productName,
                    color: 'Black',
                    quantity: 1,
                    price: productPrice
                });
            });
        });
    }
    
    // FAQ accordion functionality
    if (faqQuestions) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const icon = this.querySelector('.faq-toggle i');
                
                // Toggle the active class
                this.classList.toggle('active');
                
                // Toggle the answer visibility
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            });
        });
    }
    
    // Price range slider functionality
    if (priceRange && currentMaxPrice) {
        priceRange.addEventListener('input', function() {
            currentMaxPrice.textContent = '$' + this.value;
        });
    }
    
    // Check if we're on a specific page and adjust UI
    function adjustPageUI() {
        const path = window.location.pathname;
        
        if (path.includes('index.html') || path === '/' || path === '') {
            // Home page
            if (document.querySelector('.product-section')) {
                document.querySelector('.product-section').style.display = 'none';
                document.querySelector('.product-tabs').style.display = 'none';
                document.querySelector('.product-page-only').style.display = 'none';
            }
        }
    }
    
    // Adjust UI based on current page
    adjustPageUI();
    
    // Initialize functionality
    console.log('E-Shop initialized successfully!');
});
