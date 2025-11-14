import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import ZixDialogueBox from "@/src/components/ZixDialogueBox";
import { PrayerTimeRecord } from "@/src/features/prayers/db/start";
import { useSelectedCitySafe } from "@/src/features/prayers/hooks/useSelectedCity";
import { prayerService } from "@/src/features/prayers/services/prayerService";
import { City } from "@/src/types/city";
import { renderNameMonth, renderNameMonthHijri } from "@/src/utils/utils";
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Power,
    Printer,
    Share2,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import NetworkError from "./network-error";

interface ListPrayersInMonthProps {
  selectedCity?: City | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ListPrayersInMonth({
  selectedCity: propSelectedCity,
  isOpen,
  onClose,
}: ListPrayersInMonthProps) {
  // Use safe hook that doesn't throw if context is not available
  const context = useSelectedCitySafe();
  const contextSelectedCity = context?.selectedCity ?? null;

  // Prefer prop over context (prop takes precedence)
  const selectedCity =
    propSelectedCity !== undefined ? propSelectedCity : contextSelectedCity;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [hijriMonthName, setHijriMonthName] = useState<string>("");
  const [hijriYear, setHijriYear] = useState<string>("");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const loadPrayerTimes = useCallback(
    async (year: number, month: number) => {
      if (!selectedCity) return;

      setLoading(true);
      setError(null);
      setHasNetworkError(false);

      try {
        const result = await prayerService.getOrFetchPrayerTimesByMonth(
          selectedCity,
          year,
          month
        );

        if (result.data.length === 0 && !result.fromCache) {
          // No data and not from cache means no network
          setHasNetworkError(true);
          setPrayerTimes([]);
        } else {
          setPrayerTimes(result.data);
          setHasNetworkError(false);

          // Extract Hijri month and year from first record
          if (result.data.length > 0) {
            const firstRecord = result.data[0];
            if (firstRecord.date_hijri) {
              try {
                const hijriParts = firstRecord.date_hijri.split("-");
                if (hijriParts.length >= 2) {
                  const hijriYearNum = hijriParts[2] || hijriParts[0];
                  setHijriMonthName(
                    renderNameMonthHijri(firstRecord.date_hijri)
                  );
                  setHijriYear(hijriYearNum);
                }
              } catch (e) {
                console.error("Error parsing Hijri date:", e);
              }
            }
          }
        }
      } catch (err: any) {
        console.error("Error loading prayer times:", err);
        setError(err.message || "حدث خطأ أثناء تحميل البيانات");
        setHasNetworkError(true);
      } finally {
        setLoading(false);
      }
    },
    [selectedCity]
  );

  useEffect(() => {
    loadPrayerTimes(currentYear, currentMonth);
  }, [currentYear, currentMonth, loadPrayerTimes]);

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const parseDate = (
    dateStr: string
  ): { day: number; month: number; year: number } | null => {
    try {
      // Try to parse as JSON first
      try {
        const dateObj = JSON.parse(dateStr);
        return {
          day: parseInt(dateObj.day || dateObj.date?.split("-")[0] || "1"),
          month:
            dateObj.month?.number || parseInt(dateStr.split("-")[1] || "1"),
          year: parseInt(
            dateObj.year ||
              dateStr.split("-")[2] ||
              new Date().getFullYear().toString()
          ),
        };
      } catch {
        // Not JSON, try to parse as DD-MM-YYYY
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const year = parseInt(parts[2]);

          // If day > 12, it's DD-MM-YYYY format
          if (day > 12) {
            return { day, month, year };
          } else {
            // Could be YYYY-MM-DD
            if (year > 1000) {
              return { day: day, month: month, year: year };
            } else {
              // DD-MM-YYYY
              return { day: day, month: month, year: parseInt(parts[2]) };
            }
          }
        }
      }
    } catch (e) {
      console.error("Error parsing date:", e);
    }
    return null;
  };

  const formatHijriDate = (hijriDateStr: string): string => {
    try {
      const parts = hijriDateStr.split("-");
      if (parts.length >= 2) {
        return `${parts[0]} ${renderNameMonthHijri(hijriDateStr)}`;
      }
    } catch (e) {
      console.error("Error formatting Hijri date:", e);
    }
    return hijriDateStr;
  };

  const formatGregorianDate = (dateStr: string): string => {
    const parsed = parseDate(dateStr);
    if (parsed) {
      return `${parsed.day} ${renderNameMonth(dateStr)}`;
    }
    return dateStr;
  };

  const getDayName = (nameArabic: string): string => {
    // Extract day name from Arabic weekday name
    return nameArabic || "";
  };

