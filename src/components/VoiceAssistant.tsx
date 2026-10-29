import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, X, Volume2 } from "lucide-react";

interface VoiceCommand {
  patterns: RegExp[];
  action: () => void;
  response: string;
}

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      processCommand(text);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please allow microphone permissions.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const processCommand = (text: string) => {
    const commands: VoiceCommand[] = [
      // Navigation commands
      {
        patterns: [/go to (dashboard|home|overview)/, /show (dashboard|home|overview)/, /open (dashboard|home|overview)/],
        action: () => navigate("/dashboard"),
        response: "Opening the dashboard for you.",
      },
      {
        patterns: [/show (anomalies|alerts|problems|issues)/, /go to anomalies/, /any (anomalies|alerts)/],
        action: () => navigate("/dashboard/anomalies"),
        response: "Showing the AI anomalies page.",
      },
      {
        patterns: [/show (energy|consumption|electricity)/, /go to energy/, /energy (usage|monitoring)/],
        action: () => navigate("/dashboard/energy"),
        response: "Opening the energy monitoring page.",
      },
      {
        patterns: [/show (buildings|campus)/, /go to buildings/],
        action: () => navigate("/dashboard/buildings"),
        response: "Showing the buildings page.",
      },
      {
        patterns: [/show (forecast|prediction|future)/, /go to forecasting/],
        action: () => navigate("/dashboard/forecasting"),
        response: "Opening the forecasting page.",
      },
      {
        patterns: [/show (recommendations|suggestions|tips)/, /go to recommendations/],
        action: () => navigate("/dashboard/recommendations"),
        response: "Showing AI recommendations.",
      },
      {
        patterns: [/show (tasks|to-do|todo)/, /go to tasks/],
        action: () => navigate("/dashboard/tasks"),
        response: "Opening the tasks page.",
      },
      {
        patterns: [/show (sms|messages|notifications)/, /go to sms/, /send (sms|message)/],
        action: () => navigate("/dashboard/sms"),
        response: "Opening the SMS and notifications page.",
      },
      {
        patterns: [/show (reports|analytics)/, /go to reports/],
        action: () => navigate("/dashboard/reports"),
        response: "Opening the reports page.",
      },
      {
        patterns: [/show (water|water usage)/, /go to water/],
        action: () => navigate("/dashboard/water"),
        response: "Opening the water management page.",
      },
      {
        patterns: [/show (waste|waste management)/, /go to waste/],
        action: () => navigate("/dashboard/waste"),
        response: "Opening the waste management page.",
      },
      {
        patterns: [/show (settings|configuration)/, /go to settings/],
        action: () => navigate("/dashboard/settings"),
        response: "Opening settings.",
      },

      // Informational commands
      {
        patterns: [/how (much|many) energy/, /total (energy|consumption)/, /what.*consumption/],
        action: () => navigate("/dashboard"),
        response: "Today's total energy consumption is 1,315 kilowatt-hours across all buildings. The estimated cost is 10,520 rupees.",
      },
      {
        patterns: [/how many (anomalies|alerts|problems)/, /any (anomalies|alerts)/, /active (anomalies|alerts)/],
        action: () => navigate("/dashboard/anomalies"),
        response: "There are currently 2 active anomalies. One critical anomaly in Building C with 125% deviation, and one high severity anomaly in Building A.",
      },
      {
        patterns: [/how many buildings/, /list buildings/],
        action: () => navigate("/dashboard/buildings"),
        response: "There are 3 buildings in the campus: Building A, the Academic Block; Building B, the Hostel; and Building C, the Admin Office.",
      },
      {
        patterns: [/what.*savings/, /how much.*saved/],
        action: () => navigate("/dashboard/reports"),
        response: "Estimated savings this month are 258 rupees. Verified savings from completed actions are 32 rupees.",
      },
      {
        patterns: [/help/, /what can you do/, /commands/],
        action: () => {},
        response: "I can help you navigate the dashboard. Try saying: 'show anomalies', 'show energy usage', 'how much energy', or 'show water management'. I'll take you to the right page.",
      },
      {
        patterns: [/close/, /exit/, /stop/, /shut/],
        action: () => setIsOpen(false),
        response: "Closing the voice assistant.",
      },
    ];

    for (const cmd of commands) {
      for (const pattern of cmd.patterns) {
        if (pattern.test(text)) {
          setResponse(cmd.response);
          speak(cmd.response);
          cmd.action();
          return;
        }
      }
    }

    // Default response
    const defaultResponse = "I didn't understand that. Try saying 'help' to see what I can do, or try 'show anomalies', 'show energy', or 'show water'.";
    setResponse(defaultResponse);
    speak(defaultResponse);
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    setError("");
    setTranscript("");
    setResponse("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error("Failed to start recognition:", e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {}
    setIsListening(false);
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (isOpen && isListening) {
      stopListening();
    }
    if (isOpen) {
      window.speechSynthesis?.cancel();
    }
  };

  if (!isSupported) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleAssistant}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen ? "bg-savera-rose" : "bg-savera-rose hover:bg-savera-rose-light"
        } ${isListening ? "animate-voice-pulse" : ""}`}
        style={{ backgroundColor: isOpen || isListening ? "#AA5E7A" : "#AA5E7A" }}
        aria-label="Voice Assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Assistant panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-xl border border-savera-border bg-savera-card shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 border-b border-savera-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(170, 94, 122, 0.2)" }}>
                <Volume2 className="h-4 w-4" style={{ color: "#AA5E7A" }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Voice Assistant</h3>
                <p className="text-xs text-savera-text-dim">Say a command to navigate</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {error && (
              <div className="rounded-lg bg-savera-danger/10 border border-savera-danger/30 px-3 py-2">
                <p className="text-xs text-savera-danger">{error}</p>
              </div>
            )}

            {transcript && (
              <div className="rounded-lg bg-savera-surface border border-savera-border px-3 py-2">
                <p className="text-xs text-savera-text-dim mb-1">You said:</p>
                <p className="text-sm text-white italic">"{transcript}"</p>
              </div>
            )}

            {response && (
              <div className="rounded-lg border px-3 py-2" style={{ backgroundColor: "rgba(170, 94, 122, 0.05)", borderColor: "rgba(170, 94, 122, 0.3)" }}>
                <p className="text-xs mb-1" style={{ color: "#c97d96" }}>Savera AI:</p>
                <p className="text-sm text-white">{response}</p>
              </div>
            )}

            {/* Listening indicator */}
            {isListening && (
              <div className="flex items-center justify-center gap-1 py-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full voice-wave-bar"
                    style={{
                      backgroundColor: "#AA5E7A",
                      animationDelay: `${i * 0.1}s`,
                      height: "4px",
                    }}
                  />
                ))}
                <span className="ml-2 text-xs text-savera-text-dim">Listening...</span>
              </div>
            )}

            {/* Speak indicator */}
            {isSpeaking && (
              <div className="flex items-center justify-center gap-2 py-2">
                <Volume2 className="h-4 w-4" style={{ color: "#AA5E7A" }} />
                <span className="text-xs text-savera-text-dim">Speaking...</span>
              </div>
            )}

            {/* Mic button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: isListening ? "#7a4358" : "#AA5E7A" }}
            >
              {isListening ? (
                <span className="flex items-center justify-center gap-2">
                  <MicOff className="h-4 w-4" />
                  Stop Listening
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Mic className="h-4 w-4" />
                  Tap to Speak
                </span>
              )}
            </button>

            {/* Quick commands */}
            <div className="pt-2 border-t border-savera-border">
              <p className="text-xs text-savera-text-dim mb-2">Try saying:</p>
              <div className="flex flex-wrap gap-1.5">
                {["Show anomalies", "How much energy", "Show water", "Help"].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setTranscript(cmd.toLowerCase());
                      processCommand(cmd.toLowerCase());
                    }}
                    className="rounded-full border border-savera-border px-2.5 py-1 text-xs text-savera-text-dim hover:text-white hover:border-savera-rose/30 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
