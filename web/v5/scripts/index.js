const FULL_TIME = 10 * 60;

const mainTimer = document.getElementById('mainTimer');
const bottomTimer = document.getElementById('bottomTimer');
const timerText = document.querySelector('.timer-circle__text');
const circle = document.querySelector('.progress-ring__circle');
const topTimerBlock = document.getElementById('topTimerBlock');
const bottomPanel = document.getElementById('bottomPanel');

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