  return (
    <ZixDialogueBox
      isOpen={isOpen}
      onClose={onClose}
      header={
        <Box className="bg-primary-500 rounded-t-2xl overflow-hidden">
          <VStack className="gap-4 p-4">
            {/* Hijri Month Header */}
            <HStack className="items-center justify-between w-full">
              <Pressable
                onPress={() => navigateMonth("next")}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Icon as={ChevronLeft} size={20} className="text-white" />
              </Pressable>

              <Text className="text-white text-xl font-bold text-center">
                {hijriMonthName} {hijriYear}
              </Text>
              <Pressable
                onPress={() => navigateMonth("prev")}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Icon as={ChevronRight} size={20} className="text-white" />
              </Pressable>
            </HStack>

            {/* Location */}
            {selectedCity && (
              <HStack className="items-center justify-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Icon as={MapPin} size={16} className="text-white" />
                <Text className="text-white text-base font-medium">
                  {selectedCity.name}
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>
      }
      footer={
        <HStack className="justify-between w-full p-2">
          <Pressable
            onPress={() => {}}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Icon as={Share2} size={28} className="text-primary-500" />
          </Pressable>
          <Pressable
            onPress={() => {}}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Icon as={Printer} size={28} className="text-primary-500" />
          </Pressable>
          <Pressable
              onPress={() => {}}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Icon as={Power} size={28} className="text-primary-500" />
            </Pressable>
        </HStack>

      }
    >
      {/* Header Section */}

      {/* Content Section */}
      {loading ? (
        <VStack className="items-center justify-center py-12">
          <Spinner size="large" className="text-primary-500" />
          <Text className="text-gray-600 mt-4">جاري التحميل...</Text>
        </VStack>
      ) : hasNetworkError ? (
        <NetworkError
          onRetry={() => loadPrayerTimes(currentYear, currentMonth)}
        />
      ) : prayerTimes.length === 0 ? (
        <Box className="bg-white/10 rounded-xl p-6 m-4">
          <Text className="text-white text-center text-lg">
            لا توجد بيانات متاحة
          </Text>
        </Box>
      ) : (
        <ScrollView className="h-[450px]">
            <ScrollView horizontal>
          <Box className="bg-white rounded-b-2xl overflow-hidden">
            {/* Table Header */}
            <HStack className="bg-gray-100 border-b border-gray-200">
              <Box className="w-20 px-3 py-3 border-r border-gray-200">
                <Text className="text-gray-700 font-bold text-sm text-center">
                  اليوم
                </Text>
              </Box>
              <Box className="w-24 px-3 py-3 border-r border-gray-200">
                <Text className="text-gray-700 font-bold text-sm text-center">
                  م/هـ
                </Text>
              </Box>
              <Box className="w-20 px-3 py-3 border-r border-gray-200">
                <Text className="text-gray-700 font-bold text-sm text-center">
                  الفجر
                </Text>
              </Box>
              <Box className="w-20 px-3 py-3 border-r border-gray-200">
                <Text className="text-gray-700 font-bold text-sm text-center">
                  الظهر
                </Text>
              </Box>
              <Box className="w-20 px-3 py-3 border-r border-gray-200">
                <Text className="text-gray-700 font-bold text-sm text-center">
                  العصر
                </Text>
              </Box>
              <Box className="w-20 px-3 py-3 border-r border-gray-200">
                <Text className="text-gray-700 font-bold text-sm text-center">
                  المغرب
                </Text>
              </Box>
              <Box className="w-20 px-3 py-3">
                <Text className="text-gray-700 font-bold text-sm text-center">
                  العشاء
                </Text>
              </Box>
            </HStack>

            {/* Table Rows */}
            {prayerTimes.map((record, index) => (
              <HStack
                key={record.id || index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <Box className="w-20 px-3 py-3 border-r border-gray-200">
                  <Text className="text-gray-800 text-sm text-center">
                    {getDayName(record.nameArabic)}
                  </Text>
                </Box>
                <Box className="w-24 px-3 py-3 border-r border-gray-200 gap-2">
                  <Text className="text-gray-800 text-sm text-center">
                    {formatGregorianDate(record.date)} 
                  </Text>
                  <Divider className="w-full bg-gray-200" />
                  <Text className="text-gray-800 text-sm text-center">
                    {formatHijriDate(record.date_hijri || "")}
                  </Text>
                </Box>
                <Box className="w-20 px-3 py-3 border-r border-gray-200">
                  <Text className="text-gray-800 text-sm text-center font-mono">
                    {record.fajr}
                  </Text>
                </Box>
                <Box className="w-20 px-3 py-3 border-r border-gray-200">
                  <Text className="text-gray-800 text-sm text-center font-mono">
                    {record.dhuhr}
                  </Text>
                </Box>
                <Box className="w-20 px-3 py-3 border-r border-gray-200">
                  <Text className="text-gray-800 text-sm text-center font-mono">
                    {record.asr}
                  </Text>
                </Box>
                <Box className="w-20 px-3 py-3 border-r border-gray-200">
                  <Text className="text-gray-800 text-sm text-center font-mono">
                    {record.maghrib}
                  </Text>
                </Box>
                <Box className="w-20 px-3 py-3">
                  <Text className="text-gray-800 text-sm text-center font-mono">
                    {record.isha}
                  </Text>
                </Box>
              </HStack>
            ))}
          </Box>
          </ScrollView>
        </ScrollView>
      )}

      {error && !hasNetworkError && (
        <Box className="bg-red-100 rounded-xl p-4 m-4">
          <Text className="text-red-800 text-center">{error}</Text>
        </Box>
      )}
    </ZixDialogueBox>
  );
}
