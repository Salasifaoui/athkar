import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Audio } from "expo-av";
import { Pause, Play, Square } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

interface LecteurAudioProps {
  audioSource?: { uri?: string; require?: number };
  count?: number; // Number of times to repeat the audio
  autoPlay?: boolean; // Auto-play when audio loads
  onComplete?: () => void; // Callback when all repetitions are complete
}

export default function LecteurAudio({ 
  audioSource, 
  count = 1, 
  autoPlay = true,
  onComplete 
}: LecteurAudioProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const progressBarWidth = useRef(0);

  // Load audio when source changes
  useEffect(() => {
    if (!audioSource) return;

    let currentSound: Audio.Sound | null = null;

    const loadAudio = async () => {
      try {
        setIsLoading(true);

        // Set audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        // Determine if this is a local asset (require) or remote URL (uri)
        let source;
        if (audioSource.require !== undefined) {
          // Local asset using require()
          source = audioSource.require;
        } else if (audioSource.uri) {
          // Remote URL or local path
          source = { uri: audioSource.uri };
        } else {
          console.error('Invalid audio source:', audioSource);
          return;
        }

        // Load new sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: false } // We'll handle playing manually
        );

        currentSound = newSound;

        // Get duration
        const status = await newSound.getStatusAsync();
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
        }

        // Reset repeat counter when new audio loads
        setCurrentRepeat(0);

        // Set up status update listener
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setIsPlaying(status.isPlaying || false);
            
            if (status.didJustFinish) {
              setIsPlaying(false);
              
              // Handle repetition logic
              setCurrentRepeat((prev) => {
                const newRepeat = prev + 1;
                
                // If we haven't reached the required count, play again
                if (newRepeat < count) {
                  // Reset position and play again after a short delay
                  setTimeout(async () => {
                    if (newSound) {
                      try {
                        await newSound.setPositionAsync(0);
                        await newSound.playAsync();
                      } catch (error) {
                        console.error("Error replaying audio:", error);
                      }
                    }
                  }, 100);
                  return newRepeat;
                } else {
                  // All repetitions complete, reset position and call onComplete callback
                  if (newSound) {
                    newSound.setPositionAsync(0).catch(console.error);
                  }
                  setPosition(0);
                  if (onComplete) {
                    setTimeout(() => {
                      onComplete();
                    }, 100);
                  }
                  return newRepeat;
                }
              });
            }
          }
        });

        setSound(newSound);
        
        // Auto-play if enabled
        if (autoPlay && newSound) {
          try {
            await newSound.playAsync();
          } catch (error) {
            console.error("Error auto-playing audio:", error);
          }
        }
      } catch (error) {
        console.error("Error loading audio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();

    // Cleanup
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [audioSource, autoPlay, count, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePlayPause = async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      }
    } catch (error) {
      console.error("Error playing/pausing audio:", error);
    }
  };

  const handleStop = async () => {
    if (!sound) return;

    try {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      setIsPlaying(false);
      setPosition(0);
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  };

  const handleSeek = async (newPosition: number) => {
    if (!sound || duration === 0) return;

    try {
      const positionMillis = (newPosition / 100) * duration;
      await sound.setPositionAsync(positionMillis);
      setPosition(positionMillis);
    } catch (error) {
      console.error("Error seeking audio:", error);
    }
  };

  const formatTime = (milliseconds: number) => {
    if (!milliseconds || isNaN(milliseconds)) return "0:00";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;
  const timeRemaining = duration - position;

  if (!audioSource) {
    return (
      <Box className="p-4">
        <Text>No audio source provided</Text>
      </Box>
    );
  }

  return (
    <Box className="p-4 bg-background-0 rounded-lg">
      <VStack space="md">
        {/* Progress Bar */}
        <Pressable
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            if (progressBarWidth.current > 0) {
              const percentage = (locationX / progressBarWidth.current) * 100;
              handleSeek(Math.max(0, Math.min(100, percentage)));
            }
          }}
        >
          <View
            className="h-2 bg-background-200 rounded-full overflow-hidden"
            onLayout={(e) => {
              progressBarWidth.current = e.nativeEvent.layout.width;
            }}
          >
            <View
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </Pressable>

        {/* Time Display */}
        <HStack className="justify-between items-center">
          <Text className="text-sm text-typography-500">
            {formatTime(position)}
          </Text>
          <Text className="text-sm text-typography-500">
            -{formatTime(timeRemaining)}
          </Text>
        </HStack>
        
        {/* Repeat Counter */}
        {count > 1 && (
          <HStack className="justify-center items-center">
            <Text className="text-sm text-typography-500">
              {currentRepeat + 1} / {count}
            </Text>
          </HStack>
        )}

        {/* Controls */}
        <HStack className="justify-center items-center" space="lg">
          <Button
            size="lg"
            action="primary"
            variant="solid"
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            <ButtonIcon as={isPlaying ? Pause : Play} />
          </Button>

          <Button
            size="lg"
            action="secondary"
            variant="solid"
            onPress={handleStop}
            disabled={isLoading || !isPlaying}
          >
            <ButtonIcon as={Square} />
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}