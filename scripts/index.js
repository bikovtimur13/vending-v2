class Modal {
  constructor(modalClass, closeBtnClass, openBtnClass) {
    this.modal = document.querySelector(`.${modalClass}`);
    this.closeBtns = document.querySelectorAll(`.${closeBtnClass}`);
    this.openBtns = document.querySelectorAll(`.${openBtnClass}`);
    this.body = document.body;

    this.init();
  }

  openModal() {
    this.modal.classList.add('_active');
  }

  closeModal() {
    this.modal.classList.remove('_active');
  }

  handleOpenModal() {
    this.openBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        this.body.style.overflow = 'hidden';
        this.openModal();
      });
    });
  }

  handleCloseModal() {
    this.closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.body.style.overflow = 'unset';
        this.closeModal();
      });
    });
  }

  init() {
    this.handleCloseModal();
    this.handleOpenModal();
  }
}

try {
  new Modal('popup', 'popup__close-btn', 'open-popup');
} catch (err) {
  console.error(err);
}

try {
  new Modal(
    'subscription-popup',
    'subscription-popup__close-btn',
    'subscription-popup__open-popup'
  );
} catch (err) {
  console.error(err);
}

try {
  new Modal('agreement-popup', 'agreement-popup__close-btn', 'agreement-popup__open-popup');
} catch (err) {
  console.error(err);
}

const validCode = new CustomEvent('validInputs');
const notValidCode = new CustomEvent('notValidInputs');
const isValidInputs = new CustomEvent('isValidInputs');

function codeFormScript() {
  const codeForm = document.querySelector('._js-code-form');
  if (!codeForm) return;
  const codeFormSubmitBtn = codeForm.querySelector('.submit-btn');

  codeFormSubmitBtn.addEventListener('input', validateCodeForm);

  const codeInputs = codeForm.querySelectorAll('.input-one-number');
  codeInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
      if (event.target.value.length === 4) {
        const codeArr = event.target.value.split('');
        codeInputs.forEach((input, index) => {
          input.value = codeArr[index];
        });
      }
      handleCodeInput(event, index);
    });
  });

  function validateCodeForm() {
    const pattern = /^[0-9]+$/;
    let valid = Array.from(codeInputs).every(
      (input) => pattern.test(input.value) && input.value > 0
    );

    if (valid) {
      codeFormSubmitBtn.classList.remove('btn-disabled');
      codeFormSubmitBtn.dispatchEvent(new CustomEvent('validInputs'));
    } else {
      codeFormSubmitBtn.classList.add('btn-disabled');
      codeFormSubmitBtn.dispatchEvent(new CustomEvent('notValidInputs'));
    }
  }

  function handleCodeInput(event, index) {
    const pattern = /^[0-9]+$/;
    let value = event.target.value;

    if (!pattern.test(value)) {
      value = '';
    }

    value = value.slice(0, 1);
    event.target.value = value;

    if (value.length === 1 && index < codeInputs.length - 1) {
      codeInputs[index + 1].focus();
    }

    validateCodeForm();
  }
}
try {
  codeFormScript();
} catch (err) {
  console.error(err);
}

function registrationFormScript() {
  const registartionForm = document.querySelector('._js-registration-form');
  if (!registartionForm) return;
  const registrationFormSubmitBtn = registartionForm.querySelector('.registration-submit-btn');

  const validInputs = {
    name: false,
    email: false,
    agreement: false,
  };

  registrationFormSubmitBtn.addEventListener('isValidInputs', () => {
    if (validInputs.name && validInputs.email && validInputs.agreement) {
      registrationFormSubmitBtn.classList.remove('btn-disabled');
    } else {
      registrationFormSubmitBtn.classList.add('btn-disabled');
    }
  });

  const nameInput = registartionForm.querySelector('.registration-input[name="name"]');
  const emailInput = registartionForm.querySelector('.registration-input[name="email"]');
  const agreementInput = document.querySelector('._js-agreement-checkbox');

  nameInput.addEventListener('input', (event) => {
    if (event.target.value.length > 2) {
      validInputs.name = true;
    } else {
      validInputs.name = false;
    }
    registrationFormSubmitBtn.dispatchEvent(isValidInputs);
  });

  emailInput.addEventListener('input', (event) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (pattern.test(event.target.value)) {
      validInputs.email = true;
    } else {
      validInputs.email = false;
    }
    registrationFormSubmitBtn.dispatchEvent(isValidInputs);
  });

  agreementInput.addEventListener('change', () => {
    if (agreementInput.checked) {
      validInputs.agreement = true;
    } else {
      validInputs.agreement = false;
    }
    registrationFormSubmitBtn.dispatchEvent(isValidInputs);
  });
}

