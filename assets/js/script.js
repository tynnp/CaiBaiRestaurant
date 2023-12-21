'use strict';

// preload 
const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function() {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});


// add event listener
const addEventOnElements = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}


// NAVBAR----------------------------------------------------------------------------------------
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);


// HEADER & TOP BTN----------------------------------------------------------------------------------------
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
let lastScrollPos = 0;

const hideHeader = function () {
    const isScrollBottom = lastScrollPos < window.scrollY;
    if (isScrollBottom) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }
    lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
    if (window.scrollY >= 50) {
        header.classList.add("active");
        backTopBtn.classList.add("active");
        hideHeader();
    } else {
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
    }
});

// HERO SLIDER----------------------------------------------------------------------------------------
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
    lastActiveSliderItem.classList.remove("active");
    heroSliderItems[currentSlidePos].classList.add("active");
    lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
    if (currentSlidePos >= heroSliderItems.length - 1) {
        currentSlidePos = 0;
    } else {
        currentSlidePos++;
    }
    updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);
const slidePrev = function () {
    if (currentSlidePos <= 0) {
        currentSlidePos = heroSliderItems.length - 1;
    } else {
        currentSlidePos--;
    }
    updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

// AUTO SLIDE----------------------------------------------------------------------------------------
let autoSlideInterval;
const autoSlide = function() {
    autoSlideInterval = setInterval(function() {
        slideNext();
    }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function() {
    clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);


// PARALLAX EFFECT----------------------------------------------------------------------------------------
const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;
window.addEventListener("mousemove", function (event) {
    x = (event.clientX / window.innerWidth * 10) - 5;
    y = (event.clientY / window.innerHeight * 10) - 5;

    x = x - (x * 2);
    y = y - (y * 2);

    for (let i = 0, len = parallaxItems.length; i < len; i++) {
        x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
        y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
        parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    }
});

// SLIDE SHOW----------------------------------------------------------------------------------------
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex - 1].style.display = "block";
}


// GAME------------------------------------------------------------------------------------------------------------------------
const images = ['🍎', '🍌', '🍒', '🍓', '🍊', '🍇', '🍍', '🥭'];
let shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timerSeconds = 30;
let timerInterval;
let gameStarted = false;

function createCard(image, index) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.index = index;

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');
  cardInner.innerText = image;

  card.appendChild(cardInner);
  card.addEventListener('click', flipCard);
  return card;
}

function flipCard() {
  if (!gameStarted) return;

  const card = this;

  if (!card.classList.contains('flipped') && flippedCards.length < 2) {
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.querySelector('.card-inner').innerText === card2.querySelector('.card-inner').innerText;

  if (isMatch) {
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    matchedPairs++;

    score += 10;
    document.getElementById('score').innerText = `Điểm: ${score}`;

    if (matchedPairs === images.length) {
      endGame(true); // Người chơi chiến thắng
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    score = Math.max(0, score - 5);
    document.getElementById('score').innerText = `Điểm: ${score}`;
  }

  flippedCards = [];
}

function updateTimer() {
  if (timerSeconds > 0) {
    timerSeconds--;
    document.getElementById('timer').innerText = `Thời gian còn lại: ${timerSeconds}s`;
  } else {
    endGame(false); // Người chơi thua
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('start-btn').disabled = true;

    const cards = document.querySelectorAll('.card');

    // Lật tất cả các thẻ cùng một lúc
    cards.forEach((card) => {
      card.classList.add('flipped');
    });

    // Sau 0.75 giây, úp ngược lại tất cả các thẻ
    setTimeout(() => {
      cards.forEach((card) => {
        card.classList.remove('flipped');
      });

    }, 750); 
  }
}

function endGame(isWinner) {
  clearInterval(timerInterval);

  const overlayGame = document.getElementById('overlayGame');
  const message = document.getElementById('message');
  const resetBtn = document.getElementById('reset-btn');

  if (isWinner) {
      const discountPercentage = Math.min(100, score);
      message.innerText = `Chúc mừng bạn đã được ưu đãi ${discountPercentage}% từ trò chơi, đặt bàn ngay!`;
  } else {
      message.innerText = 'Tiếc quá, bạn không nhận được ưu đãi từ trò chơi rồi!';
  }

  overlayGame.style.display = 'flex';

  resetBtn.addEventListener('click', function () {
      overlayGame.style.display = 'none';
      resetGame();
  });
}

function resetGame() {
  shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
  flippedCards = [];
  matchedPairs = 0;
  score = 0;
  timerSeconds = 30;
  gameStarted = false;

  document.getElementById('game-board').innerHTML = '';
  document.getElementById('score').innerText = `Điểm: ${score}`;
  document.getElementById('timer').innerText = `Thời gian còn lại: ${timerSeconds}s`;
  document.getElementById('start-btn').disabled = false;

  createGameBoard();
}

function createGameBoard() {
  const gameBoard = document.getElementById('game-board');
  for (let i = 0; i < shuffledImages.length; i++) {
    const card = createCard(shuffledImages[i], i);
    gameBoard.appendChild(card);
  }
}

// Tạo bảng trò chơi khi trang được tải lần đầu
createGameBoard();
