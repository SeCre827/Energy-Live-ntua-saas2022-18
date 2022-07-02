import { DateTime } from 'luxon';

export function messageLog(message: string) {
  console.log(
    '[' +
      DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS) +
      '] ' +
      message,
  );
}