try {
  registrationFormScript();
} catch (err) {
  console.error(err);
}

numberInputScript();
function numberInputScript() {
  const numberInput = document.querySelector('.number-input');
  if (!numberInput) return;

  numberInput.addEventListener('input', (event) => {
    const formattedInput = formatNumber(event.target.value);
    event.target.value = formattedInput;
  });
}

function formatNumber(input) {
  let isCountryCode = false;
  input = input.replace('+7', '');

  const cleanedInput = input.replace(/\D/g, '').slice();
  const countryCode = '+7';
  const pattern = '000 000 00 00';
  let index = 0;
  let formattedInput = '';

  for (let i = 0; i < pattern.length; i++) {
    if (index >= cleanedInput.length) {
      break;
    }

    if (pattern[i] === '0') {
      formattedInput += cleanedInput[index];
      index++;
    } else {
      formattedInput += pattern[i];
    }
  }
  if (!isCountryCode) {
    return countryCode + ' ' + formattedInput;
  }

  return formattedInput;
}

addProfileAvatar();
function addProfileAvatar() {
  const form = document.querySelector('._js-profile-form');
  const avatarInput = document.querySelector('#profile-avatar');
  if (!avatarInput) return;

  avatarInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const fileSizeInBytes = file.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

    if (fileSizeInMB >= 20) {
      alert('Размер файла не должен превышать 20 МБ!');
      input.value = '';
    } else {
      form.submit();
    }
  });
}

// ВИДЕО СЛАЙДЕР

try {
  initSwiper();
} catch (error) {
  console.error(error);
}

function insertSwiper(swiperWrapper, html) {
  if (!swiperWrapper || !html) return;
  swiperWrapper.insertAdjacentHTML('beforeend', html);
}

function swiperSlideHtml(videoLink, id) {
  if (!videoLink || !id) return;
  return `
  <div class="swiper-slide">
    <video
      data-product-id="${id}"
      class="swiper-slide-video"
      playsinline
      muted
      preload="auto">
      <source src="${videoLink}" />
    </video>
  </div>
  `;
}

