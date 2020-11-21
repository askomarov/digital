let navToggle = document.querySelector(".header__nav-toggle");
let navWrapper = document.querySelector(".header__nav-menu");

let openmenu = function () {
  if (navWrapper.classList.contains("active")) {
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("aria-label", "menu");
    navWrapper.classList.remove("active");
    document.body.classList.remove("lock");
  } else {
    navWrapper.classList.add("active");
    document.body.classList.add("lock");
    this.setAttribute("aria-label", "close menu");
    this.setAttribute("aria-expanded", "true");
  };
};
document.addEventListener('DOMContentLoaded', function () {
  navToggle.addEventListener("click", openmenu);
});


let talkModal = document.querySelector(".contact-modal");
if (talkModal != null) {
  let talkModalBtnShow = document.querySelector(".interesed__btn");
  let contactForm = talkModal.querySelector(".contact-form");
  let loginName = talkModal.querySelector("#name-field");
  let loginEmail = talkModal.querySelector("#mail-field");
  let feedbackModal = document.querySelector(".feedback-done");

  let showModal = function (e) {
    e.preventDefault();
    talkModal.classList.add("contact-modal--open");
  };
  let closeModal = function () {
    if (talkModal.classList.contains("contact-modal--open")) {
      talkModal.classList.remove("contact-modal--open");
      contactForm.classList.remove("contact-form--error");
    };
  };

  let deleteFeedbackDone = function () {
    feedbackModal.classList.remove("feedback-done--open");
  };

  let formValidation = function () {
    if (!loginName.value || !loginEmail.value) {
      contactForm.classList.remove("contact-form--error");
      contactForm.offsetWidth = contactForm.offsetWidth;
      contactForm.classList.add("contact-form--error");
    } else {
      talkModal.classList.remove("contact-modal--open");
      feedbackModal.classList.add("feedback-done--open");
      setTimeout(deleteFeedbackDone, 2000);
    };
  };

  document.addEventListener('DOMContentLoaded', function () {
    talkModalBtnShow.addEventListener("click", showModal);
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    formValidation();
  });

  window.addEventListener("keydown", function (e) {
    if (e.keyCode === 27) {
      e.preventDefault();
      closeModal();
    };
  });
}
