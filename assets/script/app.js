"use strict";

const cookieDialog = document.getElementById("cookies-dialog");
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
  let browserData = navigator.platform.toLowerCase();
  return browserData.includes("win")
    ? "Windows"
    : browserData.includes("mac")
      ? "MacOS"
      : browserData.includes("linux")
        ? "Linux"
        : "No OS";
}
