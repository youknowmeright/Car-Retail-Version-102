
// Cart state management
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let totalSum = JSON.parse(localStorage.getItem('totalSum')) || 0;

// Function to show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.classList.add(
        'fixed',
        'top-4',
        'right-4',
        'px-6',
        'py-3',
        'rounded-lg',
        'shadow-lg',
        'transform',
        'translate-x-full',
        'transition-transform',
        'duration-300',
        'z-50',
        type === 'success' ? 'bg-green-500' : 'bg-red-500',
        'text-white'
    );
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Function to show thank you message
function showThankYouMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(
        'fixed', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2',
        'bg-gradient-to-r', 'from-blue-900', 'to-black', 'text-white', 'p-8', 'rounded-xl', 'shadow-2xl', 'border',
        'border-blue-400', 'z-50', 'text-center', 'max-w-md', 'w-full'
    );

    messageDiv.innerHTML = `
        <i class="fas fa-check-circle text-6xl text-green-400 mb-4"></i>
        <h2 class="text-2xl font-bold mb-4">Thank You for Your Purchase!</h2>
        <p class="text-gray-300 mb-6">Your order has been successfully placed. We'll process it right away.</p>
        <button id="close-thank-you" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Close
        </button>
    `;

    document.body.appendChild(messageDiv);

    document.getElementById('close-thank-you').addEventListener('click', () => {
        document.body.removeChild(messageDiv);
        window.location.href = 'index.html';
    });
}

function getPriceValue(brand, number) {
    const priceSpan = document.getElementById(`${brand}-${number}`);
    if (!priceSpan) return 0;
    const priceText = priceSpan.innerText.replace('$', '').replace(/,/g, '');
    return parseFloat(priceText);
}

function saveCartState() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('totalSum', JSON.stringify(totalSum));
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.classList.add('bg-gradient-to-br', 'from-gray-800', 'to-blue-900', 'text-white', 'p-8', 'rounded-xl', 'mb-6', 'shadow-2xl', 'border', 'border-blue-400', 'transform', 'hover:scale-[1.02]', 'transition-all', 'duration-300');
    div.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="space-y-3">
                <h4 class="text-2xl font-bold text-blue-300">${item.model}</h4>
                <div class="space-y-2">
                    <p class="text-xl font-semibold text-white">Price: <span class="text-green-400">$${item.price.toLocaleString()}</span></p>
                    <p class="text-sm text-gray-300">Transaction ID: <span class="text-blue-300">${item.transactionId}</span></p>
                    <p class="text-sm text-gray-300">Date: <span class="text-blue-300">${item.date}</span></p>
                </div>
            </div>
            <button class="remove-item bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200" data-id="${item.transactionId}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return div;
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!cartContainer) return;
    cartContainer.innerHTML = '';

    if (cartItems.length === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
        if (checkoutBtn) checkoutBtn.classList.add('hidden');
        return;
    }

    if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
    if (checkoutBtn) checkoutBtn.classList.remove('hidden');

    cartItems.forEach(item => {
        cartContainer.appendChild(createCartItemElement(item));
    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('bg-gradient-to-br', 'from-blue-900', 'to-gray-800', 'text-white', 'p-8', 'rounded-xl', 'mt-8', 'shadow-2xl', 'border', 'border-blue-400', 'transform', 'hover:scale-[1.02]', 'transition-all', 'duration-300');

    const shippingCharge = totalSum > 50000 ? 5000 : 1000;
    const totalWithShipping = totalSum + shippingCharge;

    totalDiv.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div class="space-y-3">
                <h3 class="text-2xl font-bold text-blue-300">Order Summary</h3>
                <div class="space-y-2">
                    <p class="text-lg text-gray-300">Subtotal: <span class="text-white">$${totalSum.toLocaleString()}</span></p>
                    <p class="text-lg text-gray-300">Shipping: <span class="text-white">$${shippingCharge.toLocaleString()}</span></p>
                    <p class="text-2xl font-bold text-green-400 mt-4">Total: $${totalWithShipping.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;

    cartContainer.appendChild(totalDiv);

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.currentTarget.dataset.id;
            removeFromCart(itemId);
        });
    });
}

function addToCart(model, price) {
    const item = {
        model,
        price,
        transactionId: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleString()
    };

    cartItems.push(item);
    totalSum += price;
    saveCartState();
    updateCartDisplay();
    showToast(`${model} added to cart - $${price.toLocaleString()}`);
}

function removeFromCart(transactionId) {
    const itemIndex = cartItems.findIndex(item => item.transactionId.toString() === transactionId);
    if (itemIndex > -1) {
        const removedItem = cartItems[itemIndex];
        totalSum -= removedItem.price;
        cartItems.splice(itemIndex, 1);
        saveCartState();
        updateCartDisplay();
        showToast(`${removedItem.model} removed from cart`);
    }
}

function handleCheckout() {
    if (cartItems.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    showThankYouMessage();
    cartItems = [];
    totalSum = 0;
    saveCartState();
    updateCartDisplay();
}

function initializeCartButtons() {
    const cars = [
        ['bmw', 'BMW 3 Series'],
        ['bmw', 'BMW 5 Series'],
        ['bmw', 'BMW X5'],
        ['audi', 'Audi Q5'],
        ['audi', 'Audi A6'],
        ['audi', 'Audi A4'],
        ['mercedes', 'Mercedes C-Class'],
        ['mercedes', 'Mercedes E-Class'],
        ['mercedes', 'Mercedes GLC']
    ];
    cars.forEach(([brand, model], i) => {
        const id = `${brand}-cart-${(i % 3) + 1}`;
        document.getElementById(id)?.addEventListener('click', () => {
            const price = getPriceValue(brand, (i % 3) + 1);
            addToCart(model, price);
        });
    });
    document.getElementById('my-cart')?.addEventListener('click', () => {
        window.location.href = './cart.html';
    });
    document.getElementById('checkout-btn')?.addEventListener('click', handleCheckout);
    document.getElementById('check-out')?.addEventListener('click', handleCheckout);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCartButtons();
    updateCartDisplay();
});
