// script.js - ملف الجافاسكريبت لموقع متجر المجوهرات

document.addEventListener('DOMContentLoaded', function() {
    // ------ المتغيرات العامة ------
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.main-nav');
    const searchBtn = document.querySelector('.search-btn');
    const searchBox = document.querySelector('.search-box');
    
    // ------ تهيئة الصفحة ------
    initPage();
    
    // ------ وظائف التهيئة ------
    function initPage() {
        updateCartCount();
        setupEventListeners();
        animateElementsOnScroll();
        loadFeaturedProducts();
    }
    
    // ------ إعداد مستمعي الأحداث ------
    function setupEventListeners() {
        // زر القائمة المتنقلة
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
        
        // زر البحث
        if (searchBtn) {
            searchBtn.addEventListener('click', toggleSearchBox);
        }
        
        // أزرار إضافة إلى السلة
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
        
        // عناصر التصفية
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', filterProducts);
        });
    }
    
    // ------ وظائف القائمة المتنقلة ------
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('open');
    }
    
    // ------ وظائف البحث ------
    function toggleSearchBox() {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchBox.querySelector('input').focus();
        }
    }
    
    // ------ وظائف السلة ------
    function addToCart(e) {
        const product = e.target.closest('.product');
        const productId = product.dataset.id;
        const productName = product.querySelector('.product-name').textContent;
        const productPrice = product.querySelector('.product-price').textContent;
        const productImage = product.querySelector('.product-image').src;
        
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification(${productName} تمت إضافته إلى السلة);
    }
    
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartCount();
    }
    
    function updateCartCount() {
        if (cartCount) {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // ------ وظائف التصفية والترتيب ------
    function filterProducts(e) {
        const filter = e.target.dataset.filter;
        
        // إزالة التنشيط من جميع الأزرار
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // تنشيط الزر المحدد
        e.target.classList.add('active');
        
        // تصفية المنتجات
        document.querySelectorAll('.product').forEach(product => {
            if (filter === 'all' || product.dataset.category === filter) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    // ------ وظائف التحميل ------
    async function loadFeaturedProducts() {
        try {
            const response = await fetch('api/featured-products');
            const products = await response.json();
            renderFeaturedProducts(products);
        } catch (error) {
            console.error('Error loading featured products:', error);
        }
    }
    
    function renderFeaturedProducts(products) {
        const container = document.querySelector('.featured-products');
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product" data-id="${product.id}" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price} ريال</p>
                <button class="add-to-cart">أضف إلى السلة</button>
            </div>
        `).join('');
        
        // إعادة إعداد مستمعي الأحداث للمنتجات الجديدة
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }
    
    // ------ تأثيرات التمرير ------
    function animateElementsOnScroll() {
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // ------ الإشعارات ------
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // ------ التبديل بين تبويبات المحتوى ------
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // إخفاء جميع المحتويات
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // إزالة التنشيط من جميع الأزرار
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // إظهار المحتوى المحدد وتنشيط الزر
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });
});