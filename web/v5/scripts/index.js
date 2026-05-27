const mainTimer = document.getElementById('mainTimer');
const bottomTimer = document.getElementById('bottomTimer');
const timerText = document.querySelector('.timer-circle__text');
const circle = document.querySelector('.progress-ring__circle');
const topTimerBlock = document.getElementById('topTimerBlock');
const bottomPanel = document.getElementById('bottomPanel');

if (mainTimer && bottomTimer && timerText && circle && topTimerBlock && bottomPanel) {
  const FULL_TIME = 10 * 60;
  const radius = 95;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;

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

    timerText.innerHTML =
      safeTime > 0
        ? 'До окончания<br>массажа осталось'
        : 'Массаж<br>окончен';

    circle.style.strokeDashoffset = circumference * (1 - progress);
  };

  const toggleBottomTimer = () => {
    bottomPanel.classList.toggle(
      '_timer-visible',
      topTimerBlock.getBoundingClientRect().bottom <= 0
    );
  };

  document.querySelectorAll('.vendi-form__button').forEach(button => {
    button.addEventListener('click', event => {
      const form = button.closest('.vendi-form');
      const giftText = form?.querySelector('.vendi-form__gift-text');

      if (!giftText) return;

      event.preventDefault();
      giftText.classList.add('_visible');
    });
  });

  let time = parseTime(mainTimer.textContent);

  render(time);
  toggleBottomTimer();

  const timer = setInterval(() => {
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