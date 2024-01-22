import "./App.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import toast from "react-hot-toast";
import { StopCircle } from "lucide-react";

function App() {
  const speech = new SpeechSynthesisUtterance();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(.5);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length) {
            resolve(voices);
          } else {
            window.speechSynthesis.addEventListener("voiceschanged", () => {
              const updatedVoices = window.speechSynthesis.getVoices();
              resolve(updatedVoices);
            });
          }
        });

        setVoices(voices);
      } catch (error) {
        console.error("VOICES ERROR:", error);
      }
    };

    fetchVoices();
    console.log(voices);
  }, []);

  const isTextBlank = () => text.trim() === "";

  const startSpeaking = () => {
    if (isTextBlank()) {
      toast.error("Please enter text to speak");
      setIsSpeaking(false);
      return;
    }

    speech.text = text;
    speech.rate = rate;
    speech.voice = voices.find((v) => v.name === voice) || voices[0];
    speech.pitch = pitch;
    speech.volume = volume;

    console.log("text", text)
    console.log("rate", rate);
    console.log("voice", voice);
    console.log("pitch", pitch);
    console.log("vol", volume);


    speech.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);

    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center  justify-start p-4 sm:justify-center sm:p-0">
      <div className="flex flex-col gap-4 max-w-[640px] w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Readaloud 🔊</CardTitle>
            <CardDescription>Text-to-speech</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-2">
            <Textarea id="text" onChange={(e) => setText(e.target.value)} />
            <div className="flex w-full justify-end gap-2">
              <Button
                onClick={stopSpeaking}
                variant="destructive"
                disabled={!isSpeaking}
              >
                <StopCircle />
              </Button>

              <Button
                onClick={() => {
                  startSpeaking();
                }}
                variant={"default"}
              >
                Read
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="relative">
            <CardTitle>Settings ⚙️</CardTitle>
            <CardDescription>Change the speech settings here</CardDescription>
            <div className="absolute right-6 top-4">
              <ThemeToggle />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <Select onValueChange={(value) => setVoice(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Voices</SelectLabel>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-2 w-full">
              <CardDescription>Volume</CardDescription>
              <Slider
                min={0}
                max={1}
                step={.1}
                onValueChange={(value) => setVolume(value[0])}
                defaultValue={[volume]}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <CardDescription>Pitch</CardDescription>
              <Slider
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={(value) => setPitch(value[0])}
                defaultValue={[pitch]}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <CardDescription>Speech Rate</CardDescription>
              <Slider
                min={0.1}
                max={3}
                step={0.1}
                onValueChange={(value) => setRate(value[0])}
                defaultValue={[rate]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default App;
