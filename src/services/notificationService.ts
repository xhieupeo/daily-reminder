export const notificationService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  },

  sendTimerNotification(modeFinished: 'focus' | 'shortBreak' | 'longBreak'): void {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    try {
      if (modeFinished === 'focus') {
        new Notification('🔔 Focus Session Finished!', {
          body: 'Awesome focus, Xuan Hieu! Time for a refreshing break 🍵.',
          icon: '/study_icon.jpg',
          badge: '/favicon.svg',
          tag: 'pomodoro-focus-complete',
        });
      } else {
        new Notification('🌸 Break Time Finished!', {
          body: "Break's over! Ready to jump back in and conquer your tasks? 💻",
          icon: '/study_icon.jpg',
          badge: '/favicon.svg',
          tag: 'pomodoro-break-complete',
        });
      }
    } catch (err) {
      console.warn('Failed to send browser notification:', err);
    }
  },
};

