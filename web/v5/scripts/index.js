const mainTimer = document.getElementById('mainTimer');
const bottomTimer = document.getElementById('bottomTimer');
// const timerText = document.querySelector('.timer-circle__text');
const timerText = document.querySelector('.m-timer-card__text');
// const circle = document.querySelector('.progress-ring__circle');
const topTimerBlock = document.getElementById('topTimerBlock');
const bottomPanel = document.getElementById('bottomPanel');
const stopButton = document.querySelector('.bottom-fixed__stop');

if (mainTimer && bottomTimer && timerText /*&& circle*/ && topTimerBlock && bottomPanel) {
  const FULL_TIME = 10 * 60;
  const radius = 95;
  const circumference = 2 * Math.PI * radius;

  // circle.style.strokeDasharray = circumference;

  const parseTime = time => {
    const [minutes, seconds] = time.trim().split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const formatTime = seconds =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const render = time => {
    const safeTime = Math.max(time, 0);
    const progress = safeTime / FULL_TIME;
  
    mainTimer.textContent =
    bottomTimer.textContent = formatTime(safeTime);
  
    bottomPanel.classList.toggle('_massage-ended', safeTime <= 0);
  
    timerText.innerHTML =
      safeTime > 0
        ? 'До окончания<br>массажа осталось'
        : '<b>Сеанс массажа завершен. Спасибо!</b><br>Вы можете оплатить следующий<br>сеанс восстановительного массажа.';
  
    // circle.style.strokeDashoffset = circumference * (1 - progress);

    if (safeTime <= 0) {
      const mTimerCard = document.querySelector('.m-timer-card');
      if (mTimerCard) {
          mTimerCard.classList.add('m-timer-card_finished');
      }

      const stopButton = document.querySelector('.bottom-fixed__stop');
      if (stopButton) {
          stopButton.innerHTML = `<div class="bottom-fixed__description-wrapper">
      <img class="bottom-fixed__icon" src="../../web/v5/images/time-icon.webp" alt="Yamaguchi">
      <span>Выбрать время массажа</span>
    </div>`;
          stopButton.classList.add('bottom-fixed__stop_choose-time');
          // todo: to set link later
          // stopButton.setAttribute('href', 'https://www.example.com');
      }
    }
  };

  const toggleBottomTimer = () => {
    bottomPanel.classList.toggle(
      '_timer-visible',
      topTimerBlock.getBoundingClientRect().bottom <= 0
    );
  };

  document.querySelectorAll('.vendi-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
  
      const button = form.querySelector('.vendi-form__button');
      const vbForm = form.closest('.vb-form');
  
      if (button) {
        button.style.display = 'none';
      }
  
      if (vbForm) {
        const giftText = vbForm.querySelector('.vendi-form__gift-text');
  
        if (giftText) {
          giftText.classList.add('_visible');
        }
  
        return;
      }
  
      const successText = form.parentElement.querySelector('.vendi-form__success');
  
      if (successText) {
        successText.classList.add('_visible');
      }
    });
  });

  let time = parseTime(mainTimer.textContent);

  if (stopButton) {
    stopButton.addEventListener('click', event => {
      event.preventDefault();
  
      time = 0;
  
      render(time);
  
      clearInterval(timer);
  
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  const setMTimerCardToConnectingState = () => {
    timerText.innerHTML = 'Кресло подключается,<br> ожидайте';
    topTimerBlock.classList.add('m-timer-card_connecting');
  }

  const unsetMTimerCardFromConnectingState = () => {
    topTimerBlock.classList.remove('m-timer-card_connecting');
  }

  setMTimerCardToConnectingState();


  const checkIsConnecting = () => {
    if (!window._startTime) {
      window._startTime = Date.now();
    }
    const timePassed = Date.now() - window._startTime;
    console.log(`Date.now() - window._startTime: ${timePassed} | timePassed < 2000: ${timePassed < 2000}`)

    return timePassed < 2000;
  }

  const waitForConnection = (onConnectedCallback)  => {
    const check = () => {
      const isConnecting = checkIsConnecting();
      if (isConnecting) {
        setTimeout(check, 200);
      }
      if (!isConnecting) {
        onConnectedCallback();
      }
    }

    check();
  }

  waitForConnection(() => {
      unsetMTimerCardFromConnectingState();

      render(time);

      let timer = setInterval(() => {
        render(time);

        if (time <= 0) {
          clearInterval(timer);
          return;
        }

        time--;
      }, 1000);
  })

  toggleBottomTimer();
  window.addEventListener('scroll', toggleBottomTimer);
}

// Форма отзывов 
// const STAR_SVG =
//   '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.31l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5Z"/></svg>';
const STAR_SVG = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<g clip-path="url(#clip0_2157_1419)">\n' +
    '<path d="M13.543 2.25293C13.7191 1.85768 14.2809 1.85769 14.457 2.25293L17.1758 8.35352C17.3938 8.84254 17.8562 9.17816 18.3887 9.23438L25.0312 9.93555C25.4615 9.98096 25.6347 10.514 25.3135 10.8037L20.3516 15.2754C19.9538 15.6338 19.7776 16.1774 19.8887 16.7012L21.2744 23.2354C21.3642 23.6587 20.91 23.9887 20.5352 23.7725L14.749 20.4346C14.2855 20.1675 13.7145 20.1675 13.251 20.4346L7.46484 23.7725C7.08999 23.9887 6.6358 23.6587 6.72559 23.2354L8.11133 16.7012C8.22239 16.1774 8.04617 15.6338 7.64844 15.2754L2.68652 10.8037C2.36535 10.514 2.5385 9.98096 2.96875 9.93555L9.61133 9.23438C10.1438 9.17816 10.6062 8.84254 10.8242 8.35352L13.543 2.25293Z" stroke="#FFDD2D"/>\n' +
    '</g>\n' +
    '<defs>\n' +
    '<clipPath id="clip0_2157_1419">\n' +
    '<rect width="28" height="28" fill="white"/>\n' +
    '</clipPath>\n' +
    '</defs>\n' +
    '</svg>\n'

const stars = document.querySelectorAll('.review-star');
const reasonsBox = document.getElementById('reviewReasons');
const reasons = document.querySelectorAll('.review-reason');

const ratingInput = document.getElementById('ratingInput');
const reasonsInput = document.getElementById('reasonsInput');

const reviewTextarea = document.querySelector('.review-textarea');

let rating = 0;
let selectedReasons = [];

if (
  stars.length &&
  reasonsBox &&
  ratingInput &&
  reasonsInput
) {
  stars.forEach(star => {
    star.innerHTML = STAR_SVG;

    star.addEventListener('click', () => {
      rating = Number(star.dataset.rating);

      ratingInput.value = rating;

      stars.forEach(item => {
        item.classList.toggle(
          '_active',
          Number(item.dataset.rating) <= rating
        );
      });

      reasonsBox.classList.toggle(
        '_visible',
        rating <= 3
      );

      if (rating > 3) {
        selectedReasons = [];

        reasons.forEach(item =>
          item.classList.remove('_active')
        );

        reasonsInput.value = '';

        if (reviewTextarea) {
          reviewTextarea.value = '';
        }
      }
    });
  });

  reasons.forEach(reason => {
    reason.addEventListener('click', () => {
      const value = reason.dataset.reason;

      reason.classList.toggle('_active');

      selectedReasons = reason.classList.contains('_active')
        ? [...selectedReasons, value]
        : selectedReasons.filter(item => item !== value);

      reasonsInput.value =
        selectedReasons.join('|');

      if (reviewTextarea) {
        const currentText = reviewTextarea.value
          .split('\n')
          .filter(line => !line.startsWith('• '))
          .join('\n')
          .trim();

        const reasonsText = selectedReasons.length
          ? `${selectedReasons
              .map(item => `• ${item}`)
              .join('\n')}\n\n`
          : '';

        reviewTextarea.value =
          reasonsText + currentText;
      }
    });
  });
}