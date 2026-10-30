import { FormEvent, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AssistantStatus = "idle" | "listening" | "thinking" | "speaking";

interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
  resultIndex: number;
}

interface RecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const [language, setLanguage] = useState("en-IN");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const recognitionActiveRef = useRef(false);
  const isMutedRef = useRef(false);
  const sendMessageRef = useRef<(message: string) => Promise<void>>(async () => {});

  useEffect(() => {
    const speechWindow = window as SpeechRecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognition.onstart = () => setStatus("listening");
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      if (transcript) {
        setInput(transcript);
        void sendMessageRef.current(transcript);
      }
    };
    recognition.onerror = (event) => {
      const messagesByError: Record<string, string> = {
        "not-allowed": "Microphone permission was denied. Allow microphone access in your browser, or type a message.",
        "service-not-allowed": "Speech recognition is blocked by the browser. You can still type a message.",
        "no-speech": "No speech was detected. Try again, or type your message.",
        "audio-capture": "No microphone was found. Connect a microphone, or type your message.",
        network: "Speech recognition could not connect. Check your connection, or type your message.",
      };
      setError(messagesByError[event.error] || "Speech recognition failed. Please type your message or try again.");
      recognitionActiveRef.current = false;
      setStatus((current) => current === "listening" ? "idle" : current);
    };
    recognition.onend = () => {
      recognitionActiveRef.current = false;
      setStatus((current) => current === "listening" ? "idle" : current);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);
    return () => {
      recognitionActiveRef.current = false;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = language;
  }, [language]);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
  }, []);

  const speak = (text: string) => {
    if (isMutedRef.current || !("speechSynthesis" in window)) {
      setStatus("idle");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[\u0900-\u097f]/.test(text) ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (value: string) => {
    const message = value.trim();
    if (!message || status === "thinking") return;

    setError("");
    setInput("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setStatus("thinking");

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.slice(-12),
        }),
      });
      const data = await response.json() as { reply?: string; error?: string };
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The assistant returned an empty response. Please try again.");
      }

      const reply = data.reply.trim();
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
      speak(reply);
    } catch (requestError) {
      setStatus("idle");
      setError(requestError instanceof Error
        ? requestError.message
        : "Unable to reach Savera AI. Check that the backend is running and try again.");
    }
  };
  sendMessageRef.current = sendMessage;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const startListening = () => {
    if (!recognitionRef.current || recognitionActiveRef.current || status === "thinking") return;
    setError("");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    try {
      recognitionRef.current.lang = language;
      recognitionActiveRef.current = true;
      recognitionRef.current.start();
    } catch {
      recognitionActiveRef.current = false;
      setStatus("idle");
      setError("Could not start the microphone. Check its permission or type your message.");
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !recognitionActiveRef.current) return;
    recognitionRef.current.stop();
    recognitionActiveRef.current = false;
    setStatus((current) => current === "listening" ? "idle" : current);
  };

  const closeAssistant = () => {
    stopListening();
    window.speechSynthesis?.cancel();
    setStatus("idle");
    setIsOpen(false);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    isMutedRef.current = nextMuted;
    if (nextMuted) {
      window.speechSynthesis?.cancel();
      setStatus((current) => current === "speaking" ? "idle" : current);
    }
    setIsMuted(nextMuted);
  };

  const statusLabel = {
    idle: isSupported ? "Ask by voice or text" : "Microphone unavailable — type to chat",
    listening: "Listening...",
    thinking: "Savera AI is thinking...",
    speaking: "Speaking...",
  }[status];

  return (
    <>
      <button
        onClick={() => isOpen ? closeAssistant() : setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-savera-rose shadow-lg transition-all hover:bg-savera-rose-light ${
          status === "listening" ? "animate-voice-pulse" : ""
        }`}
        style={{ backgroundColor: "#AA5E7A" }}
        aria-label={isOpen ? "Close voice assistant" : "Open voice assistant"}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
      </button>

      {isOpen && (
        <section
          aria-label="Savera AI voice assistant"
          className="fixed bottom-24 right-4 z-50 flex max-h-[min(36rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] max-w-80 flex-col overflow-hidden rounded-xl border border-savera-border bg-savera-card shadow-2xl sm:right-6"
        >
          <header className="flex items-center justify-between border-b border-savera-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(170, 94, 122, 0.2)" }}>
                <Volume2 className="h-4 w-4" style={{ color: "#AA5E7A" }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Savera AI</h3>
                <p className="text-xs text-savera-text-dim" aria-live="polite">{statusLabel}</p>
              </div>
            </div>
            <button
              onClick={toggleMute}
              className="rounded-lg p-2 text-savera-text-dim transition-colors hover:bg-savera-surface hover:text-white"
              aria-label={isMuted ? "Enable spoken replies" : "Mute spoken replies"}
              title={isMuted ? "Enable spoken replies" : "Mute spoken replies"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </header>

          <div className="min-h-24 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 && (
              <div className="rounded-lg border border-savera-border bg-savera-surface px-3 py-3">
                <p className="text-sm text-white">Hi, I’m Savera AI. Ask me anything in English, Hindi, or Hinglish.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`rounded-lg border px-3 py-2 ${
                  message.role === "user"
                    ? "border-savera-border bg-savera-surface"
                    : ""
                }`}
                style={message.role === "assistant"
                  ? { backgroundColor: "rgba(170, 94, 122, 0.05)", borderColor: "rgba(170, 94, 122, 0.3)" }
                  : undefined}
              >
                <p className="mb-1 text-xs" style={{ color: message.role === "assistant" ? "#c97d96" : "#9ca3af" }}>
                  {message.role === "assistant" ? "Savera AI" : "You"}
                </p>
                <p className="whitespace-pre-wrap break-words text-sm text-white">{message.content}</p>
              </div>
            ))}
            {status === "listening" && (
              <div className="flex items-center justify-center gap-1 py-2" role="status">
                {[0, 1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="voice-wave-bar w-1 rounded-full"
                    style={{ backgroundColor: "#AA5E7A", animationDelay: `${item * 0.1}s`, height: "4px" }}
                  />
                ))}
                <span className="ml-2 text-xs text-savera-text-dim">Listening...</span>
              </div>
            )}
            {status === "thinking" && (
              <p className="text-center text-xs text-savera-text-dim" role="status">Savera AI is thinking...</p>
            )}
            {status === "speaking" && (
              <p className="flex items-center justify-center gap-2 py-1 text-xs text-savera-text-dim" role="status">
                <Volume2 className="h-4 w-4" style={{ color: "#AA5E7A" }} /> Speaking...
              </p>
            )}
            {error && (
              <div className="rounded-lg border border-savera-danger/30 bg-savera-danger/10 px-3 py-2" role="alert">
                <p className="text-xs text-savera-danger">{error}</p>
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-savera-border p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={4000}
                placeholder="Type in English, Hindi, or Hinglish..."
                aria-label="Message Savera AI"
                className="min-w-0 flex-1 rounded-lg border border-savera-border bg-savera-surface px-3 py-2 text-sm text-white placeholder:text-savera-text-dim focus:border-savera-rose focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || status === "thinking"}
                className="rounded-lg px-3 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: "#AA5E7A" }}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={status === "listening" ? stopListening : startListening}
                disabled={!isSupported || status === "thinking"}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: status === "listening" ? "#7a4358" : "#AA5E7A" }}
              >
                {status === "listening" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {status === "listening" ? "Stop listening" : "Speak"}
              </button>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-lg border border-savera-border bg-savera-surface px-2 py-2 text-xs text-savera-text-dim focus:outline-none"
                aria-label="Speech recognition language"
              >
                <option value="en-IN">English</option>
                <option value="hi-IN">Hindi</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-savera-border pt-2">
              {["Help me get started", "Explain energy use", "Namaste, kaise ho?"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  disabled={status === "thinking"}
                  className="rounded-full border border-savera-border px-2.5 py-1 text-xs text-savera-text-dim transition-colors hover:border-savera-rose/30 hover:text-white disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
