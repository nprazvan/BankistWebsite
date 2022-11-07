'use strict';
const nav = document.querySelector('.nav');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////

//button scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //SCROLLING
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,

    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  section1.scrollIntoView({ behavior: 'smooth' });
});
//PAGE NAVIGATION

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); //prevents default scrolling to anchor tag section #
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1.Add event listener to common parrent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); //prevents default scrolling to anchor tag section #

  //Matching strategy = the hardest part of event delegation
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed COmponent

// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB'))); LETS USE EVENT DELEGATION : The CLOSEST function to retieve the desired parent
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //GUARD CLAUSE
  if (!clicked) return;

  //REMOVE ACTIVE CLASSES
  tabs.forEach(t => t.classList.remove('.operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //ACTIVE TAB
  clicked.classList.add('operations__tab--active');

  //ACTIVATE CONTENT AREA
  console.log(clicked.dataset.tab);

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing an "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));
//.bind returns a new function

//IMPLEMENTING A STICKY NAVIGATION
//the sticky class makes it sticky
// const initialCoords = section1.getBoundingClientRect();
// // console.log(initialCoords);

// window.addEventListener('scroll', function (e) {
//   // console.log(window.scrollY); //indicates the scroll position

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// -> a better way = THE INTERSECTION OBSERVER API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// //whenever the current section is intersecting the viewpoint at 10%, this function will get called

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.inIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//REVEALING ELEMENTS ON SCROLL
//the animations come from the CSS

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, //will make it so that the section is 15% visible
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//LAZY LOADING IMAGES -> great for performance!!!! - good for slow internet connection
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '+200px', //so that the user doesnt catch that we are lazy loading the images
});

imgTargets.forEach(img => imgObserver.observe(img));

//BUILDING A SLIDER COMPONENT
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.5) translateX(-800px)';
  // slider.style.overflow = 'visible';

  //FUNCTIONS
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //EVENT HANDLERS
  btnRight.addEventListener('click', nextSlide);

  //Previous slide
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    e.key === 'ArrowRight' && nextSlide(); // reminder: this is short-circuiting!!!!
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; //because it is named data-slide
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

//Go to top of the page
logo.addEventListener('click', function (e) {
  // location.reload();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

slider();

// HOW THE DOM REALLY WORKS

// JS <- DOM -> HTML

//Every single note in the DOM tree is a NODE. Each NODE is represented by an OBJECT
/*
// 4 types of NODES :
1) Element type <p> Paragraph <p> 
HTMLElement:
-HTMLButtonElement
-HTMLDivElement

2) Text type <p> Paragraph <p>

3) Comment type <!--Comment-->

4) Document type
-querrySelector()
-createElement()
-getElementById()
(not a dom tree)

!!!!EventTarget = the parent of all nodes = can use addEventListener()/removeEventListener() on all nodes and windows
*/

//SELECTING, CREATING AND DELETING - COME BACK IN THE FUTURE

// //selecting a document
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSelections = document.querySelectorAll('.section');

// console.log(allSelections); // returns a node list

// document.getElementById('#section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons); //returns an HTMLCollection = updates automatically

// console.log(document.getElementsByClassName('btn')); //returns a HTMLCollection

// // Creating and inserting elements
// // .insertAdjacentHTML = he recommends it the best

// const message = document.createElement('div'); //returns a DOM element
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookies for improved functionality and analytics.';'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message); //first child
// header.append(message); //last child ->it cannot be in multiple places at the same time

// // header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message)

// //DELETE ELEMENTS
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   }); //new feature- very cool

// //STYLES, ATTRIBUTES AND CLASSES

// //STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height);
// console.log(message.style.backgroundColor); //THE EASIER WAY

// console.log(getComputedStyle(message)); //contains all of the properties
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');
// //document.documentElement = the ROOT

// //ATTRIBUTES
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);

// console.log(logo.designer); //Non-standard =it doesnt read because it's not a standard property expected from images!!!!!!!!!!
// console.log(logo.getAttribute('designer'));

// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';
// logo.setAttribute('company', 'Bankist');

// console.log(logo.getAttribute('src'));
// console.log(logo.src);

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //DATA ATTRIBUTES
// console.log(logo.dataset.versionNumber);

// //CLASSES

// //these allow us to modify classes without interfering with their names
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c'); //not includes

// //DONT USE THIS = it will override all classes
// logo.className = 'jonas';

//IMPLEMENTING SMOOTH SCROLLING
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

//   console.log(e.target.getBoundingClientRect());

//   console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );
//   //SCROLLING
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );
//   window.scrollTo({
//     left: s1coords.left + window.pageXOffset,

//     top: s1coords.top + window.pageYOffset,
//     behavior: 'smooth',
//   });

//   section1.scrollIntoView({ behavior: 'smooth' });
// });
// y= the distance between the view port and the start of the page

//TYPES OF EVENTS AND EVENT HANDLERS
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great!You are reading the heading:D!');
// };

// h1.addEventListener('mouseenter', alertH1); //THE NEW WAY

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great!You are reading the heading:D!');
// }; //THE OLD WAY

//EVENT PROPAGATION

//random color = rgb(255,255,255)
//rgb(255,255,255);
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   //STOPPING THE EVENT PROPAGATION
//   // e.stopPropagation(); //in practice it's not recommended to stop the propagation; not a good idea in general, only for fixing bugs
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Container', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   }
//   // true
// );
//the true makes it the first one to happen, and so it lists in the console aa the first which followed by the other 2

//DOM TRAVERSING = walking through the DOM

// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); //shows the different nodes we have
// console.log(h1.children); //shows the 3 elements that are inside the h1 (parent element)
// h1.firstElementChild.style.color = 'white'; //only the first element of all the 'children' changes its color
// h1.firstElementChild.style.color = 'orangered';

// //Going upwards = selecting parents
// console.log(h1.parentNode); //shows its parent node
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var( --gradient-secondary)';

// h1.closest('h1').style.background = 'var( --gradient-primary)';
// //closest = the opposite of querySelector
// //querySelector finds CHILDREN/ closest finds PARENTS

// //Going sideways: SIBLINGS
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children); //go to parent element of h1 and view all the children/siblings
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

//BUILDING A TABBED COMPONENT
//IN OUR CASE THE TABBED COMPONENT IS CALLED OPERATIONS

//LIFECYCLE DOM EVENTS
//1.Dom content loaded = as soon as the html is parsed
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e); //to ask users if they want to leave the page
//   e.returnValue = ''; //LEGACY REASONS
// });

//EFFICIENT SCRIPT LOADING: defer and async
