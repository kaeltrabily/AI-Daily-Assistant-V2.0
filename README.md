# AI Daily Assistant

A smart, minimalistic daily assistant that helps you plan and manage your day. This application provides a pre-configured daily schedule and leverages the Google Gemini API to allow for interactive modifications and Q&A through a chat interface.

## ✨ Features

- **Pre-loaded Schedule**: Instantly loads a default schedule for typical workdays (Saturday–Thursday) and days off (Friday).
- **AI-Powered Chat**: A floating chat window allows you to ask questions about your schedule ("When is lunch?") or request changes ("Move my gym session to 7 PM").
- **Dark Mode**: A sleek, toggleable dark mode for comfortable viewing in any lighting condition.
- **Color-Coded Events**: Events are automatically color-coded by category (Work, Gym, Family, etc.) for quick visual organization.
- **Weather Forecast**: Displays the current day's and tomorrow's weather forecast for a fixed location (New Damietta, Egypt).
- **Fully Responsive**: A clean and modern UI that works great on both desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Getting Started

This is a pure client-side application and does not require a build step or a local server.

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari).
- A Google Gemini API key. The application is configured to read this key from an environment variable (`API_KEY`). You must have this variable available in the environment where you run the app.

### Running the Application

1.  Make sure your Gemini `API_KEY` is set in your environment.
2.  Simply open the `index.html` file in your web browser.

That's it! The application will load your default schedule and you can start interacting with the AI assistant.
