/*--------------------------- SELETORES ---------------------------*/
const cartBtn = document.querySelector('.btn-cart');
const cartContainer = document.querySelector('.cart-container');
const cartItemsList = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotalValue = document.querySelector('.cart-total-value');
const applyCouponBtn = document.getElementById('applyCoupon');
const couponInput = document.getElementById('couponInput');
const cartPopup = document.querySelector('.cart-popup');
const checkoutBtn = document.querySelector('.checkout-btn');

let cart = [];
let discount = 0;

/*--------------------------- ABRIR / FECHAR CARRINHO ---------------------------*/
cartBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    cartContainer.classList.toggle('show');
});

/*--------------------------- SEGURANÇA HTML ---------------------------*/
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, tag => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"}[tag]));
}

/*--------------------------- NOTIFICAÇÃO ---------------------------*/
function showMessage(text, success = true) {
    const msg = document.createElement('div');
    msg.className = 'cart-message';
    msg.textContent = text;
    Object.assign(msg.style, {
        position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
        background: success ? '#00bfff' : '#ef4444', color: '#fff',
        padding: '8px 15px', borderRadius: '6px', fontSize: '13px', zIndex: '2000'
    });
    cartPopup.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

/*--------------------------- PARSE DE PREÇO ---------------------------*/
function parsePrice(precoStr) {
    if (!precoStr) return 0;
    let precoLimpo = precoStr.replace(/[^0-9,\.]/g, '');
    const lastComma = precoLimpo.lastIndexOf(',');
    if (lastComma !== -1) {
        precoLimpo = precoLimpo.substring(0, lastComma).replace(/,/g,'') + '.' + precoLimpo.substring(lastComma+1);
    }
    return parseFloat(precoLimpo) || 0;
}

/*--------------------------- ADICIONAR PRODUTO ---------------------------*/
document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-comprar-card');
    if (!button) return;

    const card = button.closest('.card-produto');
    if (!card) return;

    const nome = card.dataset.nome || 'Produto';
    const preco = parsePrice(card.dataset.preco);

    const item = cart.find(i => i.nome === nome);
    if (item) item.quantidade++;
    else cart.push({ nome, preco, quantidade: 1 });

    updateCart();
    showMessage('Adicionado ao carrinho!');
});

/*--------------------------- RENDER DO CARRINHO ---------------------------*/
function updateCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    let total = 0;
    let totalItens = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align:center; padding:20px; color:#aaa;">Seu carrinho está vazio</p>';
        if (cartCount) cartCount.textContent = '0';
        if (cartTotalValue) cartTotalValue.textContent = '0,00 MT';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cart.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        totalItens += item.quantidade;

        const safeName = escapeHTML(item.nome).trim();
        const li = document.createElement('li');
        li.className = 'cart-item';

        li.innerHTML = `
            <span class="item-name" title="${safeName}">${safeName}</span>
            <div class="item-qty">
                <button class="qty-btn minus">−</button>
                <span class="qty">${item.quantidade}</span>
                <button class="qty-btn plus">+</button>
            </div>
            <span class="item-price">
                ${subtotal.toLocaleString('pt-MZ', {minimumFractionDigits:2})} MT
            </span>
        `;
        cartItemsList.appendChild(li);

        const plusBtn = li.querySelector('.plus');
        const minusBtn = li.querySelector('.minus');

        plusBtn.addEventListener('click', e => {
            e.stopPropagation();
            changeQty(index, 1);
        });

        minusBtn.addEventListener('click', e => {
            e.stopPropagation();
            changeQty(index, -1);
        });
    });

    if (cartCount) cartCount.textContent = totalItens;
    const final = total * (1 - discount);
    if (cartTotalValue) {
        cartTotalValue.textContent = final.toLocaleString('pt-MZ', { minimumFractionDigits: 2 }) + ' MT';
    }
}

/*--------------------------- ALTERAR QUANTIDADE ---------------------------*/
function changeQty(index, delta) {
    if (cart[index]) {
        if (cart[index].quantidade + delta > 0) cart[index].quantidade += delta;
        else cart.splice(index, 1);
        updateCart();
    }
}
window.changeQty = changeQty;

/*--------------------------- CUPOM ---------------------------*/
applyCouponBtn?.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    const coupons = { OTEC10: 0.1, PROMO20: 0.2 };

    if (coupons[code]) {
        discount = coupons[code];
        showMessage(`Desconto de ${discount * 100}% aplicado!`);
    } else {
        discount = 0;
        showMessage('Cupom inválido', false);
    }
    updateCart();
});

/*--------------------------- POPUP DE PAGAMENTO ---------------------------*/
const paymentPopupHTML = `
<div id="paymentPopup" class="payment-popup">
  <div class="payment-popup-box">
    <h2>Pagamento</h2>
    <p>Insira seu número (9 dígitos):</p>
    <input type="text" id="paymentNumber" placeholder="Ex: 846686990" maxlength="9">
    <button id="confirmPaymentBtn">Confirmar Pagamento</button>
    <button class="close-popup" onclick="closePaymentPopup()">×</button>
  </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', paymentPopupHTML);

const paymentPopup = document.getElementById('paymentPopup');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

function closePaymentPopup() {
    paymentPopup.style.display = 'none';
}

/*--------------------------- CHECKOUT ABRE POPUP ---------------------------*/
checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) return showMessage('Carrinho vazio', false);

    cartContainer.classList.remove('show');

    paymentPopup.style.display = 'flex';
});

/*--------------------------- CONFIRMAR PAGAMENTO ---------------------------*/
confirmPaymentBtn?.addEventListener('click', () => {
    const number = document.getElementById('paymentNumber').value.trim();

    const regex = /^(84|85|86|87|82|83)\d{7}$/;

    if (!regex.test(number)) {
        alert('Número inválido! Começa com 84/85 (M-Pesa), 86/87 (Emola), 82/83 (Mkesh) e tem 9 dígitos.');
        return;
    }

    alert(`Pagamento iniciado para +258${number} 🚀`);
    paymentPopup.style.display = 'none';
});

/*--------------------------- INIT ---------------------------*/
updateCart();