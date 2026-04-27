/* ============================================
   مشروع وجد للعطور - WAJD PERFUMES
   ملف الجافاسكربت الرئيسي
   يحتوي على كل التفاعلات والحركات
   ============================================ */

/*
   DOMContentLoaded = ننتظر حتى يتم تحميل كل عناصر HTML
   قبل ما نبدأ ننفذ أي كود جافاسكربت
*/
document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================
     1. تأثير شريط التنقل عند التمرير
     عند التمرير للأسفل أكثر من 50 بكسل،
     نضيف كلاس "scrolled" للشريط عشان يصير معتم
     ========================================== */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  /* ==========================================
     2. قائمة الجوال (Mobile Menu)
     عند الضغط على زر الهامبرغر (☰)
     نفتح/نغلق القائمة الجانبية
     ========================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    // عند الضغط على الزر: فتح/إغلاق القائمة
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      this.classList.toggle('active');
    });
    // عند الضغط على أي رابط: إغلاق القائمة
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  /* ==========================================
     3. حركات الظهور عند التمرير (Scroll Animations)
     نستخدم Intersection Observer API
     لمراقبة العناصر وإضافة كلاس "visible" لما تظهر في الشاشة
     هذا أفضل من استخدام scroll event لأنه أخف على الأداء
     ========================================== */
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-right, .fade-in-left');
  const observerOptions = {
    threshold: 0.15,                    // العنصر يجب أن يظهر 15% منه
    rootMargin: '0px 0px -50px 0px'     // هامش إضافي من الأسفل
  };

  // إنشاء المراقب (Observer)
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // العنصر ظهر في الشاشة → نضيف كلاس visible
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // تطبيق المراقب على كل العناصر
  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  /* ==========================================
     4. عداد الإحصائيات المتحرك (Counter Animation)
     الأرقام تبدأ من 0 وتعد تصاعدياً حتى القيمة النهائية
     نستخدم requestAnimationFrame لحركة سلسة
     ========================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const target = entry.target;
        // نقرأ القيمة النهائية من خاصية data-count
        const finalValue = parseInt(target.getAttribute('data-count'));
        // نبدأ العد من 0 إلى القيمة النهائية خلال 2 ثانية
        animateCounter(target, 0, finalValue, 2000);
        // نوقف المراقبة بعد التشغيل (مرة وحدة فقط)
        statsObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (num) {
    statsObserver.observe(num);
  });

  // دالة العد التصاعدي
  function animateCounter(element, start, end, duration) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      // نحسب نسبة التقدم (من 0 إلى 1)
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // نطبق تأثير ease-out cubic عشان الحركة تكون سلسة
      const eased = 1 - Math.pow(1 - progress, 3);
      // نحدث الرقم المعروض
      element.textContent = Math.floor(eased * (end - start) + start).toLocaleString('ar-SA');
      if (progress < 1) {
        // نكمل الحركة
        requestAnimationFrame(step);
      } else {
        // وصلنا للنهاية: نعرض الرقم مع علامة +
        element.textContent = end.toLocaleString('ar-SA') + '+';
      }
    }
    requestAnimationFrame(step);
  }

  /* ==========================================
     5. النافذة المنبثقة (Popup)
     تظهر للزائر الجديد بعد 2.5 ثانية
     نستخدم sessionStorage عشان ما تظهر مرتين في نفس الزيارة
     ========================================== */
  const popup = document.querySelector('.popup-overlay');
  const popupClose = document.querySelector('.popup-close');
  if (popup) {
    // نتحقق هل سبق عرض النافذة في هذه الجلسة
    const popupShown = sessionStorage.getItem('popupShown');
    if (!popupShown) {
      // لم تُعرض بعد → نعرضها بعد 2.5 ثانية
      setTimeout(function () {
        popup.classList.add('active');
        sessionStorage.setItem('popupShown', 'true');
      }, 2500);
    }
    // زر الإغلاق
    if (popupClose) {
      popupClose.addEventListener('click', function () {
        popup.classList.remove('active');
      });
    }
    // الإغلاق عند الضغط خارج النافذة
    popup.addEventListener('click', function (e) {
      if (e.target === popup) {
        popup.classList.remove('active');
      }
    });
  }

  /* ==========================================
     6. الجسيمات الذهبية في Hero (Particles)
     ننشئ 30 نقطة ذهبية صغيرة بمواقع عشوائية
     وسرعات مختلفة عشان تعطي تأثير سينمائي
     ========================================== */
  const particlesContainer = document.querySelector('.hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      // موقع أفقي عشوائي
      particle.style.left = Math.random() * 100 + '%';
      // تأخير عشوائي للحركة
      particle.style.animationDelay = Math.random() * 6 + 's';
      // مدة حركة عشوائية (بين 4 و 8 ثوانٍ)
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      particlesContainer.appendChild(particle);
    }
  }

  /* ==========================================
     7. الأسئلة الشائعة - Accordion
     عند الضغط على سؤال: يُفتح ويُغلق الباقي
     ========================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        // نغلق كل الأسئلة أولاً
        faqItems.forEach(function (i) { i.classList.remove('active'); });
        // نفتح السؤال المضغوط (إذا ما كان مفتوح أصلاً)
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  /* ==========================================
     8. المستشار الذكي (AI Advisor)
     عند إرسال النموذج: نختار عطر عشوائي ونعرضه
     (محاكاة لنظام توصية ذكي)
     ========================================== */
  const advisorForm = document.getElementById('advisorForm');
  const aiResult = document.getElementById('aiResult');
  if (advisorForm && aiResult) {
    advisorForm.addEventListener('submit', function (e) {
      e.preventDefault(); // نمنع إعادة تحميل الصفحة

      // قائمة العطور المتاحة للتوصية
      const perfumes = [
        { name: 'عود الملوك', desc: 'عطر شرقي فاخر بمزيج العود الكمبودي والمسك الأبيض، يمنحك حضوراً ملكياً لا يُنسى.', price: '٤٥٠ ر.س' },
        { name: 'ليلة ذهبية', desc: 'عطر مسائي ساحر بنفحات الزعفران والعنبر، مثالي للمناسبات الخاصة والسهرات الراقية.', price: '٣٨٠ ر.س' },
        { name: 'نسمة الورد', desc: 'عطر أنثوي رقيق بمزيج الورد الطائفي والفانيلا، يعكس أناقة المرأة العربية الأصيلة.', price: '٣٢٠ ر.س' },
        { name: 'صندل الخليج', desc: 'عطر خشبي دافئ بنفحات الصندل والباتشولي، لمن يبحث عن التميز والأصالة.', price: '٤٠٠ ر.س' },
        { name: 'مسك الليل', desc: 'عطر غامض وجذاب بمزيج المسك الأسود والبخور، يترك أثراً لا يُمحى.', price: '٣٥٠ ر.س' }
      ];

      // نختار عطر عشوائي
      const random = perfumes[Math.floor(Math.random() * perfumes.length)];

      // نعرض النتيجة
      document.getElementById('resultName').textContent = random.name;
      document.getElementById('resultDesc').textContent = random.desc;
      document.getElementById('resultPrice').textContent = random.price;
      aiResult.classList.add('show');

      // نمرر الصفحة للنتيجة بسلاسة
      aiResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ==========================================
     9. تجربة الرائحة التفاعلية (Scent Experience)
     شريط تمرير يغير نوع الرائحة المعروضة
     مع تغيير الخلفية واللون ديناميكياً
     ========================================== */
  const scentSlider = document.getElementById('scentSlider');
  const scentDisplay = document.getElementById('scentDisplay');
  const scentName = document.getElementById('scentName');
  const scentDesc = document.getElementById('scentDesc');
  if (scentSlider && scentDisplay) {
    // بيانات الروائح المختلفة
    const scents = [
      { name: 'عود', desc: 'رائحة العود الكمبودي الأصيل، دافئة وعميقة تنقلك إلى عالم الشرق الساحر', bg: 'linear-gradient(135deg, #3E2723, #1C1C1C)', color: '#8D6E63' },
      { name: 'مسك', desc: 'نعومة المسك الأبيض النقي، رائحة هادئة وأنيقة تدوم طويلاً', bg: 'linear-gradient(135deg, #F5F5DC, #1C1C1C)', color: '#D4AF37' },
      { name: 'ورد', desc: 'عبق الورد الطائفي الفاخر، رومانسي وأنثوي بامتياز', bg: 'linear-gradient(135deg, #880E4F, #1C1C1C)', color: '#E91E63' },
      { name: 'عنبر', desc: 'دفء العنبر الملكي، رائحة غنية وحسية تأسر الحواس', bg: 'linear-gradient(135deg, #E65100, #1C1C1C)', color: '#FF9800' },
      { name: 'زعفران', desc: 'فخامة الزعفران الإيراني، توابل ذهبية تضيف لمسة ملكية', bg: 'linear-gradient(135deg, #B71C1C, #1C1C1C)', color: '#F44336' },
      { name: 'صندل', desc: 'هدوء خشب الصندل الهندي، رائحة كريمية دافئة ومريحة', bg: 'linear-gradient(135deg, #4E342E, #1C1C1C)', color: '#A1887F' }
    ];

    // عند تحريك الشريط: نحدث العرض
    scentSlider.addEventListener('input', function () {
      const index = Math.min(Math.floor(this.value / (100 / scents.length)), scents.length - 1);
      const scent = scents[index];
      scentDisplay.style.background = scent.bg;
      if (scentName) scentName.textContent = scent.name;
      if (scentName) scentName.style.color = scent.color;
      if (scentDesc) scentDesc.textContent = scent.desc;
    });
  }

  /* ==========================================
     10. العداد التنازلي (Countdown Timer)
     يعد تنازلياً من 7 أيام
     يتحدث كل ثانية باستخدام setInterval
     ========================================== */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    // نحدد الهدف: بعد 7 أيام من الآن
    const target = new Date();
    target.setDate(target.getDate() + 7);

    function updateCountdown() {
      const now = new Date();
      const diff = target - now; // الفرق بالميلي ثانية
      if (diff <= 0) return;

      // نحسب الأيام والساعات والدقائق والثواني
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // نحدث العناصر في الصفحة
      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000); // تحديث كل ثانية
  }

  /* ==========================================
     11. نموذج الطلب (Order Form)
     عند الإرسال: نخفي النموذج ونعرض رسالة نجاح
     ========================================== */
  const orderForm = document.getElementById('orderForm');
  const successMsg = document.getElementById('successMessage');
  if (orderForm && successMsg) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault(); // نمنع إعادة تحميل الصفحة
      orderForm.style.display = 'none'; // نخفي النموذج
      successMsg.classList.add('show'); // نعرض رسالة النجاح
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ==========================================
     12. نموذج التواصل (Contact Form)
     عند الإرسال: نعرض رسالة تأكيد ونفرغ النموذج
     ========================================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
      contactForm.reset(); // نفرغ كل الحقول
    });
  }

  /* ==========================================
     13. نموذج النشرة البريدية (Newsletter)
     ========================================== */
  const nlForms = document.querySelectorAll('.newsletter-form');
  nlForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('تم الاشتراك بنجاح! شكراً لانضمامك لعائلة وجد للعطور.');
      form.reset();
    });
  });

  /* ==========================================
     14. تقييم النجوم التفاعلي (Star Rating)
     عند الضغط على نجمة: تتلون هي وكل النجوم قبلها
     ========================================== */
  const starContainers = document.querySelectorAll('.star-rating');
  starContainers.forEach(function (container) {
    const stars = container.querySelectorAll('.star');
    stars.forEach(function (star, index) {
      star.addEventListener('click', function () {
        stars.forEach(function (s, i) {
          if (i <= index) {
            // النجوم من 0 إلى index تكون ملونة
            s.classList.remove('empty');
            s.textContent = '★';
          } else {
            // الباقي تكون فارغة
            s.classList.add('empty');
            s.textContent = '★';
          }
        });
      });
    });
  });

  /* ==========================================
     15. تكبير صورة المنتج (Image Zoom)
     عند تحريك الماوس على الصورة: تتكبر
     نقطة التكبير تتبع موقع الماوس
     ========================================== */
  const mainImage = document.querySelector('.main-image img');
  if (mainImage) {
    mainImage.addEventListener('mousemove', function (e) {
      // نحسب موقع الماوس بالنسبة للصورة (نسبة مئوية)
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      // نحدد نقطة التكبير ونكبر الصورة 1.5 مرة
      this.style.transformOrigin = x + '% ' + y + '%';
      this.style.transform = 'scale(1.5)';
    });
    // عند خروج الماوس: نرجع الصورة لحجمها الطبيعي
    mainImage.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
    });
  }

  /* ==========================================
     16. معرض الصور المصغرة (Thumbnail Gallery)
     عند الضغط على صورة مصغرة: تظهر في الصورة الكبيرة
     ========================================== */
  const thumbs = document.querySelectorAll('.thumb-gallery .thumb');
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      // نزيل التحديد من كل الصور المصغرة
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      // نحدد الصورة المضغوطة
      this.classList.add('active');
      // نغير الصورة الكبيرة
      const img = this.querySelector('img');
      if (img && mainImage) {
        mainImage.src = img.src;
      }
    });
  });

  /* ==========================================
     17. عداد الزوار (Visitor Counter)
     نستخدم localStorage لحفظ العدد بين الزيارات
     كل زيارة يزيد العدد بـ 1-3 عشوائياً
     ========================================== */
  const visitorEl = document.querySelector('.visitor-count');
  if (visitorEl) {
    let count = parseInt(localStorage.getItem('visitorCount') || '14523');
    count += Math.floor(Math.random() * 3) + 1;
    localStorage.setItem('visitorCount', count.toString());
    visitorEl.textContent = count.toLocaleString('ar-SA');
  }

  /* ==========================================
     18. شريط تمرير السعر (Price Range Slider)
     يعرض القيمة الحالية بجانب الشريط
     ========================================== */
  const priceSlider = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  if (priceSlider && priceValue) {
    priceSlider.addEventListener('input', function () {
      priceValue.textContent = parseInt(this.value).toLocaleString('ar-SA') + ' ر.س';
    });
  }

  /* ==========================================
     19. تأثير Parallax
     العناصر تتحرك بسرعة مختلفة عن التمرير
     مما يعطي إحساس بالعمق
     ========================================== */
  window.addEventListener('scroll', function () {
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(function (el) {
      const speed = el.getAttribute('data-speed') || 0.5;
      const yPos = -(window.scrollY * speed);
      el.style.transform = 'translateY(' + yPos + 'px)';
    });
  });

});
