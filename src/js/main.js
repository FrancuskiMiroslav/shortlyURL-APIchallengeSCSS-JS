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

  // Nav menu toggle button

  const menuBtn = document.getElementById("menu-btn");
  const navList = document.getElementById("nav-list");
  const topNav = document.querySelector(".top-nav");

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    navList.classList.toggle("open");
  });

  // Sticky menu

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled > 0) {
      topNav.classList.add("top-nav--sticky");
    } else {
      topNav.classList.remove("top-nav--sticky");
    }
  });

  // validate URL

  let urlInput = document.getElementById("url-input");
  const error = document.getElementById("error-msg");
  const container = document.getElementById("short-links");

  // check inputField value is a URL using REGEX
  function URLIsValid(urlInput) {
    return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(urlInput);
  }

  function Validate() {
    error.innerHTML = ""; // clear any error messages

    if (URLIsValid(urlInput.value)) {
      error.innerHTML = "";
      error.style.display = "none";
      urlInput.classList.remove("error");
      return true;
      // if URL is valid URL, clear error states and return true
    } else {
      error.innerHTML = "Please add a link";
      error.style.display = "block";
      urlInput.classList.add("error");
      return false;
      // if URL is not valid, add error states / add error message and return false
    }
    return false;
  }

  function shortenLink(event) {
    event.preventDefault();
    Validate(); // check input field contains a URL

    if (Validate()) {
      // if validation is true post to api
      fetch("https://rel.ink/api/links/", {
        method: "POST",
        body: JSON.stringify({
          url: urlInput.value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          createShortLink(urlInput.value, data.hashid);
        })
        .catch(err => console.log(err));
    }
  }

  // create short link
  function createShortLink(link, hashid) {
    var shortLink = "https://rel.ink/" + hashid;
    console.log(link);
    console.log(shortLink);

    // prepare data for local storage
    let data = {
      link, // original link
      shortLink // shortened link
    };

    store(data);
  }

  // store new items
  function store(item) {
    let items = get(); // look for any previously stored links
    items.push(item); // add new links to existing links
    console.log(items);
    localStorage.setItem("items", JSON.stringify(items)); // locally store updated items array
    getLinks(); // update visible short links
  }

  // Look for Items in local storage
  function get() {
    let items;
    // check for previously stored items

    if (localStorage.getItem("items") == null) {
      items = [];
      // if no items found in local storage create array
    } else {
      items = JSON.parse(localStorage.getItem("items"));
      // if items found in local storage retrieve array
    }
    return items;
  }

  // Display Shortened Links

  function showShortLinks(link, shortLink) {
    container.insertAdjacentHTML(
      "afterbegin",
      `
  <div class="item">
  <a href="${link}" class="item__link">${link}</a>
  <div>
  <a href="${shortLink}" id="shortLink" class="item__shortlink">${shortLink}</a>
  <button id="copy" class="btn copy">Copy</button>
  </div>
  
  </div>
  `
    );
  }

  function getLinks() {
    // clear current list of links
    container.innerHTML = "";
    // get items from local storage
    let items = get();
    // for each item run function showShortLinks
    items.forEach(i => {
      console.log(i);
      showShortLinks(i.link, i.shortLink);

      setCopyBtn();
    });
  }

  function setCopyBtn() {
    let copyBtn = document.querySelectorAll("#copy");
    // add event listener on click to all generated copy buttons
    copyBtn.forEach(e => e.addEventListener("click", copyLink));
  }

  function copyLink(e) {
    // copy link

    let textarea = document.createElement("textarea"); // create textarea element
    textarea.value = e.target.previousSibling.previousSibling.innerText; // set value of text area
    document.body.appendChild(textarea); // append textarea to html document

    textarea.select(); // select textarea contents
    document.execCommand("copy"); // copy only works as part of an event action i.e click
    document.body.removeChild(textarea); // remove textarea from html document

    // update button styles

    e.target.innerHTML = "Copied!";
    e.target.classList.add("copied-btn");
  }

  document.getElementById("addUrl").addEventListener("submit", shortenLink);

  getLinks(); // show stored short links on page load
};
