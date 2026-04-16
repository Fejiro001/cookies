"use strict";

const COOKIE_MAX_AGE = 15;
const cookieDialog = document.getElementById("cookies-dialog");
const settingsDialog = document.getElementById("settings-dialog");
const manageCookiesBtn = document.getElementById("manage-cookies");
const rejectCookiesBtn = document.getElementById("reject-cookies");
const acceptCookiesBtn = document.querySelectorAll("#accept-cookies");
const settingsForm = document.getElementById("settings-form");
const checkBoxes = document.querySelectorAll("input[type='checkbox']");

function setCookie(name, value, maxAge) {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }

  document.cookie = cookieString;
}

function getCookies() {
  const cookies = {};
  if (document.cookie) {
    const cookiePair = document.cookie.split(";");

    cookiePair.forEach((cookie) => {
      let [key, value] = cookie.split("=");
      key = decodeURIComponent(key).trim();
      value = decodeURIComponent(value).trim();
      cookies[key] = value;
    });
  }
  return cookies;
}

function getOperatingSystem() {
  let osData = navigator.userAgent.toLowerCase();

  if (osData.includes("win")) return "Windows";
  if (osData.includes("mac")) return "MacOS";
  if (osData.includes("iphone") || osData.includes("ipad")) return "iOS";
  if (osData.includes("android")) return "Android";
  if (osData.includes("linux")) return "Linux";

  return "Other OS";
}

function getBrowserName() {
  let browserData = navigator.userAgent.toLowerCase();

  if (browserData.includes("edg")) return "Microsoft Edge";
  if (browserData.includes("opr") || browserData.includes("opera")) return "Opera";
  if (browserData.includes("firefox")) return "Firefox";
  if (browserData.includes("chrome")) return "Chrome";
  if (browserData.includes("safari")) return "Safari";

  return "Other Browser";
}

function getScreenDimensions() {
  const screenHeight = window.screen.height;
  const screenWidth = window.screen.width;

  return [screenHeight, screenWidth];
}

if (navigator.cookieEnabled) {
  const cookies = getCookies();

  if (Object.keys(cookies).length === 0) {
    setTimeout(() => {
      cookieDialog.showModal();
    }, 2500);
  }
}

manageCookiesBtn.addEventListener("click", () => {
  cookieDialog.close();
  settingsDialog.showModal();
});

function getAllInfo() {
  const [screenHeight, screenWidth] = getScreenDimensions();
  const browserName = getBrowserName();
  const osName = getOperatingSystem();

  return [screenHeight, screenWidth, browserName, osName];
}

function acceptAllCookies() {
  checkBoxes.forEach((checkbox) => {
    checkbox.checked = true;
  });

  const [screenHeight, screenWidth, browserName, osName] = getAllInfo();

  setCookie("Browser", browserName, COOKIE_MAX_AGE);
  setCookie("Operating System", osName, COOKIE_MAX_AGE);
  setCookie("Screen Height", screenHeight, COOKIE_MAX_AGE);
  setCookie("Screen Width", screenWidth, COOKIE_MAX_AGE);

  if (cookieDialog.open) cookieDialog.close();

  setTimeout(() => {
    if (settingsDialog.open) settingsDialog.close();
  }, 1000);
}

acceptCookiesBtn.forEach((button) => {
  button.addEventListener("click", () => {
    acceptAllCookies();
  });
});

const settings = ["Browser", "Operating System", "Screen Height", "Screen Width"];

function setRejectedCookie(setting) {
  setCookie(setting, "rejected", COOKIE_MAX_AGE);
}

function rejectAllCookies() {
  settings.forEach((setting) => {
    setRejectedCookie(setting);
  });

  checkBoxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  setTimeout(() => {
    if (settingsDialog.open) settingsDialog.close();
  }, 1000);
}

rejectCookiesBtn.addEventListener("click", () => {
  rejectAllCookies();
});

function savePreferences(e) {
  const data = new FormData(e.target);
  const entries = Object.fromEntries(data.entries());
  const { browser, os, height, width } = entries;

  const [screenHeight, screenWidth, browserName, osName] = getAllInfo();

  "browser" in entries ? setCookie("Browser", browserName, COOKIE_MAX_AGE) : setRejectedCookie("Browser");
  "os" in entries ? setCookie("Operating System", osName, COOKIE_MAX_AGE) : setRejectedCookie("Operating System");
  "height" in entries ? setCookie("Screen Height", screenHeight, COOKIE_MAX_AGE) : setRejectedCookie("Screen Height");
  "width" in entries ? setCookie("Screen Width", screenWidth, COOKIE_MAX_AGE) : setRejectedCookie("Screen Width");

  if (settingsDialog.open) settingsDialog.close();
}

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  savePreferences(e);
});
