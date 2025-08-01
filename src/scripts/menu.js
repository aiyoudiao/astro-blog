/*
 * File: menu.js                                                               *
 * Project: astro-blog                                                         *
 * Created Date: 2025-07-31 16:44:44                                           *
 * Author: aiyoudiao                                                           *
 * -----                                                                       *
 * Last Modified:  2025-07-31 16:44:44                                         *
 * Modified By: aiyoudiao                                                      *
 * -----                                                                       *
 * Copyright (c) 2025 哎哟迪奥(码二)                                                 *
 * --------------------------------------------------------------------------- *
 */
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", () => {
  hamburger.style.backgroundColor = "red";
});

document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
  })
);
