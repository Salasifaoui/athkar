export function formatDate(date: string | Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Less than 1 minute
  if (diffInMinutes < 1) {
    return 'الآن';
  }

  // Less than 1 hour
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  }

  // Less than 24 hours
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  }

  // Less than 7 days
  if (diffInDays < 7) {
    return `منذ ${diffInDays} يوم`;
  }

  // More than 7 days - show actual date
  return messageDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  const messageDate = new Date(date);
  return messageDate.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateTime(date: string | Date): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Today
  if (diffInDays === 0) {
    return `اليوم ${formatTime(date)}`;
  }

  // Yesterday
  if (diffInDays === 1) {
    return `أمس ${formatTime(date)}`;
  }

  // More than 1 day
  return messageDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'الآن';
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}د`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}س`;
  }

  if (diffInDays < 7) {
    return `${diffInDays}ي`;
  }

  return messageDate.toLocaleDateString('ar-SA', {
    month: 'short',
    day: 'numeric',
  });
}
