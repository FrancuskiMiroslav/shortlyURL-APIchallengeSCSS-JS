$(document).ready(function() {
  console.log("main.js file loaded");
});

window.onload = function() {
  const btnClick = document.getElementById("click-me");
  btnClick.addEventListener(
    "click",
    event => {
      if (!event) return;
      alert("You clicked me!");
    },
    false
  );

  const menuBtn = document.getElementById("menu-btn");
  const navList = document.getElementById("nav-list");
  const topNav = document.querySelector(".top-nav");

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    navList.classList.toggle("open");
  });

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    console.log(scrolled);
    if (scrolled > 0) {
      topNav.classList.add("top-nav--sticky");
    } else {
      topNav.classList.remove("top-nav--sticky");
    }
  });
};
