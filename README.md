# AI Daily Assistant

A smart daily assistant that helps you plan your day. This application generates a detailed, personalized schedule and allows you to refine it through an interactive chat powered by the Google Gemini API.

## Features

- **AI-Generated Schedule**: Instantly generates a structured schedule for today and tomorrow based on your life constraints.
- **AI-Powered Chat**: Modify your schedule or ask questions about it using a natural language chat interface powered by Gemini Pro.
- **Dark Mode**: A sleek, user-friendly dark mode toggle for comfortable viewing in any lighting.
- **Custom Event Colors**: Events are color-coded by type (work, gym, family, etc.) for quick visual organization.
- **Real-time Weather**: Fetches and displays the current weather based on your location (with a fallback).

## Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A modern, fast frontend build tool.
- **TypeScript**: A statically typed superset of JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **@google/genai**: The official Google Gemini API client library.

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended).
- A Google Gemini API key. You can get one from [Google AI Studio](https://ai.google.dev/).

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your Gemini API Key:**
    - Create a new file named `.env.local` in the root of the project.
    - Add your Gemini API key to this file:
      ```
      VITE_API_KEY=YOUR_API_KEY_HERE
      ```
    - Replace `YOUR_API_KEY_HERE` with your actual key.

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the application, and you can view it in your browser at the local address provided (usually `http://localhost:5173`).

### Building for Production

To create a production-ready build for services like Vercel, run:
```bash
npm run build
```
The optimized files will be generated in the `dist` directory.
