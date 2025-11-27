import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { createSchedulePrompt, scheduleSchema, chatResponseSchema } from './constants';
import type { ChatMessage, ScheduleEvent, WeatherInfo } from './types';
import { ChatInterface } from './components/ChatInterface';
import { LoadingSpinner } from './components/LoadingSpinner';
// Import CloseIcon
import { SparklesIcon, ChatBubbleIcon, SunIcon, MoonIcon, CloudIcon, CloseIcon } from './components/IconComponents';
import { Tabs } from './components/Tabs';
import { ScheduleView } from './components/ScheduleView';

type Day = 'today' | 'tomorrow';

// Fix: Per coding guidelines, API key must be retrieved from process.env.API_KEY.
// This resolves the error "Property 'env' does not exist on type 'ImportMeta'".
// This is a client-side only app. The API key is expected to be in the environment.
if (!process.env.API_KEY) {
  throw new Error("API_KEY is not defined in your environment variables.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [todaySchedule, setTodaySchedule] = useState<ScheduleEvent[]>([]);
  const [tomorrowSchedule, setTomorrowSchedule] = useState<ScheduleEvent[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Day>('today');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<{today: WeatherInfo, tomorrow: WeatherInfo} | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [geolocationUIMessage, setGeolocationUIMessage] = useState<string | null>(null);
  const [showGeolocationMessage, setShowGeolocationMessage] = useState<boolean>(true);


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // New Damietta, Egypt coordinates
    const defaultLocation = { lat: 31.4167, lng: 31.8167 }; 

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGeolocationUIMessage(null); // Clear message if successful
        },
        (err) => {
          console.warn(`Geolocation access failed (${err.code}): ${err.message}. Using default location.`);
          setLocation(defaultLocation);
          setGeolocationUIMessage(`Geolocation access failed (${err.code}): ${err.message}. Using default location (New Damietta, Egypt). You can enable location in your browser settings or run the app from a local web server for better accuracy.`);
        },
        { timeout: 5000 } // Reduced timeout for faster fallback
      );
    } else {
      console.warn("Geolocation not supported. Using default location.");
      setLocation(defaultLocation);
      setGeolocationUIMessage(`Geolocation not supported in this browser. Using default location (New Damietta, Egypt).`);
    }
  }, []);

  const fetchWeather = useCallback(async (lat: number, lng: number) => {
    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `What is the weather forecast for today and tomorrow at latitude ${lat}, longitude ${lng}? 
            Return a valid JSON object (do NOT use markdown code blocks, just raw JSON) with this exact structure:
            {
              "today": { "temp": "20°C", "condition": "Sunny", "location": "City Name" },
              "tomorrow": { "temp": "18°C", "condition": "Rain", "location": "City Name" }
            }`,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        
        let jsonString = result.text;
        if (jsonString) {
             // Remove markdown code blocks if present
            jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(jsonString);
            setWeatherData(data);
        }
    } catch (e) {
        console.error("Failed to fetch weather", e);
    }
  }, []);

  useEffect(() => {
      if (location) {
          fetchWeather(location.lat, location.lng);
      }
  }, [location, fetchWeather]);


  const fetchSchedule = useCallback(async (day: Day) => {
    try {
      // Switched to gemini-2.5-flash for better stability with JSON generation and to avoid 500 errors
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: createSchedulePrompt(day),
        config: {
          responseMimeType: "application/json",
          responseSchema: scheduleSchema,
        },
      });
      
      const jsonString = result.text.trim();
      const scheduleData = JSON.parse(jsonString);
      
      if (day === 'today') {
        setTodaySchedule(scheduleData);
      } else {
        setTomorrowSchedule(scheduleData);
      }
    } catch (e: any) {
        console.error(`Failed to fetch schedule for ${day}:`, e);
        throw new Error(`Could not generate the schedule for ${day}. Please check your API key and network connection.`);
    }
  }, []);

  useEffect(() => {
    const initializeSchedules = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchSchedule('today'),
          fetchSchedule('tomorrow')
        ]);
         setChatHistory([{ role: 'model', text: "Here is your initial plan for today and tomorrow. I can answer questions about your day or help you make changes!" }]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    initializeSchedules();
  }, [fetchSchedule]);

  const handleSendMessage = async (message: string) => {
    if (isStreaming) return;

    setIsStreaming(true);
    setError(null);
    
    const userMessage: ChatMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Add a placeholder for the model's response
    setChatHistory(prev => [...prev, { role: 'model', text: '' }]);
    
    const currentSchedule = activeTab === 'today' ? todaySchedule : tomorrowSchedule;

    const prompt = `
    You are an intelligent daily assistant helping the user manage their day.
    
    Context:
    - The user is viewing their schedule for: ${activeTab}.
    - Current Schedule Data: ${JSON.stringify(currentSchedule, null, 2)}
    
    User's Message: "${message}"
    
    Task:
    1. Interpret the User's Message.
    2. If it is a QUESTION about the schedule (e.g., "When is my first meeting?", "Do I have time for a nap?", "What's next?"), answer the question in 'responseMessage' and return the Current Schedule Data EXACTLY as is in 'updatedSchedule'.
    3. If it is a GENERAL CHAT (e.g., "Hi", "Thanks"), respond politely in 'responseMessage' and return the Current Schedule Data EXACTLY as is in 'updatedSchedule'.
    4. If it is a REQUEST TO CHANGE the schedule (e.g., "Move gym to 6pm", "I'm sick, cancel the run"), modify the schedule data accordingly in 'updatedSchedule' and describe the change in 'responseMessage'.
    
    Output MUST be a JSON object containing 'responseMessage' and 'updatedSchedule'.
    `;

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: chatResponseSchema,
        },
      });
      
      const jsonString = result.text.trim();
      const responseData = JSON.parse(jsonString);

      // Update the schedule state if it was returned
      if (responseData.updatedSchedule) {
        if (activeTab === 'today') {
            setTodaySchedule(responseData.updatedSchedule);
        } else {
            setTomorrowSchedule(responseData.updatedSchedule);
        }
      }
      
      // Update the chat UI with the model's text response
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = responseData.responseMessage;
        return newHistory;
      });

    } catch (e: any) {
      console.error(e);
      const errorMessage = `Failed to get a response: ${e.message}`;
      setError(errorMessage);
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = `Error: ${e.message}`;
        return newHistory;
      });
    } finally {
      setIsStreaming(false);
    }
  };
  
  const getDisplayDate = (day: Day) => {
    const date = new Date();
    if (day === 'tomorrow') {
        date.setDate(date.getDate() + 1);
    }
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm transition-colors">
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <SparklesIcon className="w-6 h-6 text-sky-500 mr-2" />
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">AI Daily Assistant</h1>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                </button>
            </div>
        </header>
        
        <main className="flex-grow relative overflow-hidden">
            {isLoading ? (
                <div className="flex-grow h-full flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="flex-grow h-full flex items-center justify-center p-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-6 rounded-2xl max-w-md text-center shadow-sm">
                        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                        <p className="mt-4 text-sm text-red-600 dark:text-red-500">Please check your network connection and refresh.</p>
                    </div>
                </div>
            ) : (
              <>
                  <div className="h-full overflow-y-auto p-4 md:p-6 lg:p-8 max-w-3xl mx-auto pb-24">
                      {geolocationUIMessage && showGeolocationMessage && (
                          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-lg flex items-start justify-between text-sm">
                              <p>{geolocationUIMessage}</p>
                              <button 
                                  onClick={() => setShowGeolocationMessage(false)}
                                  className="ml-4 p-1 rounded-full text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
                              >
                                  <CloseIcon className="w-4 h-4" />
                              </button>
                          </div>
                      )}

                      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-baseline justify-between mb-4 px-1">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{activeTab === 'today' ? 'Today' : 'Tomorrow'}</h2>
                            <div className="text-right">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{getDisplayDate(activeTab)}</p>
                                {weatherData && weatherData[activeTab] && (
                                    <div className="flex items-center justify-end gap-2 text-sm text-sky-600 dark:text-sky-400 mt-1 font-medium bg-sky-50 dark:bg-sky-900/20 px-2 py-1 rounded-md inline-flex self-end">
                                        <CloudIcon className="w-4 h-4" />
                                        <span>{weatherData[activeTab].location}: {weatherData[activeTab].temp}, {weatherData[activeTab].condition}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <ScheduleView schedule={activeTab === 'today' ? todaySchedule : tomorrowSchedule} />
                      </div>
                  </div>

                  {/* Floating Action Button */}
                  <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isChatOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="w-14 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-700"
                        aria-label="Open AI Chat"
                    >
                        <ChatBubbleIcon className="w-7 h-7" />
                    </button>
                  </div>

                  {/* Floating Chat Window */}
                  {isChatOpen && (
                      <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] md:max-h-[calc(100vh-3rem)] z-50 flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4">
                          <div className="h-full bg-white dark:bg-slate-900 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/50 dark:border-slate-800 md:ring-1 md:ring-slate-900/5 dark:md:ring-slate-100/10">
                             <ChatInterface
                                  chatHistory={chatHistory}
                                  onSendMessage={handleSendMessage}
                                  isStreaming={isStreaming}
                                  onClose={() => setIsChatOpen(false)}
                              />
                          </div>
                      </div>
                  )}
              </>
            )}
        </main>
    </div>
  );
};

export default App;