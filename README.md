# Final Project

> Solo project — Final submission

## Project Overview

Replace the project title above with your actual project name. This repository contains a set of small web apps built for a solo student project. Each app is a single-page HTML/CSS/JavaScript application that demonstrates core front-end skills and API integration.

Folders included:
- `calculator/` — Simple calculator app.
- `nekos-api/` — Cute images / API demo (replace with actual API details used).
- `stopwatch/` — Minimal stopwatch implementation.
- `weather-api/` — Weather app using OpenWeatherMap API with current weather and 5-day forecast.

## Main Features

- Clean, responsive UI for each small app.
- Keyboard and mouse accessibility where applicable (e.g., press Enter to search in Weather app).
- External API integration (weather data, optional image APIs).
- Local state and UI persistence where appropriate.

## APIs Used

Below list APIs used in this project. Replace or expand entries to match the APIs you actually called.

- OpenWeatherMap (Weather App)
  - Base URL: `https://api.openweathermap.org`
  - Geocoding endpoint: `/geo/1.0/direct?q={city name}&limit={limit}&appid={API key}`
  - Current weather endpoint: `/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric`
  - Forecast endpoint: `/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}&units=metric`
  - Parameters: `q`, `lat`, `lon`, `limit`, `appid`, `units`
  - Authentication: API key passed as `appid` query parameter.

- (Optional) Nekos / image API used in `nekos-api/`
  - Base URL: (fill in)
  - Endpoints: (fill in)
  - Parameters: (fill in)
  - Authentication: (fill in if required)

Note: Do not commit secret API keys to the repo. For submission, either remove your API key or include instructions in a private note for the instructor on how to obtain and set a key.

## Technologies Used

- HTML5
- CSS3 (custom properties / responsive layout)
- JavaScript (ES6+)
- Browser Fetch API for network requests

## How to Clone the Repository

Open a terminal and run:

```bash
git clone <REPO_URL>
cd final-project-elec3
```

Replace `<REPO_URL>` with the repository URL provided by your hosting service.

## Run the Projects Locally

Each app is a static site. You can open them directly in a modern browser, or serve them with a minimal static server.

Option A — Open directly

1. Navigate to the folder for the app you want to run, e.g. `weather-api/`.
2. Open `index.html` in your browser (double-click or use `File → Open`).

Option B — Serve with Python (recommended for fetch/API requests)

From the project root run:

```bash
# For Python 3.x
python -m http.server 8000
```

Then open `http://localhost:8000/weather-api/` (or the folder you want) in your browser.

Option C — Use a lightweight Node server

Install `http-server` (optional):

```bash
npm install -g http-server
http-server -c-1
```

Then visit the shown local URL.

## Configuration / API Keys

If an app requires an API key (for example, the Weather app), do **not** commit the key. Instead, follow these options:

- Hardcode for local testing (remove before final submission).
- Store in a browser-only config file that is not committed (instructor will expect a note explaining how you tested).

Example: in `weather-api/script.js` there is a constant named `API_KEY` — replace its value with your key during testing, then remove it before sharing the repo publicly.

## Project Structure

```
final-project-elec3/
  calculator/
    index.html
    script.js
    style.css
  nekos-api/
    index.html
    script.js
    style.css
  stopwatch/
    index.html
    script.js
    style.css
  weather-api/
    index.html
    script.js
    style.css
  README.md
```

## Notes for Instructor

- This is a solo project completed by [Your Name].
- All code is authored by me. External libraries are not used beyond the browser platform.
- To test the Weather app, please obtain a free OpenWeatherMap API key and set it in `weather-api/script.js` as `API_KEY`, or run it with a local proxy that injects the key.

## Credits / Attribution

- Weather data provided by OpenWeatherMap — https://openweathermap.org/ (do not remove attribution if required by the API terms).
- (If using an image API) Images provided by [API Name] — [API URL].

## Submission Checklist

- [ ] Replace `[Your project title]` with the actual title.
- [ ] Replace screenshots placeholders with real images.
- [ ] Remove or secure any API keys before submitting/publishing.
- Nina Rhein S. Ellasus
