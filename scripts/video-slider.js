try {
    setTimeout(function(){prepareSwiper();}, 2000);
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

function prepareSwiper() {
    $.ajax({
        //type: "POST",
        url: "/v5/promo-videos/ajax-list",
        dataType: "json",
        success: function (data) {
            if (!data.products) return;
            //console.log(data.products);
            initSwiper(data.products);
            showVideoSlider();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log(jqXHR);
            //console.log(errorThrown);
        }
    });
}

function initSwiper(products) {

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
    let swiper = null;

    try {
        swiper = new Swiper('.video-swiper', {
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
    } catch (e) { console.log(e); return; }

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
        //console.log(prevVideo.dataset.productId);
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
    const controlBtn = document.querySelector('._js-control-btn');
    if (!controlBtn) return;

    controlBtn.addEventListener('click', () => {
        const video = document.querySelectorAll(className);
        if (video.length === 0)  return;
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

function showVideoSlider() {
    $('header.header').hide();
    $('#massageRunDiv').hide();
    $('footer.footer').hide();
    $('#videoSliderDiv').show();
    if (typeof document.querySelector('.video-swiper').swiper === "undefined") return;
    document.querySelector('.video-swiper').swiper.enable();
}

function hideVideoSlider() {
    document.querySelector('.video-swiper').swiper.disable();
    $('#videoSliderDiv').hide();
    $('header.header').show();
    $('#massageRunDiv').show();
    $('footer.footer').show();
}

$('#showVideoSliderBtn').click(function(){
    showVideoSlider();
});

$('#hideVideoSliderBtn').click(function(){
    hideVideoSlider();
});