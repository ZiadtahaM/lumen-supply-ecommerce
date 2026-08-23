(() => {
  const products = [...document.querySelectorAll('.product-card')];
  const cart = [];
  const cartCount = document.querySelector('.cart-count');
  const cartTitleCount = document.querySelector('.cart-title-count');
  const cartBody = document.querySelector('#cartBody');
  const cartTotal = document.querySelector('#cartTotal');
  const checkoutButton = document.querySelector('#checkoutButton');

  const formatMoney = value => `$${value.toFixed(0)}`;

  function renderCart() {
    const count = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartCount.textContent = count;
    cartTitleCount.textContent = `(${count})`;
    cartTotal.textContent = formatMoney(total);
    checkoutButton.disabled = count === 0;
    if (!count) {
      cartBody.innerHTML = '<div class="empty-cart"><i class="fa-regular fa-face-smile"></i><p>Your bag is feeling light.</p><span>Add something you’ll use every day.</span></div>';
      return;
    }
    cartBody.innerHTML = cart.map((item, index) => `<div class="cart-item"><span>${item.name}</span><strong>${formatMoney(item.price)}</strong><button type="button" data-remove="${index}" aria-label="Remove ${item.name}">Remove</button></div>`).join('');
  }

  document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', () => {
      cart.push({ name: button.dataset.product, price: Number(button.dataset.price) });
      button.innerHTML = 'Added to bag <i class="fa-solid fa-check"></i>';
      button.classList.add('added');
      window.setTimeout(() => {
        button.innerHTML = 'Add to bag <i class="fa-solid fa-plus"></i>';
        button.classList.remove('added');
      }, 1300);
      renderCart();
    });
  });

  cartBody.addEventListener('click', event => {
    const removeButton = event.target.closest('[data-remove]');
    if (!removeButton) return;
    cart.splice(Number(removeButton.dataset.remove), 1);
    renderCart();
  });

  document.querySelectorAll('.heart-button').forEach(button => {
    button.addEventListener('click', () => {
      const icon = button.querySelector('i');
      const saved = icon.classList.contains('fa-solid');
      icon.classList.toggle('fa-solid', !saved);
      icon.classList.toggle('fa-regular', saved);
      button.setAttribute('aria-label', saved ? 'Save product' : 'Remove product from saved items');
    });
  });

  document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
      const filter = button.dataset.filter;
      products.forEach(product => {
        product.hidden = filter !== 'all' && product.dataset.category !== filter;
      });
    });
  });

  const searchInput = document.querySelector('#searchInput');
  const searchResults = document.querySelector('#searchResults');
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
      searchResults.textContent = 'Start typing to search the edit.';
      return;
    }
    const matches = products.filter(product => product.dataset.name.toLowerCase().includes(term));
    searchResults.textContent = matches.length ? `${matches.length} match${matches.length === 1 ? '' : 'es'} in the edit: ${matches.map(product => product.dataset.name).join(', ')}.` : 'Nothing found yet — try a different word.';
  });

  document.querySelector('#newsletterForm').addEventListener('submit', event => {
    event.preventDefault();
    const feedback = document.querySelector('#formFeedback');
    const consent = document.querySelector('#newsletterConsent');
    if (!consent?.checked) {
      feedback.textContent = 'Please confirm newsletter consent before continuing.';
      return;
    }
    feedback.textContent = 'Newsletter service is not connected in this preview. Your email was not sent.';
  });

  checkoutButton.addEventListener('click', () => {
    checkoutButton.textContent = 'Checkout coming soon';
    window.setTimeout(() => { checkoutButton.textContent = 'Checkout securely'; }, 1800);
  });

  const assistantForm = document.querySelector('[data-lumen-assistant-form]');
  const assistantStatus = document.querySelector('#lumen-assist-status');
  const assistantSubmit = assistantForm.querySelector('button[type="submit"]');
  assistantForm.addEventListener('submit', async event => {
    event.preventDefault();
    const rawQuestion = new FormData(assistantForm).get('question');
    const question = typeof rawQuestion === 'string' ? rawQuestion.trim() : '';
    if (!question) return;
    assistantSubmit.disabled = true;
    assistantStatus.textContent = 'Reading the Lumen edit…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch('/api/lumen-assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, products: products.map(product => ({ name: product.dataset.name, category: product.dataset.category, price: Number(product.dataset.price) })) }), signal: controller.signal });
      if (!response.ok) throw new Error('assistant unavailable');
      const result = await response.json();
      assistantStatus.textContent = typeof result.answer === 'string' && result.answer.trim() ? result.answer : 'Try the search button to explore the real edit.';
    } catch {
      const lower = question.toLowerCase();
      const answer = lower.includes('desk') || lower.includes('focus') || lower.includes('work')
        ? 'For a calmer desk, start with the Halo desk light and Pebble timer.'
        : lower.includes('carry') || lower.includes('travel') || lower.includes('commute')
          ? 'For everyday carry, the Field tote is the practical starting point.'
          : lower.includes('listen') || lower.includes('music') || lower.includes('quiet')
            ? 'For quieter listening, start with Arc headphones.'
            : 'Start with the Field tote for an everyday upgrade, or browse the full edit by category.';
      assistantStatus.textContent = answer;
    } finally {
      clearTimeout(timeout);
      assistantSubmit.disabled = false;
    }
  });

  renderCart();
})();
