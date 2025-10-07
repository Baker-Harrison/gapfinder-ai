import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function getMasteryColor(mastery: number): string {
  if (mastery >= 80) return 'hsl(142, 76%, 36%)'; // green
  if (mastery >= 70) return 'hsl(48, 96%, 53%)'; // yellow
  if (mastery >= 50) return 'hsl(25, 95%, 53%)'; // orange
  return 'hsl(0, 84%, 60%)'; // red
}

export function getMasteryLabel(mastery: number): string {
  if (mastery >= 80) return 'Strong';
  if (mastery >= 70) return 'Developing';
  if (mastery >= 50) return 'Weak';
  return 'Critical Gap';
}
