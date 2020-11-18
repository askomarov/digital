let navToggle = document.querySelector(".header__nav-toggle");
let navWrapper = document.querySelector(".header__nav-menu");


document.addEventListener('DOMContentLoaded', function () {
  navToggle.addEventListener("click", function () {
    console.log('нажал');
    if (navWrapper.classList.contains("active")) {
      this.setAttribute("aria-expanded", "false");
      this.setAttribute("aria-label", "menu");
      navWrapper.classList.remove("active");
    } else {
      navWrapper.classList.add("active");
      this.setAttribute("aria-label", "close menu");
      this.setAttribute("aria-expanded", "true");
    }
  });
});
