"use client";

import { useEffect, useRef, useState } from "react";

type RecognitionType = SpeechRecognition | webkitSpeechRecognition;

export default function VoicePage() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const recognitionRef = useRef<RecognitionType | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition: RecognitionType = new SpeechRecognition();
    recognition.lang = "el-GR"; // ελληνικά αρχικά – αλλάζει μετά
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setOriginalText(text.trim());
      // προσωρινή "μετάφραση" για demo
      setTranslatedText(
        text.trim()
          ? text.trim() + "  (translated — demo, πραγματική μετάφραση στο επόμενο στάδιο)"
          : ""
      );
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);
  }, []);

  const handleStart = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // αν είναι ήδη σε start, αγνοούμε το error
    }
  };

  const handleStop = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        padding: "32px 16px 40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
        }}
      >
        <header
          style={{
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 3.4vw, 2.6rem)",
              fontWeight: 700,
              color: "#bfdbfe",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Voice · Live Interpreter
          </h1>
          <p
            style={{
              marginTop: "10px",
              fontSize: "0.95rem",
              maxWidth: "650px",
              opacity: 0.9,
            }}
          >
            Demo ζωντανού διερμηνέα φωνής. Πάτα Start, μίλα στο μικρόφωνο και
            θα δεις το κείμενο να εμφανίζεται στο &quot;Original Speech&quot;.
            Προς το παρόν η &quot;μετάφραση&quot; είναι απλό demo κείμενο· στο
            επόμενο στάδιο θα συνδεθεί με πραγματική μηχανή μετάφρασης.
          </p>
        </header>

        {!isSupported && isSupported !== null && (
          <div
            style={{
              marginBottom: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(248,113,113,0.9)",
              background: "rgba(127,29,29,0.9)",
              padding: "10px 12px",
              fontSize: "0.86rem",
            }}
          >
            Ο browser δεν υποστηρίζει ακόμα το Web Speech API. Δοκίμασε Chrome
            σε desktop για καλύτερα αποτελέσματα. Το UI όμως δουλεύει κανονικά
            και θα συνδεθεί αργότερα με backend διερμηνέα.
          </div>
        )}

        {/* CONTROLS */}
        <section
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleStart}
            disabled={!isSupported || isListening}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              cursor: isSupported && !isListening ? "pointer" : "not-allowed",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: isListening
                ? "rgba(34,197,94,0.9)"
                : "rgba(37,99,235,0.95)",
              opacity: isSupported ? 1 : 0.6,
            }}
          >
            {isListening ? "Listening..." : "Start listening"}
          </button>
          <button
            onClick={handleStop}
            disabled={!isSupported || !isListening}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(248,113,113,0.9)",
              cursor: isSupported && isListening ? "pointer" : "not-allowed",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: "transparent",
              color: "#fecaca",
              opacity: isSupported ? 1 : 0.6,
            }}
          >
            Stop
          </button>
        </section>

        {/* PANELS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "18px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              borderRadius: "16px",
              padding: "18px 16px",
              border: "1px solid rgba(148,163,184,0.55)",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,64,175,0.75))",
            }}
          >
            <h2
              style={{
                fontSize: "1.05rem",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Original Speech
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                opacity: 0.9,
              }}
            >
              Το κείμενο που αναγνωρίζεται από τη φωνή σου σε πραγματικό χρόνο.
            </p>
            <div
              style={{
                marginTop: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(30,64,175,0.8)",
                padding: "10px 12px",
                minHeight: "80px",
                fontSize: "0.9rem",
                opacity: 0.9,
                whiteSpace: "pre-wrap",
              }}
            >
              {originalText || (
                <span style={{ opacity: 0.7 }}>
                  Πάτα &quot;Start listening&quot; και μίλα στο μικρόφωνο…
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              borderRadius: "16px",
              padding: "18px 16px",
              border: "1px solid rgba(148,163,184,0.55)",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(56,189,248,0.7))",
            }}
          >
            <h2
              style={{
                fontSize: "1.05rem",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Translated Speech (demo)
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                opacity: 0.9,
              }}
            >
              Προσωρινό πεδίο μετάφρασης για το demo. Στο επόμενο στάδιο θα
              συνδεθεί με πραγματική μηχανή μετάφρασης (API).
            </p>
            <div
              style={{
                marginTop: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(56,189,248,0.85)",
                padding: "10px 12px",
                minHeight: "80px",
                fontSize: "0.9rem",
                opacity: 0.9,
                whiteSpace: "pre-wrap",
              }}
            >
              {translatedText || (
                <span style={{ opacity: 0.7 }}>
                  Μόλις ξεκινήσει η αναγνώριση, εδώ θα βλέπεις demo
                  &quot;μετάφραση&quot;…
                </span>
              )}
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: "16px",
            padding: "16px 14px",
            border: "1px dashed rgba(148,163,184,0.6)",
            background: "rgba(15,23,42,0.9)",
            fontSize: "0.86rem",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#fde68a" }}>Σημείωση υλοποίησης:</strong>{" "}
          Αυτή είναι η πρώτη λειτουργική έκδοση του Voice. Στο επόμενο βήμα
          μπορούμε να:
          <ul
            style={{
              marginTop: "6px",
              paddingLeft: "18px",
            }}
          >
            <li>Προσθέσουμε επιλογή γλωσσών (από / προς)</li>
            <li>Συνδέσουμε πραγματική μετάφραση (API)</li>
            <li>Προσθέσουμε αναπαραγωγή φωνής (TTS)</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
