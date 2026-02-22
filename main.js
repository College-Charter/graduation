/* ============================================
   COLLEGE CHARTER - Main JavaScript File
   ============================================ */

// ============================================
// MOBILE NAVIGATION MENU
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
});

// ============================================
// PRICING TOGGLE (MONTHLY/YEARLY)
// ============================================

function initPricingToggle() {
  const billingCycle = document.getElementById('billing-cycle');

  if (billingCycle) {
    let isYearly = false;

    billingCycle.addEventListener('click', function(e) {
      e.preventDefault();
      isYearly = !isYearly;
      
      // Toggle active class on button
      billingCycle.classList.toggle('active');
      
      // Update prices
      document.querySelectorAll('[data-monthly-price]').forEach(el => {
        const monthlyPrice = el.getAttribute('data-monthly-price');
        const yearlyPrice = el.getAttribute('data-yearly-price');
        el.textContent = isYearly ? yearlyPrice : monthlyPrice;
      });

      // Update billing period labels (only spans without prices)
      document.querySelectorAll('[data-billing-period]:not([data-monthly-price])').forEach(el => {
        const period = isYearly ? '/year' : '/month';
        el.textContent = period;
      });

      // Update savings text
      const savingsElements = document.querySelectorAll('[data-savings]');
      savingsElements.forEach(el => {
        el.style.display = isYearly ? 'block' : 'none';
      });
    });
  }
}

initPricingToggle();

// ============================================
// FAQ ACCORDION
// ============================================

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function() {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

initFAQ();

// ============================================
// ESSAY CHECK - WORD COUNTER
// ============================================

function initWordCounter() {
  const essayInput = document.getElementById('essay-input');
  const wordCount = document.getElementById('word-count');
  const charCount = document.getElementById('char-count');
  const readingTime = document.getElementById('reading-time');

  if (essayInput) {
    essayInput.addEventListener('input', function() {
      const text = this.value.trim();
      
      // Word count
      const words = text.length > 0 ? text.split(/\s+/).length : 0;
      if (wordCount) wordCount.textContent = words;

      // Character count
      const chars = text.length;
      if (charCount) charCount.textContent = chars;

      // Reading time (assuming 200 words per minute)
      const minutes = Math.ceil(words / 200);
      if (readingTime) readingTime.textContent = minutes < 1 ? '< 1 min' : minutes + ' min';

      // Enable/disable submit button
      const submitBtn = document.getElementById('submit-essay');
      if (submitBtn) {
        submitBtn.disabled = words < 50;
      }
    });

    // Trigger counter on page load
    essayInput.dispatchEvent(new Event('input'));
  }
}

initWordCounter();

// ============================================
// ESSAY CHECK - SUBMIT & FEEDBACK
// ============================================

function initEssaySubmit() {
  const submitBtn = document.getElementById('submit-essay');

  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      const essayInput = document.getElementById('essay-input');
      const text = essayInput.value;

      if (text.length < 50) {
        alert('Please write at least 50 characters');
        return;
      }

      // Show loading spinner
      const spinner = document.querySelector('.loading-spinner');
      if (spinner) spinner.classList.add('active');

      // Simulate API call
      setTimeout(function() {
        if (spinner) spinner.classList.remove('active');
        displayEssayFeedback(text);
      }, 2000);
    });
  }
}

function displayEssayFeedback(text) {
  const feedbackSection = document.querySelector('.feedback-section');

  if (!feedbackSection) return;

  // Generate feedback based on text
  const wordCount = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgWordsPerSentence = Math.round(wordCount / sentences);

  const feedback = [
    {
      type: '✓ Grammar',
      message: 'No major grammar issues detected. Great work!'
    },
    {
      type: '⚠ Style',
      message: 'Your average sentence length is ' + avgWordsPerSentence + ' words. Consider varying sentence length for better readability.'
    },
    {
      type: '✓ Clarity',
      message: 'Your writing is clear and well-structured.'
    },
    {
      type: '💡 Suggestions',
      message: 'Consider adding more specific examples to support your arguments.'
    }
  ];

  const feedbackHTML = feedback.map(item => `
    <div class="feedback-item">
      <div class="feedback-type">${item.type}</div>
      <p>${item.message}</p>
    </div>
  `).join('');

  feedbackSection.innerHTML = feedbackHTML;
  feedbackSection.classList.add('active');

  // Scroll to feedback
  feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

initEssaySubmit();

// ============================================
// BLOG - SEARCH & FILTER
// ============================================

function initBlogFilters() {
  const searchInput = document.getElementById('blog-search');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  function filterBlogs() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activeCategory = document.querySelector('.category-btn.active');
    const selectedCategory = activeCategory ? activeCategory.dataset.category : 'all';

    blogCards.forEach(card => {
      const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
      const category = card.dataset.category;

      const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
      card.classList.add('fade-in');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterBlogs);
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterBlogs();
    });
  });
}

