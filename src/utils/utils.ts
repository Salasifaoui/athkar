import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function renderNameMonth(date: string) {
  const month = date.split("-")[1];
  // const monthName = month.split(" ")[0];
  switch (month) {
    case "1":
      return "يناير";
    case "2":
      return "فبراير";
    case "3":
      return "مارس";
    case "4":
      return "أبريل";
    case "5":
      return "مايو";
    case "6":
      return "يونيو";
    case "7":
      return "يوليو";
    case "8":
      return "أغسطس";
    case "9":
      return "سبتمبر";
    case "10":
      return "أكتوبر";
    case "11":
      return "نوفمبر";
    case "12":
      return "ديسمبر";
  }
  return '';
}

export function renderNameMonthHijri(date: string) {
  const month = date.split("-")[1];
  const monthName = parseInt(month);
  switch (monthName) {
    case 1:
      return "محرم";
    case 2:
      return "صفر";
    case 3:
      return "ربيع الأول";
    case 4:
      return "ربيع الثاني";
    case 5:
      return "جمادى الأولى";
    case 6:
      return "جمادى الثانية";
    case 7:
      return "رجب";
    case 8:
      return "شعبان";
    case 9:
      return "رمضان";
    case 10:
      return "شوال";
    case 11:
      return "ذو القعدة";
    case 12:
      return "ذو الحجة";
  }
  return "غير معروف";
}