function initSwiper() {
  const products = [
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/axiom-eye.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhery-dlya-golovy-i-glaz/yamaguchi-axiom-eye.php',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/xi-basta.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhnyie-kresla/yamaguchi-xi',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/liberty.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhnyie-kresla/liberty-gray',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/xi-kirkorov.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhnyie-kresla/yamaguchi-xi',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/osumi.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhery-dlya-tela/osumi',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/xi-orlova.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhnyie-kresla/yamaguchi-xi',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/xu-kirkorov.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhnyie-kresla/yamaguchi-xu',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/fen.mp4',
      pageLink: 'https://www.yamaguchi.ru/tovari-dlya-krasoti/hair-styler-with-7-heads',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/capsula.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhery-dlya-nog/yamaguchi-capsula-grey',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/beauty-box.mp4',
      pageLink: 'https://www.yamaguchi.ru/beautybox',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/standing-desk.mp4',
      pageLink: 'https://www.yamaguchi.ru/tovari-dlya-zdorovya/standing-desk-dark.php',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/hula-hoop.mp4',
      pageLink: 'https://www.yamaguchi.ru/tovari-dlya-zdorovya/hula-hoop',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/xu-doroga.mp4',
      pageLink: 'https://www.yamaguchi.ru/x-collection',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/xi-nagiev.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhnyie-kresla/yamaguchi-xi',
    },
    {
      videoLink: 'https://sportapp.yamaguchi.ru/uploads/media_vending/xi-medvedeva.mp4',
      pageLink: 'https://www.yamaguchi.ru/massazhnyie-kresla/yamaguchi-xi',
    },
  ].map((product, index) => {
    return { ...product, id: index };
  });

  const swiperEl = document.querySelector('.video-swiper');
  if (!swiperEl) return;
  const progressBar = document.querySelector('.upper-content__progress-bar');
  const linkBtn = document.querySelector('.upper-content__more');
  const swiperWrapper = swiperEl.querySelector('.swiper-wrapper');
  products.forEach((product) => {
    const html = swiperSlideHtml(product.videoLink, product.id);
    if (html) {
      insertSwiper(swiperWrapper, html);
    }
  });
  let prevVideo = null;

  const swiper = new Swiper('.video-swiper', {
    loop: true,
    autoplay: false,
    direction: 'vertical',
    on: {
      init: function () {
        const activeSlide = this.slides[this.activeIndex];
        const video = activeSlide.querySelector('video');
        if (video) {
          const productId = video.dataset.productId;
          const currentProduct = products.find((product) => product.id === Number(productId));
          linkBtn.href = currentProduct.pageLink;
          video.addEventListener('ended', onVideoEnd);
          video.addEventListener('loadedmetadata', onVideoPlay);
        }
      },
    },
  });

  swiper.on('slideChange', () => {
    if (prevVideo) {
      prevVideo.pause();
      prevVideo.currentTime = 0;
    }
    const activeSlide = swiper.slides[swiper.activeIndex];
    const video = activeSlide.querySelector('video');
    prevVideo = video;

    if (video) {
      const productId = video.dataset.productId;
      const currentProduct = products.find((product) => product.id === Number(productId));
      linkBtn.href = currentProduct.pageLink;
      video.addEventListener('ended', onVideoEnd);
      video.addEventListener('play', onVideoPlay);
      video.play();
    }
  });
  function onVideoEnd(event) {
    swiper.slideNext();
    event.target.removeEventListener('ended', onVideoEnd);
  }

  function onVideoPlay(event) {
    progressBar.innerHTML = '';
    const progressStrip = createProgressStrip();
    progressBar.appendChild(progressStrip);
    const length = getTotalLength(event.target);
    progressStrip.style.animation = `progress ${length}s linear`;
    if (event.type === 'loadedmetadata') {
      event.target.play();
    }
    event.target.removeEventListener('play', onVideoPlay);
  }
}

function getTotalLength(player) {
  const totalLength = player.duration % 60;
  return totalLength;
}

function createProgressStrip() {
  const progressStrip = document.createElement('div');
  progressStrip.classList.add('upper-content__progress-bar-strip');
  return progressStrip;
}

controlVideoAudio('.swiper-slide-video');
function controlVideoAudio(className) {
  const video = document.querySelectorAll(className);
  const controlBtn = document.querySelector('._js-control-btn');

  if (video.length === 0 || !controlBtn) return;

  controlBtn.addEventListener('click', () => {
    if (controlBtn.classList.contains('_muted')) {
      video.forEach((item) => {
        item.muted = false;
      });
      controlBtn.classList.remove('_muted');
    } else {
      video.forEach((item) => {
        item.muted = true;
      });
      controlBtn.classList.add('_muted');
    }
  });
}

class ValidEmail {
  valid = false;
  constructor(emailInput, submitBtn) {
    this.emailInput = document.querySelector(emailInput);
    this.submitBtn = document.querySelector(submitBtn);

    if (this.emailInput && this.submitBtn) {
      this.init();
    }
  }

  isValidEmail(value) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  }

  handleChange(event) {
    const value = event.target.value;
    if (this.isValidEmail(value)) {
      this.submitBtn.classList.remove('btn-disabled');
      this.emailInput.classList.remove('not-valid', 'error');
      this.valid = true;
    } else {
      this.submitBtn.classList.add('btn-disabled');
      this.valid = false;
    }
  }

  handleSubmit(event) {
    if(!this.valid) {
      event.preventDefault();
      this.emailInput.classList.add('not-valid', 'error');
    } 
  }

  init() {
    this.emailInput.addEventListener('input', this.handleChange.bind(this));
  }
}

new ValidEmail('._js-email-input', '.registration-submit-btn');


const modalBonusesOpen = () =>{
  const btnOpen = document.querySelector("._js-modal-bonuses-open");
  const modal = document.querySelector(".modal-bonuses-faq");
  
  if(btnOpen){
    btnOpen.addEventListener('click', (e)=>{
      modal.classList.add("active");
    });
  };
  if(modal){
    modal.addEventListener('click', (e)=>{
      modal.classList.remove("active");
    });
  };
}

try{
  modalBonusesOpen();
}catch(err){
  console.warn(err);
}