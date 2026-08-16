/**
 * Native Android notification layer via @capacitor/local-notifications.
 *
 * On Android (production): uses native Android notification system.
 *   - Works when app is closed, screen locked, no internet.
 *   - Notifications are truly scheduled in the OS.
 *
 * On web (development): uses the Web Notifications API fallback
 *   provided by the Capacitor plugin. Requires browser permission.
 *
 * IMPORTANT: The Daily Check notification (id=3) must be cancelled and
 * rescheduled every time a daily task is toggled. This is the only way to
 * keep the notification body text current — Android fires notifications with
 * whatever text was set at schedule time; there is no background JS execution.
 */

// ─── Constants ─────────────────────────────────────────────────────────────────

export const NOTIFICATION_IDS = {
  BODY:        1,
  PHILOSOPHY:  2,
  DAILY_CHECK: 3,
};

// ─── Plugin access ─────────────────────────────────────────────────────────────

/**
 * Lazily imports the Capacitor LocalNotifications plugin.
 * Returns null if unavailable (e.g., Capacitor not present in SSR/test env).
 */
async function getPlugin() {
  try {
    const mod = await import('@capacitor/local-notifications');
    return mod.LocalNotifications;
  } catch {
    return null;
  }
}

// ─── Permission ────────────────────────────────────────────────────────────────

/**
 * Requests notification permission from the user.
 * @returns {Promise<boolean>} true if granted
 */
export async function requestNotificationPermission() {
  const plugin = await getPlugin();
  if (!plugin) return false;
  try {
    const { display } = await plugin.requestPermissions();
    return display === 'granted';
  } catch (err) {
    console.error('[Notifications] requestPermissions failed:', err);
    return false;
  }
}

/**
 * Checks the current notification permission status.
 * @returns {Promise<'granted'|'denied'|'prompt'|'unavailable'>}
 */
export async function checkNotificationPermission() {
  const plugin = await getPlugin();
  if (!plugin) return 'unavailable';
  try {
    const { display } = await plugin.checkPermissions();
    return display;
  } catch {
    return 'unavailable';
  }
}

// ─── Scheduling ────────────────────────────────────────────────────────────────

/**
 * Schedules a recurring daily reminder at the specified local time.
 * Cancels any existing notification with the same id first.
 *
 * @param {number} id      Unique notification ID
 * @param {string} title   Notification title
 * @param {string} body    Notification body
 * @param {string} time    "HH:MM" local time
 */
export async function scheduleReminder(id, title, body, time) {
  const plugin = await getPlugin();
  if (!plugin) return;

  const [hourStr, minuteStr] = time.split(':');
  const hour   = parseInt(hourStr,   10);
  const minute = parseInt(minuteStr, 10);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    console.error(`[Notifications] Invalid time string: "${time}"`);
    return;
  }

  try {
    // Always cancel first so we never accumulate duplicate schedules
    await plugin.cancel({ notifications: [{ id }] });

    await plugin.schedule({
      notifications: [{
        id,
        title,
        body,
        schedule: {
          on:      { hour, minute },
          repeats: true,
          allowWhileIdle: true,
        },
        sound: null,
        iconColor: '#c4821a',
      }],
    });
  } catch (err) {
    console.error(`[Notifications] schedule(id=${id}) failed:`, err);
  }
}

/**
 * Cancels a scheduled notification by ID.
 * @param {number} id
 */
export async function cancelReminder(id) {
  const plugin = await getPlugin();
  if (!plugin) return;
  try {
    await plugin.cancel({ notifications: [{ id }] });
  } catch (err) {
    console.error(`[Notifications] cancel(id=${id}) failed:`, err);
  }
}

// ─── Daily Check smart rescheduling ───────────────────────────────────────────

/**
 * Cancels and reschedules the Daily Check notification with current progress.
 *
 * Call this every time any daily task is toggled so that the notification
 * body text accurately reflects the completion count at fire time.
 *
 * @param {{ body: boolean, philosophy: boolean, art: boolean, history: boolean }} todayRecord
 * @param {string}  time     "HH:MM"
 * @param {boolean} enabled  Whether the Daily Check reminder is enabled
 */
export async function rescheduleDailyCheck(todayRecord, time, enabled) {
  if (!enabled) {
    await cancelReminder(NOTIFICATION_IDS.DAILY_CHECK);
    return;
  }

  const score = [
    todayRecord.body,
    todayRecord.philosophy,
    todayRecord.art,
    todayRecord.history,
  ].filter(Boolean).length;

  const notifBody = score === 4
    ? 'Day complete. Well done.'
    : `Your day isn't finished yet. ${score}/4 complete.`;

  await scheduleReminder(
    NOTIFICATION_IDS.DAILY_CHECK,
    'Year End Goals',
    notifBody,
    time,
  );
}

// ─── Bulk scheduling ───────────────────────────────────────────────────────────

/**
 * Schedules (or cancels) all reminders based on the saved configuration.
 * Pass today's record so the Daily Check text is accurate.
 *
 * @param {Array<{id: number, label: string, time: string, enabled: boolean}>} reminders
 * @param {{ body: boolean, philosophy: boolean, art: boolean, history: boolean }} todayRecord
 */
export async function scheduleAllReminders(reminders, todayRecord = {}) {
  const labelBodies = {
    [NOTIFICATION_IDS.BODY]:       'Time for your body practice.',
    [NOTIFICATION_IDS.PHILOSOPHY]: 'Time for your philosophy practice.',
  };

  for (const reminder of reminders) {
    if (!reminder.enabled) {
      await cancelReminder(reminder.id);
      continue;
    }

    if (reminder.id === NOTIFICATION_IDS.DAILY_CHECK) {
      await rescheduleDailyCheck(todayRecord, reminder.time, true);
    } else {
      const body = labelBodies[reminder.id] ?? `Time for your ${reminder.label.toLowerCase()} practice.`;
      await scheduleReminder(reminder.id, 'Year End Goals', body, reminder.time);
    }
  }
}
