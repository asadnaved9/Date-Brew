/*=============== LOADER ===============*/
onload = () =>{
    const load = document.getElementById('load')
    
    setTimeout(() =>{
        load.style.display = 'none'
    }, 2500)
}

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== MIXITUP FILTER PRODUCTS ===============*/
let mixerProducts = mixitup('.products__content', {
    selectors: {
        target: '.products__card',
    },
    animation: {
        duration: 300
    }
});

/* Default filter products */ 
mixerProducts.filter('.delicacies');

/* Link active products */ 
const linkProducts = document.querySelectorAll('.products__item')

function activeProducts(){
    linkProducts.forEach(l=> l.classList.remove('active-product'))
    this.classList.add('active-product')
}
linkProducts.forEach(l=> l.addEventListener('click', activeProducts))

/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 350) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
  }
  window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset
    
    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
        sectionTop = current.offsetTop - 58,
        sectionId = current.getAttribute('id')
        
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

// =========================================================================================================================
/* main.js — Cart, Checkout, Prebook, Newsletter
   Replace FIREBASE_CONFIG placeholders if using Firebase.
*/

document.addEventListener('DOMContentLoaded', () => {
  /* ================= FLIP COUNTDOWN LOGIC ================= */
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');

if (daysEl && hoursEl && minutesEl) {
  const launchDate = new Date(2026, 0, 5, 0, 0, 0).getTime(); // Jan 1, 2025

  function updateFlipCountdown() {
    const now = new Date().getTime();
    const diff = launchDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (diff % (1000 * 60 * 60)) / (1000 * 60)
    );

    setFlip(daysEl, days);
    setFlip(hoursEl, hours);
    setFlip(minutesEl, minutes);
  }

  function setFlip(el, value) {
    const newVal = String(value).padStart(2, '0');
    if (el.textContent !== newVal) {
      el.textContent = newVal;
      el.style.animation = 'none';
      el.offsetHeight; // trigger reflow
      el.style.animation = 'flip 0.6s ease';
    }
  }

  updateFlipCountdown();
  setInterval(updateFlipCountdown, 60000); // update every minute
}


  /* ---------- CONFIG ---------- */
  // const WHATSAPP_NUMBER = "919241330356"; // replace if needed (country code + number, no +)
  // const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
  const CONFIG = Object.freeze({
  WHATSAPP_NUMBER: "919241330356",
  CURRENCY: "₹",
  BRAND_NAME: "DateBrew"
});

const WHATSAPP_BASE = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`;

  const GOOGLE_CHECKOUT_FORM_URL = "https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID/viewform?usp=pp_url&entry.123456789="; 
  // NOTE: For Google Form, you'd append field values as query params (see instructions below)
  const USE_FIREBASE = false; // set true if you will use Firebase push code below

  /* ---------- CART ---------- */
  const cartKey = 'datebrew_cart_v1';
  const cartDrawer = document.getElementById('cart-drawer');
  const cartCountEl = document.getElementById('cart-count');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutWhatsappBtn = document.getElementById('checkout-whatsapp');
  // const checkoutGoogleBtn = document.getElementById('checkout-googleform');
  // const checkoutLocalBtn = document.getElementById('checkout-local');
  const cartCloseBtn = document.getElementById('cart-close');

  function loadCart(){
    const raw = localStorage.getItem(cartKey);
    return raw ? JSON.parse(raw) : {};
  }
  function saveCart(cart){
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCart();
  }
  function addToCart(item){
    const cart = loadCart();
    if(cart[item.id]){
      cart[item.id].qty += item.qty || 1;
    } else {
      cart[item.id] = item;
    }
    saveCart(cart);
  }
  function removeFromCart(id){
    const cart = loadCart();
    delete cart[id];
    saveCart(cart);
  }
  function updateQty(id, qty){
    const cart = loadCart();
    if(cart[id]){
      cart[id].qty = Math.max(1, qty);
      saveCart(cart);
    }
  }
  function cartTotal(cart){
    let total = 0;
    for(const id in cart){
      total += Number(cart[id].price) * Number(cart[id].qty);
    }
    return total;
  }

  function renderCart(){
    
    const cart = loadCart();
    const keys = Object.keys(cart);
cartCountEl.textContent = keys.length;
document.getElementById('cart-badge').textContent = keys.length;
    cartItemsEl.innerHTML = '';
    if(keys.length === 0){
      cartItemsEl.innerHTML = '<p>Your cart is empty</p>';
      cartTotalEl.textContent = '₹ 0';
      return;
    }
    keys.forEach(id => {
      const it = cart[id];
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item__meta">
          <strong>${escapeHtml(it.name)}</strong>
          <div>₹ ${Number(it.price).toFixed(2)} x <input type="number" value="${it.qty}" min="1" data-id="${id}" class="cart-qty" style="width:56px" /></div>
        </div>
        <div class="cart-item__controls">
          <div>₹ ${(it.price * it.qty).toFixed(2)}</div>
          <button data-id="${id}" class="button cart-remove">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(itemEl);
    });
    cartTotalEl.textContent = `₹ ${cartTotal(cart).toFixed(2)}`;

    // attach qty/change handlers
    document.querySelectorAll('.cart-qty').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const qty = parseInt(e.target.value) || 1;
        updateQty(id, qty);
      });
    });
    document.querySelectorAll('.cart-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        removeFromCart(btn.dataset.id);
      });
    });
  }

  // open cart UI (you can wire this to a cart icon)
  function openCart(){
    cartDrawer.classList.remove('hidden');
    renderCart();
  }
  function closeCart(){
    cartDrawer.classList.add('hidden');
  }
  cartCloseBtn?.addEventListener('click', closeCart);

  // wire all product buttons
  document.querySelectorAll('.products__button').forEach(button => {
    button.addEventListener('click', (e) => {
      // try to get data from attributes; fallback to lookups
      const parent = button.closest('.products__card');
      let name = button.dataset.name || (parent?.querySelector('.products__name')?.textContent?.trim()) || 'Product';
      let priceRaw = button.dataset.price || (parent?.querySelector('.products__price')?.textContent?.trim()) || '0';
      // strip non-digit (like ₹ or $)
      const price = parseFloat(priceRaw.replace(/[^\d\.]/g,'')) || 0;
      const id = button.dataset.id || (parent?.querySelector('.products__name')?.textContent?.trim().toLowerCase().replace(/\s+/g,'-')) || `p-${Date.now()}`;

      const item = { id, name, price, qty: 1 };
      addToCart(item);

      // open cart after adding
      openCart();
    });
  });

  // ESC close cart
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') { closeCart(); closePrebook(); }
  });

  /* ---------- CHECKOUT ACTIONS ---------- */
  // checkoutWhatsappBtn?.addEventListener('click', () => {
  //   const cart = loadCart();
  //   const keys = Object.keys(cart);
  //   if(keys.length === 0){
  //     alert('Your cart is empty');
  //     return;
  //   }
  //   let message = `Hello DateBrew! I want to place an order:\n`;
  //   keys.forEach(id => {
  //     const it = cart[id];
  //     message += `- ${it.name} x${it.qty} = ₹${(it.price * it.qty).toFixed(2)}\n`;
  //   });
  //   message += `Total: ₹${cartTotal(cart).toFixed(2)}\n`;
  //   // optionally ask for name/address in WA message
  //   const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
  //   window.open(url, '_blank');
  // });
  checkoutWhatsappBtn?.addEventListener('click', () => {
  const cart = loadCart();
  const keys = Object.keys(cart);

  if (keys.length === 0) {
    alert('Your cart is empty');
    return;
  }

  let message = ` *DateBrew Order Request* \n\n`;

  keys.forEach((id, index) => {
    const it = cart[id];
    message += `${index + 1}. *${it.name}*\n`;
    message += `   Qty: ${it.qty}\n`;
    message += `   Price: ₹${(it.price * it.qty).toFixed(2)}\n\n`;
  });

  message += `-----------------------\n`;
  message += ` *Total:* ₹${cartTotal(cart).toFixed(2)}\n\n`;
  message += ` *Delivery Details*\n`;
  message += `Name:\nPhone:\nCity:\n\n`;
  message += ` Preferred Delivery Date:\n`;
  message += ` Notes (optional):\n\n`;
  message += ` Thank you for choosing DateBrew — coffee comfort without caffeine `;

  const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});


  // Checkout via Google Form: append values as query params to prefill
  checkoutGoogleBtn?.addEventListener('click', () => {
    const cart = loadCart();
    const keys = Object.keys(cart);
    if(keys.length === 0){ alert('Your cart is empty'); return; }

    // Build a single string summarizing the order
    let orderStr = '';
    keys.forEach(id => {
      const it = cart[id];
      orderStr += `${it.name} x${it.qty} (₹${(it.price * it.qty).toFixed(2)})\n`;
    });
    orderStr += `Total: ₹${cartTotal(cart).toFixed(2)}`;

    // Append orderStr to a Google Form prefill entry param.
    // You must replace GOOGLE_CHECKOUT_FORM_URL in config with your form's prefill URL prefix.
    // Example: "...viewform?usp=pp_url&entry.123456789="
    const encoded = encodeURIComponent(orderStr);
    const url = GOOGLE_CHECKOUT_FORM_URL + encoded;
    window.open(url, '_blank');
  });

  // Local preview checkout: shows a confirmation and clears cart
  checkoutLocalBtn?.addEventListener('click', () => {
    const cart = loadCart();
    const tot = cartTotal(cart);
    if(tot === 0){ alert('Cart empty'); return; }
    if(confirm(`Place order for ₹${tot.toFixed(2)}? This demo will open WhatsApp as confirmation.`)){
      // open whatsapp with summary and clear cart
      checkoutWhatsappBtn.click();
      localStorage.removeItem(cartKey);
      renderCart();
      closeCart();
    }
  });

  /* ---------- PREBOOK MODAL ---------- */
  const prebookModal = document.getElementById('prebook-modal');
  const openPrebookBtn = document.getElementById('open-prebook');
  const prebookCloseBtn = document.getElementById('prebook-close');
  const prebookForm = document.getElementById('prebook-form');

  function openPrebook(){ prebookModal.classList.remove('hidden'); }
  function closePrebook(){ prebookModal.classList.add('hidden'); }

  openPrebookBtn?.addEventListener('click', (e) => { e.preventDefault(); openPrebook(); });
  prebookCloseBtn?.addEventListener('click', closePrebook);

  prebookForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(prebookForm);
    const data = Object.fromEntries(fd.entries());
    // Option 1: Send to WhatsApp immediately (quick)
    const msg = `Prebook Request\nName: ${data.name}\nPhone: ${data.phone}\nProduct: ${data.product}\nDate: ${data.date}\nNotes: ${data.notes || '-'}`;
    window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`, '_blank');

    // Option 2: Send to Google Form by opening prefill link (if you have one)
    // Option 3: Send to Firebase (if USE_FIREBASE true) below

    if(USE_FIREBASE){
      // push to Firestore (see Firebase snippet below)
      pushPrebookToFirebase(data).then(() => {
        alert('Prebooking sent — thank you!');
      }).catch(err => {
        console.error(err);
        alert('There was an error saving. Check console.');
      });
    } else {
      alert('Prebooking opened WhatsApp. We recommend you also capture booking in a spreadsheet or Firebase.');
    }
    prebookForm.reset();
    closePrebook();
  });

  /* ---------- NEWSLETTER ---------- */
  const newsletterBtn = document.getElementById('newsletter-btn');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterForm = document.getElementById('newsletter-form'); // FormSubmit fallback

  newsletterBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = (newsletterEmail?.value || '').trim();
    if(!email){ alert('Enter valid email'); return; }

    // Option A: Use FormSubmit (simple)
    const input = newsletterForm.querySelector('input[name="email"]');
    input.value = email;
    newsletterForm.submit();

    // Option B: If using Firebase, also push subscriber
    if(USE_FIREBASE){
      saveSubscriberToFirebase({ email, createdAt: new Date().toISOString() })
        .then(()=> alert('Subscribed (and saved) — thank you!'))
        .catch(err => { console.error(err); alert('Subscription failed'); });
    }
  });

  /* ---------- SMALL HELPERS ---------- */
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s]);
  }

  // initialise render
  renderCart();

  // Optionally expose openCart function to a cart icon (if you have one)
  // For demo: open cart when clicking the site logo text
  document.querySelectorAll('.nav__logo').forEach(el=>{
    el.addEventListener('click', (e)=>{ e.preventDefault(); openCart(); });
  });

  /* ---------- FIREBASE (optional) ---------- */
  // If you want to use Firebase Firestore instead of FormSubmit/Google Forms,
  // set USE_FIREBASE = true above and paste your Firebase config below.
  // If you plan to use Firebase only for subscribers/prebookings, enable rules accordingly.

  // Example Firebase code (requires <script src="https://www.gstatic.com/firebasejs/9.XX.X/firebase-app-compat.js"></script>
  // and firestore compat script or modular imports — below uses compat for simplicity).
  // NOTE: You must include firebase scripts in your HTML <head> if USE_FIREBASE true.

  async function pushPrebookToFirebase(data){
    if(!window.firebase) throw new Error('Firebase not available. Add scripts and config.');
    const db = firebase.firestore();
    return db.collection('prebookings').add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  async function saveSubscriberToFirebase(data){
    if(!window.firebase) throw new Error('Firebase not available. Add scripts and config.');
    const db = firebase.firestore();
    return db.collection('subscribers').add(data);
  }

}); // DOMContentLoaded
const cartOpenBtn = document.getElementById('cart-open');
cartOpenBtn?.addEventListener('click', openCart);
const launchDate = new Date("2025-01-01T00:00:00").getTime();
setInterval(() => {
  const now = new Date().getTime();
  const diff = launchDate - now;
  if(diff < 0) return;

  const days = Math.floor(diff / (1000*60*60*24));
  document.getElementById("countdown").textContent = `${days} days`;
}, 1000);