initBlogFilters();

// ============================================
// NEWSLETTER SIGNUP
// ============================================

function initNewsletterSignup() {
  const forms = document.querySelectorAll('.newsletter-form');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput?.value;

      if (email && validateEmail(email)) {
        // Show success message
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '✓ Subscribed!';
        button.disabled = true;
        button.style.background = '#4CAF50';

        // Reset after 3 seconds
        setTimeout(() => {
          emailInput.value = '';
          button.textContent = originalText;
          button.disabled = false;
          button.style.background = '';
        }, 3000);
      } else {
        alert('Please enter a valid email address');
      }
    });
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

initNewsletterSignup();

// ============================================
// CONTACT FORM
// ============================================

function initContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value;
      const email = document.getElementById('contact-email')?.value;
      const subject = document.getElementById('contact-subject')?.value;
      const message = document.getElementById('contact-message')?.value;

      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
      }

      if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Show success message
      const button = this.querySelector('button');
      const originalText = button.textContent;
      button.textContent = '✓ Message Sent!';
      button.disabled = true;
      button.style.background = '#4CAF50';

      // Reset form after 2 seconds
      setTimeout(() => {
        this.reset();
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = '';
      }, 2000);

      // Form submitted successfully - in production, data would be sent to server
    });
  }
}

initContactForm();

// ============================================
// AUTH FORMS (SIGN IN / SIGN UP)
// ============================================

function initAuthForms() {
  const signupForm = document.getElementById('signup-form');
  const signinForm = document.getElementById('signin-form');

  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const fullName = document.getElementById('signup-name')?.value;
      const email = document.getElementById('signup-email')?.value;
      const password = document.getElementById('signup-password')?.value;
      const confirmPassword = document.getElementById('signup-confirm')?.value;
      const terms = document.getElementById('terms-checkbox')?.checked;

      // Validation
      if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
      }

      if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      if (!terms) {
        alert('Please accept the terms and conditions');
        return;
      }

      handleAuthSuccess('signup');
    });
  }

  if (signinForm) {
    signinForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('signin-email')?.value;
      const password = document.getElementById('signin-password')?.value;
      const rememberMe = document.getElementById('remember-checkbox')?.checked;

      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }

      if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }

      handleAuthSuccess('signin');
    });
  }
}

function handleAuthSuccess(type) {
  const message = type === 'signup' 
    ? 'Account created successfully! Redirecting...' 
    : 'Logged in successfully! Redirecting...';

  alert(message);
  // In production, redirect to dashboard
  // window.location.href = '/dashboard';
}

initAuthForms();

// ============================================
// SOCIAL LOGIN BUTTONS
// ============================================

function initSocialLogin() {
  const socialBtns = document.querySelectorAll('.social-btn');

  socialBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const provider = this.dataset.provider || 'social';
      alert('Connecting to ' + provider.charAt(0).toUpperCase() + provider.slice(1) + '...');
      // In production, implement OAuth flow
    });
  });
}

initSocialLogin();

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// FORM INPUT FOCUS STYLES
// ============================================

document.querySelectorAll('input, textarea, select').forEach(field => {
  field.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });

  field.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
  });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function addClass(element, className) {
  if (element) element.classList.add(className);
}

function removeClass(element, className) {
  if (element) element.classList.remove(className);
}

function toggleClass(element, className) {
  if (element) element.classList.toggle(className);
}

function setActive(buttons, activeButton) {
  buttons.forEach(btn => btn.classList.remove('active'));
  if (activeButton) activeButton.classList.add('active');
}

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

window.addEventListener('load', function() {
  // Add fade-in animation to sections
  document.querySelectorAll('section').forEach((section, index) => {
    setTimeout(() => {
      section.classList.add('fade-in');
    }, index * 100);
  });
});

// ============================================
// LAZY LOADING (for images/content)
// ============================================

function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

initLazyLoading();

// ============================================
// COOKIE CONSENT (Simple Implementation)
// ============================================
// Note: Cookie banner elements not currently implemented in HTML
// Uncomment when cookie banner is added to pages
/*
function initCookieConsent() {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const rejectBtn = document.getElementById('reject-cookies');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    cookieBanner.style.display = 'block';
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      localStorage.setItem('cookiesAccepted', 'true');
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', function() {
      localStorage.setItem('cookiesAccepted', 'false');
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }
}

initCookieConsent();
*/

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

function highlightActiveNavLink() {
  const currentHref = window.location.href;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentHref.includes(href) || (href === 'index.html' && currentHref.includes('/'))) {
      link.style.color = 'var(--accent)';
      link.style.fontWeight = '700';
    }
  });
}

highlightActiveNavLink();

// ============================================
// AUTO-INITIALIZE ALL FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Website initialized
});
