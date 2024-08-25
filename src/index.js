import { format, addDays, subDays, startOfWeek } from "date-fns";
import "@logseq/libs";
import {
  nextFriday,
  nextSaturday,
  nextSunday,
  nextMonday,
  nextTuesday,
  nextWednesday,
  nextThursday,
} from "date-fns/fp";

async function addDateToLogseq(date) {
  const { preferredDateFormat } = await logseq.App.getUserConfigs();
  logseq.ready(main).catch(console.error);
  await logseq.Editor.insertAtEditingCursor(
    `[[${format(date, preferredDateFormat)}]] `,
  );
}

// 8 needs to be used instead of 7 so that when today is Friday
// the command Last Friday resolves to last weeks Friday instead of today
const lastWeekOffset = 8;

const slashCommandFunctionMap = {
  "Last Monday": async () => {
    await addDateToLogseq(nextMonday(subDays(new Date(), lastWeekOffset)));
  },
  "Last Tuesday": async () => {
    await addDateToLogseq(nextTuesday(subDays(new Date(), lastWeekOffset)));
  },
  "Last Wednesday": async () => {
    await addDateToLogseq(nextWednesday(subDays(new Date(), lastWeekOffset)));
  },
  "Last Thursday": async () => {
    await addDateToLogseq(nextThursday(subDays(new Date(), lastWeekOffset)));
  },
  "Last Friday": async () => {
    await addDateToLogseq(nextFriday(subDays(new Date(), lastWeekOffset)));
  },
  "Last Saturday": async () => {
    await addDateToLogseq(nextSaturday(subDays(new Date(), lastWeekOffset)));
  },
  "Last Sunday": async () => {
    await addDateToLogseq(nextSunday(subDays(new Date(), lastWeekOffset)));
  },
  "Next Monday": async () => {
    await addDateToLogseq(nextMonday(new Date()));
  },
  "Next Tuesday": async () => {
    await addDateToLogseq(nextTuesday(new Date()));
  },
  "Next Wednesday": async () => {
    await addDateToLogseq(nextWednesday(new Date()));
  },
  "Next Thursday": async () => {
    await addDateToLogseq(nextThursday(new Date()));
  },
  "Next Friday": async () => {
    await addDateToLogseq(nextFriday(new Date()));
  },
  "Next Saturday": async () => {
    await addDateToLogseq(nextSaturday(new Date()));
  },
  "Next Sunday": async () => {
    await addDateToLogseq(nextSunday(new Date()));
  },
};

function main() {
  for (const [command, async_function] of Object.entries(
    slashCommandFunctionMap,
  )) {
    logseq.Editor.registerSlashCommand(command, async_function);
  }
}

// bootstrap
logseq.ready(main).catch(console.error);
