import moment from "moment";
import { dateParseJsToAspDate } from "./UseDateParser";
export interface IScheduleGeneratorPayload {
  start_date: Date | null;
  end_date: Date | null;
  start_time: Date | null;
  end_time: Date | null;
  freq: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  range_type: "d" | "s";
  tilldate: Date | null;
  tillsession: number;
  daysofweek: Array<number>;
}

export interface IGeneratedDates {
  included?: boolean;
  start_date: Date;
  end_date: Date;
  start_time: Date | null;
  end_time: Date | null;
}

export const genDailyDates = (
  schedulePayload: IScheduleGeneratorPayload
): Array<IGeneratedDates> => {
  const {
    start_date,
    end_date,
    start_time,
    end_time,
    interval,
    tilldate,
    tillsession,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<IGeneratedDates> = [];

  if (start_date === null) {
    return [];
  }

  let tempStartDate = start_date;
  let tempEndDate = end_date;

  if (schedulePayload.range_type === "d") {
    if (tilldate === null) {
      return [];
    }

    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
    } while (
      moment(moment(tempStartDate).format("LL")).isSameOrBefore(
        moment(moment(tilldate).format("LL"))
      )
    );
  } else if (schedulePayload.range_type === "s") {
    if (tillsession === null) {
      return [];
    }

    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
      counter++;
    } while (counter < tillsession);
  }

  return dates;
};

export const genWeeklyDates = (
  schedulePayload: IScheduleGeneratorPayload
): Array<IGeneratedDates> => {
  const {
    start_date,
    interval,
    tilldate,
    tillsession,
    daysofweek,
    end_date,
    start_time,
    end_time,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<IGeneratedDates> = [];

  if (start_date === null) {
    return [];
  }

  let tempStartDate = start_date;
  let tempEndDate = end_date;

  if (schedulePayload.range_type === "d") {
    if (tilldate === null) {
      return [];
    }
    do {
      let found: boolean = false;
      for (let i: number = 0; i < daysofweek.length; i++) {
        const dayOfWeekStartDate: number = moment(tempStartDate).day();
        if (dayOfWeekStartDate === daysofweek[i]) {
          found = true;
        }
      }

      if (found) {
        dates.push({
          included: true,
          start_date: tempStartDate,
          end_date: tempEndDate,
          start_time: start_time,
          end_time: end_time,
        });
      }
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();

      if (tempEndDate instanceof Date) {
        tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
          .add(interval, "days")
          .toDate();
      }
    } while (
      moment(moment(tempStartDate).format("LL")).isSameOrBefore(
        moment(moment(tilldate).format("LL"))
      )
    );
  } else if (schedulePayload.range_type === "s") {
    if (tillsession === null) {
      return [];
    }
    do {
      let found: boolean = false;

      for (let i: number = 0; i < daysofweek.length; i++) {
        const dayOfWeekStartDate: number = moment(tempStartDate).day();
        if (dayOfWeekStartDate === daysofweek[i]) {
          found = true;
        }
      }

      if (found) {
        dates.push({
          included: true,
          start_date: tempStartDate,
          end_date: tempEndDate,
          start_time: start_time,
          end_time: end_time,
        });
        counter++;
      }
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "days")
        .toDate();
      if (tempEndDate instanceof Date) {
        tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
          .add(interval, "days")
          .toDate();
      }
    } while (counter < tillsession);
  }

  return dates;
};

export const genMonthlyDates = (
  schedulePayload: IScheduleGeneratorPayload
): Array<IGeneratedDates> => {
  const {
    start_date,
    interval,
    tilldate,
    tillsession,
    end_date,
    start_time,
    end_time,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<IGeneratedDates> = [];

  if (start_date === null) {
    return [];
  }

  let tempStartDate = start_date;
  let tempEndDate = end_date;

  if (schedulePayload.range_type === "d") {
    if (tilldate === null) {
      return [];
    }

    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "months")
        .toDate();

      if (tempEndDate instanceof Date) {
        tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
          .add(interval, "months")
          .toDate();
      }
    } while (
      moment(moment(tempStartDate).format("LL")).isSameOrBefore(
        moment(moment(tilldate).format("LL"))
      )
    );
  } else if (schedulePayload.range_type === "s") {
    if (tillsession === null) {
      return [];
    }
    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "months")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "months")
        .toDate();
      counter++;
    } while (counter < tillsession);
  }

  return dates;
};

export const genYearlyDates = (
  schedulePayload: IScheduleGeneratorPayload
): Array<IGeneratedDates> => {
  const {
    start_date,
    interval,
    tilldate,
    tillsession,
    end_date,
    start_time,
    end_time,
  } = schedulePayload;

  let counter: number = 0;
  const dates: Array<IGeneratedDates> = [];

  if (
    start_date === null ||
    end_date === null ||
    start_time === null ||
    end_time === null
  ) {
    return [];
  }

  let tempStartDate = start_date;
  let tempEndDate = end_date;

  if (schedulePayload.range_type === "d") {
    if (tilldate === null) {
      return [];
    }

    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "years")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "years")
        .toDate();
    } while (
      moment(moment(tempStartDate).format("LL")).isSameOrBefore(
        moment(moment(tilldate).format("LL"))
      )
    );
  } else if (schedulePayload.range_type === "s") {
    if (tillsession === null) {
      return [];
    }
    do {
      dates.push({
        included: true,
        start_date: tempStartDate,
        end_date: tempEndDate,
        start_time: start_time,
        end_time: end_time,
      });
      tempStartDate = moment(tempStartDate, "DD/MM/YYYY")
        .add(interval, "years")
        .toDate();
      tempEndDate = moment(tempEndDate, "DD/MM/YYYY")
        .add(interval, "years")
        .toDate();
      counter++;
    } while (counter < tillsession);
  }

  return dates;
};
