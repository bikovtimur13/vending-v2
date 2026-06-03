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
        : '<b>Сеанс массажа завершен. Спасибо.</b><br> Вы можете оплатить следующий сеанс<br> восстановительного массажа.';
  
    // circle.style.strokeDashoffset = circumference * (1 - progress);

    if (safeTime <= 0) {
      const mTimerCard = document.querySelector('.m-timer-card');
      if (mTimerCard) {
          mTimerCard.classList.add('m-timer-card_finished');
      }

      const stopButton = document.querySelector('.bottom-fixed__stop');
      if (stopButton) {
          stopButton.innerHTML = `Выбрать время массажа`;
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

  render(time);
  toggleBottomTimer();

  let timer = setInterval(() => {
    render(time);

    if (time <= 0) {
      clearInterval(timer);
      return;
    }

    time--;
  }, 1000);

  window.addEventListener('scroll', toggleBottomTimer);
}

// Форма отзывов 
const STAR_SVG =
  '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.31l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5Z"/></svg>';

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