/**
 * APEX FIT — Interactive Application Logic
 * Router, Gallery Lightbox, Billing Switch, Form Validation, Review Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBillingToggle();
  initGalleryFilter();
  initLightbox();
  initReelModal();
  initLeadForm();
  initReviewsSystem();
  initMetricCounters();
});

/* ==========================================================================
   1. NAVIGATION & SPA ROUTER
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .nav-route-trigger');
  const pageViews = document.querySelectorAll('.page-view');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.querySelector('.nav-links');

  function navigateTo(targetId) {
    const cleanId = targetId.replace('#', '') || 'home';
    
    // Toggle active view
    pageViews.forEach(view => {
      if (view.id === `page-${cleanId}`) {
        view.classList.add('active-page');
      } else {
        view.classList.remove('active-page');
      }
    });

    // Toggle active nav link
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${cleanId}` || (cleanId === 'home' && href === '#')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (navLinksContainer) {
      navLinksContainer.classList.remove('mobile-open');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Hash change handler
  window.addEventListener('hashchange', () => {
    navigateTo(window.location.hash);
  });

  // Initial load
  if (window.location.hash) {
    navigateTo(window.location.hash);
  } else {
    navigateTo('#home');
  }

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });
  }
}

/* ==========================================================================
   2. BILLING TOGGLE (Monthly vs Annual 20% Discount)
   ========================================================================== */
function initBillingToggle() {
  const toggleBtn = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('lblMonthly');
  const annualLabel = document.getElementById('lblAnnual');
  const basicPrice = document.getElementById('priceBasic');
  const proPrice = document.getElementById('pricePro');
  const vipPrice = document.getElementById('priceVip');
  
  if (!toggleBtn) return;

  let isAnnual = false;

  toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    toggleBtn.classList.toggle('annual', isAnnual);
    
    if (isAnnual) {
      monthlyLabel.classList.remove('active');
      annualLabel.classList.add('active');
      
      // Calculate 20% off
      basicPrice.innerHTML = '$23 <span>/ month (Billed Annually)</span>';
      proPrice.innerHTML = '$47 <span>/ month (Billed Annually)</span>';
      vipPrice.innerHTML = '$79 <span>/ month (Billed Annually)</span>';
      
      showToast('20% Annual Discount Applied!');
    } else {
      annualLabel.classList.remove('active');
      monthlyLabel.classList.add('active');
      
      basicPrice.innerHTML = '$29 <span>/ month</span>';
      proPrice.innerHTML = '$59 <span>/ month</span>';
      vipPrice.innerHTML = '$99 <span>/ month</span>';
    }
  });
}

/* ==========================================================================
   3. GALLERY CATEGORY FILTER
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      galleryCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. LIGHTBOX MODAL
   ========================================================================== */
function initLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (!lightboxModal) return;

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-title')?.textContent || 'Apex Fit Facility';
      const desc = card.dataset.desc || 'Experience top-of-the-line equipment and high-energy atmosphere.';

      lightboxImg.src = img.src;
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;

      lightboxModal.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
    }
  });
}

/* ==========================================================================
   5. VIDEO REELS SIMULATION
   ========================================================================== */
function initReelModal() {
  const playBtns = document.querySelectorAll('.reel-play-btn');

  playBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const reelTitle = btn.closest('.reel-card').querySelector('.reel-title')?.textContent || 'Apex Reel';
      showToast(`Playing Reel: ${reelTitle} 🔥`);
    });
  });
}

/* ==========================================================================
   6. MEMBERSHIP LEAD FORM & SUCCESS MODAL
   ========================================================================== */
function initLeadForm() {
  const leadForm = document.getElementById('membershipForm');
  const successModal = document.getElementById('successModal');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const planSelect = document.getElementById('formPlan');

  // Trigger from pricing cards
  const planBtns = document.querySelectorAll('.select-plan-btn');
  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.dataset.plan;
      if (planSelect) {
        planSelect.value = planName;
      }
      window.location.hash = '#memberships';
      const formElement = document.getElementById('membershipFormSection');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (!leadForm) return;

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const inputs = leadForm.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });

    if (isValid) {
      const nameVal = document.getElementById('formName').value;
      const planVal = document.getElementById('formPlan').value;
      
      document.getElementById('modalMemberName').textContent = nameVal;
      document.getElementById('modalSelectedPlan').textContent = planVal.toUpperCase();

      successModal.classList.add('active');
      leadForm.reset();
    } else {
      showToast('Please complete all required fields correctly.');
    }
  });

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }
}

/* ==========================================================================
   7. REVIEWS SYSTEM & SLIDE-OVER DRAWER
   ========================================================================== */
function initReviewsSystem() {
  const reviewFilterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');
  const leaveReviewBtn = document.getElementById('leaveReviewBtn');
  const reviewDrawer = document.getElementById('reviewDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const reviewForm = document.getElementById('reviewForm');
  const starPickers = document.querySelectorAll('.star-picker span');
  const selectedRatingInput = document.getElementById('selectedRatingInput');

  // Review Category Filter
  reviewFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      reviewFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const goal = btn.dataset.goal;
      reviewCards.forEach(card => {
        if (goal === 'all' || card.dataset.goal === goal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open / Close Drawer
  if (leaveReviewBtn && reviewDrawer) {
    leaveReviewBtn.addEventListener('click', () => {
      reviewDrawer.classList.add('active');
    });

    closeDrawerBtn.addEventListener('click', () => {
      reviewDrawer.classList.remove('active');
    });

    reviewDrawer.addEventListener('click', (e) => {
      if (e.target === reviewDrawer) {
        reviewDrawer.classList.remove('active');
      }
    });
  }

  // Interactive Star Rating Picker
  starPickers.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.val);
      selectedRatingInput.value = val;
      starPickers.forEach((s, idx) => {
        if (idx < val) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
    });
  });

  // Submit Review Handling
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('revName').value.trim();
      const goal = document.getElementById('revGoal').value;
      const quote = document.getElementById('revQuote').value.trim();
      const coach = document.getElementById('revCoach').value;
      const rating = selectedRatingInput.value || 5;

      if (!name || !quote) {
        showToast('Please enter your name and review quote.');
        return;
      }

      // Create & Append New Review Card
      const reviewsGrid = document.getElementById('reviewsGrid');
      const newCard = document.createElement('div');
      newCard.className = 'review-card';
      newCard.dataset.goal = goal.toLowerCase().replace(' ', '-');

      let starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);

      newCard.innerHTML = `
        <div>
          <div class="member-header">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="${name}" class="member-avatar">
            <div>
              <div class="member-name">${name}</div>
              <span class="verified-tag">✓ Verified Apex Member</span>
            </div>
          </div>
          <span class="transformation-badge">${goal}</span>
          <div class="stars-row" style="color: #FFD700; margin-bottom: 0.5rem;">${starsHtml}</div>
          <p class="quote-text">"${quote}"</p>
        </div>
        <div class="tagged-coach">Coach: ${coach}</div>
      `;

      reviewsGrid.prepend(newCard);
      reviewDrawer.classList.remove('active');
      reviewForm.reset();
      showToast('Thank you! Your review is live! 🎉');
    });
  }
}

/* ==========================================================================
   8. METRIC COUNTERS ANIMATION
   ========================================================================== */
function initMetricCounters() {
  const counters = document.querySelectorAll('.metric-number[data-target]');
  
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = target / 50;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            counter.innerText = Math.ceil(count) + suffix;
            setTimeout(updateCount, 25);
          } else {
            counter.innerText = target.toLocaleString() + suffix;
          }
        };

        updateCount();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* Helper Toast Notice */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
