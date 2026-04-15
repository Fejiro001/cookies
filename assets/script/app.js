"use strict";

const cookieDialog = document.getElementById("cookies-dialog");
const manageCookies = document.getElementById("manage-cookies");
const settingsDialog = document.getElementById("settings-dialog");

function setCookie(name, value, maxAge) {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  const options = {
    path: "/",
    SameSite: "Lax"
  };
  for (let option in options) {
    cookieString += `; ${option}=${options[option]}`;
  }

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }
  document.cookie = cookieString;
}

function getCookies() {
  if (document.cookie) {
    const cookiePair = document.cookie.split(";");

    cookiePair.forEach((cookie) => {
      let [key, value] = cookie.split("=");
      key = decodeURIComponent(key).trim();
      value = decodeURIComponent(value).trim();
      console.log(`Key: ${key}, Value: ${value};`);
    });
  }
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

  if (browserData.includes("edg")) return "Micorsoft Edge";
  if (browserData.includes("opr") || browserData.includes("opera")) return "Opera";
  if (browserData.includes("firefox")) return "Firefox";
  if (browserData.includes("chrome")) return "Chrome";
  if (browserData.includes("safari")) return "Safari";

  return "Other Browser";
}

function getScreenDimensions() {
  const height = window.screen.height;
  const width = window.screen.width;

  return [height, width];
}

if (navigator.cookieEnabled) {
  if (!document.cookie) {
    setTimeout(() => {
      cookieDialog.showModal();
    }, 3000);
  }
}
