"use strict";

const COOKIE_MAX_AGE = 15;
const cookieDialog = document.getElementById("cookies-dialog");
const settingsDialog = document.getElementById("settings-dialog");
const manageCookiesBtn = document.getElementById("manage-cookies");
const rejectCookiesBtn = document.getElementById("reject-cookies");
const settingsForm = document.getElementById("settings-form");
const acceptCookiesBtn = document.querySelectorAll(".accept-cookies");
const checkBoxes = document.querySelectorAll("input[type='checkbox']");

const deviceData = navigator.userAgent.toLowerCase();

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
  if (deviceData.includes("win")) return "Windows";
  if (deviceData.includes("mac")) return "MacOS";
  if (deviceData.includes("iphone") || deviceData.includes("ipad")) return "iOS";
  if (deviceData.includes("android")) return "Android";
  if (deviceData.includes("linux")) return "Linux";

  return "Other OS";
}

function getBrowserName() {
  if (deviceData.includes("edg")) return "Microsoft Edge";
  if (deviceData.includes("opr") || deviceData.includes("opera")) return "Opera";
  if (deviceData.includes("firefox")) return "Firefox";
  if (deviceData.includes("chrome")) return "Chrome";
  if (deviceData.includes("safari")) return "Safari";

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

function getDeviceInfo() {
  const [screenHeight, screenWidth] = getScreenDimensions();
  const browserName = getBrowserName();
  const osName = getOperatingSystem();

  return [browserName, osName, screenHeight, screenWidth];
}

function acceptAllCookies() {
  checkBoxes.forEach((checkbox) => {
    checkbox.checked = true;
  });

  const [browserName, osName, screenHeight, screenWidth] = getDeviceInfo();

  const settingsValues = {
    Browser: browserName,
    "Operating System": osName,
    "Screen Height": screenHeight,
    "Screen Width": screenWidth
  };

  for (const setting in settingsValues) {
    setCookie(setting, settingsValues[setting], COOKIE_MAX_AGE);
  }

  if (cookieDialog.open) cookieDialog.close();

  setTimeout(() => {
    if (settingsDialog.open) settingsDialog.close();
  }, 1000);
}

acceptCookiesBtn.forEach((button) => {
  button.addEventListener("click", acceptAllCookies);
});

manageCookiesBtn.addEventListener("click", () => {
  cookieDialog.close();
  settingsDialog.showModal();
});

function setRejectedCookie(setting) {
  setCookie(setting, "rejected", COOKIE_MAX_AGE);
}

const settings = ["Browser", "Operating System", "Screen Height", "Screen Width"];
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

  const [browserName, osName, screenHeight, screenWidth] = getDeviceInfo();

  browser ? setCookie("Browser", browserName, COOKIE_MAX_AGE) : setRejectedCookie("Browser");

  os ? setCookie("Operating System", osName, COOKIE_MAX_AGE) : setRejectedCookie("Operating System");

  height ? setCookie("Screen Height", screenHeight, COOKIE_MAX_AGE) : setRejectedCookie("Screen Height");

  width ? setCookie("Screen Width", screenWidth, COOKIE_MAX_AGE) : setRejectedCookie("Screen Width");

  if (settingsDialog.open) settingsDialog.close();
}

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  savePreferences(e);
});
