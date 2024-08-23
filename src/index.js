import { format, addDays, subDays, startOfWeek } from 'date-fns';
import "@logseq/libs";

// Weeks start with Monday which is day 1
const weekStartIndex = 1; // Monday

function startOfWeekFromDate(date) {
  return startOfWeek(date, { weekStartsOn: weekStartIndex });
}

function durationFromDays(days) {
  return days;
}

function dayHasPassed(dayNumber) {
  const today = new Date();
  const todayDayNumber = today.getDay();
  return dayNumber < todayDayNumber || (dayNumber === 0 && todayDayNumber !== 0);
}

function dayIsToday(dayNumber) {
  const today = new Date();
  const todayDayNumber = today.getDay();
  return dayNumber === todayDayNumber;
}

function dateOfPreviousWeekdayWith(dayNumber) {
  const currentDate = new Date();
  if (dayHasPassed(dayNumber)) {
    return addDays(startOfWeekFromDate(currentDate), dayNumber - weekStartIndex);
  } else {
    return subDays(startOfWeekFromDate(currentDate), 7 - dayNumber + weekStartIndex);
  }
}

function dateOfNextWeekdayWith(dayNumber) {
  const currentDate = new Date();
  if (dayHasPassed(dayNumber) || dayIsToday(dayNumber)) {
    const startOfNextWeek = addDays(startOfWeekFromDate(currentDate), 7);
    return addDays(startOfNextWeek, dayNumber - weekStartIndex);
  } else {
    return addDays(startOfWeekFromDate(currentDate), dayNumber - weekStartIndex);
  }
}

async function addDateToLogseq(date) {
  const { preferredDateFormat } = await logseq.App.getUserConfigs();
  logseq.ready(main).catch(console.error);
  await logseq.Editor.insertAtEditingCursor(`[[${format(date, preferredDateFormat)}]] `);
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
