/* Shared helpers. No dependencies, safe to load on every page. */

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getQueryParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Fetch and parse a JSON file from /data, with a friendly console error on failure. */
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} responded with ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Oakridge: could not load ${path}`, err);
    return null;
  }
}
