const { DateTime, Duration } = require("luxon");
import "@logseq/libs";

// Weeks start with Monday which is day 1
const weekStartIndex = 1

function startOfWeek(date) {
  const durationUntillStartOfWeek = durationFromDays(date.weekday - weekStartIndex);
  return date.minus(durationUntillStartOfWeek);
}

function durationFromDays(days) {
  return Duration.fromObject({ days: days});
}

function dayHasPassed(dayNumber) {
  return dayNumber < DateTime.local().weekday
}

function dayIsToday(dayNumber) {
  return dayNumber === DateTime.local().weekday
}

function dateOfPreviousWeekdayWith(dayNumber) {
  const currentDate = DateTime.local();
  if(dayHasPassed(dayNumber)) {
    return startOfWeek(currentDate).plus(durationFromDays(dayNumber - weekStartIndex));
  } else {
    return startOfWeek(currentDate).minus(durationFromDays(7 - dayNumber + weekStartIndex));
  }
}

function dateOfNextWeekdayWith(dayNumber) {
  const currentDate = DateTime.local();
  if(dayHasPassed(dayNumber) || dayIsToday(dayNumber)) {
    const startOfNextWeek = startOfWeek(currentDate.plus(durationFromDays(7)))
    return startOfNextWeek.plus(durationFromDays(dayNumber - weekStartIndex));
  } else {
    return startOfWeek(currentDate).plus(durationFromDays(dayNumber - weekStartIndex));
  }
}

async function addDateToLogseq(date) {
  const { preferredDateFormat } = await logseq.App.getUserConfigs();
  logseq.ready(main).catch(console.error)
  await logseq.Editor.insertAtEditingCursor(`[[${date.toFormat(preferredDateFormat) }]] `)
}

const slashCommandFunctionMap = {
  'Last Monday': async () => { await addDateToLogseq(dateOfPreviousWeekdayWith(weekStartIndex)) },
  'Last Tuesday': async () => { await addDateToLogseq(dateOfPreviousWeekdayWith(weekStartIndex + 1)) },
  'Last Wednesday': async () => { await addDateToLogseq(dateOfPreviousWeekdayWith(weekStartIndex + 2)) },
  'Last Thursday': async () => { await addDateToLogseq(dateOfPreviousWeekdayWith(weekStartIndex + 3)) },
  'Last Friday': async () => { await addDateToLogseq(dateOfPreviousWeekdayWith(weekStartIndex + 4)) },
  'Last Saturday': async () => { await addDateToLogseq(dateOfPreviousWeekdayWith(weekStartIndex + 5)) },
  'Last Sunday': async () => { await addDateToLogseq(dateOfPreviousWeekdayWith(weekStartIndex + 6)) },
  'Next Monday': async () => { await addDateToLogseq(dateOfNextWeekdayWith(weekStartIndex)) },
  'Next Tuesday': async () => { await addDateToLogseq(dateOfNextWeekdayWith(weekStartIndex + 1)) },
  'Next Wednesday': async () => { await addDateToLogseq(dateOfNextWeekdayWith(weekStartIndex + 2)) },
  'Next Thursday': async () => { await addDateToLogseq(dateOfNextWeekdayWith(weekStartIndex + 3)) },
  'Next Friday': async () => { await addDateToLogseq(dateOfNextWeekdayWith(weekStartIndex + 4)) },
  'Next Saturday': async () => { await addDateToLogseq(dateOfNextWeekdayWith(weekStartIndex + 5)) },
  'Next Sunday': async () => { await addDateToLogseq(dateOfNextWeekdayWith(weekStartIndex + 6)) },
}

function main () {
  for (const [command, async_function] of Object.entries(slashCommandFunctionMap)) {
    logseq.Editor.registerSlashCommand(command, async_function)
  };
}

// bootstrap
logseq.ready(main).catch(console.error)
