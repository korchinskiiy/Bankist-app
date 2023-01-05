'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(x => x.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///Scroll btn

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });

  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   top: s1coords.top + window.scrollY,
  //   left: s1coords.left,
  //   behavior: 'smooth',
  // });
});

//////////////////////////////////////////////////
//PAGE NAVIGATION

// const links = document.querySelectorAll('.nav__link');
// links.forEach(x => {
//   x.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// console.log(links);

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Active tab
  tabs.forEach(x => x.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Active content
  tabsContent.forEach(x => x.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation

const nav = document.querySelector('.nav');

const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(x => {
      if (link !== x) {
        x.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};

nav.addEventListener('mouseover', handleOver.bind(0.5));

nav.addEventListener('mouseout', handleOver.bind(1));

//Sticky navigation
// const s1coords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   if (this.scrollY > s1coords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = Number.parseInt(nav.getBoundingClientRect().height);

const obsFunc = function (entries) {
  //Destructuring entries array
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const obsOpt = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const observer = new IntersectionObserver(obsFunc, obsOpt);
observer.observe(header);

//Animation effect

const sectionsArr = document.querySelectorAll('.section');
sectionsArr.forEach(x => x.classList.add('section--hidden'));

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const revealOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);

sectionsArr.forEach(x => sectionObserver.observe(x));

//Lazy loading images

const lazyImg = document.querySelectorAll('img[data-src]');

const lazyFunc = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replacing img
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });

  //Stop observing
  observer.unobserve(entry.target);
};

const lazyOpt = {
  root: null,
  threshold: 0.05,
};

const lazyObserver = new IntersectionObserver(lazyFunc, lazyOpt);

lazyImg.forEach(x => lazyObserver.observe(x));

//SLIDER

const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const dotContainer = document.querySelector('.dots');

  const init = function (x, y) {
    translateX(x);
    activateDot(y);
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class = "dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  createDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(x => x.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const translateX = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  init(0, 0);

  //0%, 100%, 200%, 300%

  //Changing slides
  const nextSlide = function () {
    curSlide === slides.length - 1 ? (curSlide = 0) : curSlide++;

    init(curSlide, curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) curSlide = slides.length;
    curSlide--;

    init(curSlide, curSlide);
  };

  //Event handlers

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === `ArrowRight`) nextSlide();
    else if (e.key === `ArrowLeft`) previousSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const dotId = e.target.dataset.slide;
      init(dotId, dotId);
    }
  });
};

sliders();

//-100%, 0%, -100%, -200%

// const logo = document.querySelector('.nav__logo');

// const logoFunc = function (entries) {
//   const [entry] = entries;
//   console.log(entry);
//   if (!entry.isIntersecting) {
//     logo.classList.add('sticky');
//   }
// };

// const logoOpt = {
//   root: null,
//   threshold: 0,
// };

// const logoObserver = new IntersectionObserver(logoFunc, logoOpt);
// logoObserver.observe(logo);

////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
////////LECTURES

//Selecting elements

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const buttons = document.getElementsByTagName('button');
// console.log(buttons);

// console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements
// .insertAdjacentHTML()

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class= "btn btn--close-coockie">Got it!</button>';

// header.prepend(message);
// header.append(message.cloneNode(false));
// header.append(message);

// header.before(message);
// header.after(message);

//Delete elements
// document
//   .querySelector('.btn--close-coockie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// const message1 = document.createElement('div');
// message1.classList.add('cookie-message');
// message1.textContent =
//   'We use cookies for improved functionality and analytics';
// message1.innerHTML =
//   'We use cookies to better display our website <button class="btn btn--close-cookie">Got it</button>';

// document.getElementById('section--3').append(message1);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', () => message1.remove());

//STYLE. ATTRIBUTES. CLASSES.
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class= "btn btn--close-coockie">Got it!</button>';

// header.append(message);

// //style

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height);
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// const height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 50 + 'px';
// message.style.height = height;

// document.documentElement.style.setProperty('--color-primary', 'orangered');
// document.querySelector('h1').style.setProperty('color', 'yellow');

// //Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// //Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');
// console.log(logo.getAttribute('src'));

// const twitter = document.querySelector('.twitter-link');
// console.log(twitter.href);
// console.log(twitter.getAttribute('href'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data attributes
// console.log(logo.dataset.version);

// //Classes

// logo.classList.add('c', 'j');
// logo.classList.remove('j');
// logo.classList.toggle('a');
// console.log(logo.classList.contains('c')); //in arrays - includes
// console.log(logo.className);

// const testing = document.createElement('a');
// testing.setAttribute('href', 'https://www.google.com');
// testing.innerHTML = 'Hi';

// console.log(testing.getAttribute('href'));
// document.querySelector('.header').append(testing);

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great!');

//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

//rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener(
//   'click',
//   function (e) {
//     alert('Clicked link');

//     //Stop propagation
//     // e.stopPropagation();
//   },
//   true
// );

// document.querySelector('.nav__links').addEventListener(
//   'click',
//   function (e) {
//     alert('Container');
//   },
//   true
// );

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     alert('NAV');
//   },
//   true
// );

// const h1 = document.querySelector('h1');

//Downwards / selecting child elements
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log((h1.firstElementChild.style.color = 'red'));
// console.log((h1.lastElementChild.style.color = 'yellow'));

// //Upwards / selecting parent elements
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('h1').style.background = 'var(--gradient-secondary)';

// //Sideways
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(x => {
//   if (x !== h1) {
//     x.style.transform = 'scale(1.9)';
//   }
// });

// const header = document.querySelector('header');

// console.log(header.firstElementChild.children);

// [...header.firstElementChild.children].forEach(
//   x => (x.style.transform = 'scale(1.5)')
// );

// console.log(header.nextElementSibling.children);

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parssed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('hi', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
