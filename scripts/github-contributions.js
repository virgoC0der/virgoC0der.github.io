const fs = require('node:fs/promises');
const path = require('node:path');

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const DEFAULT_TIME_ZONE = 'Asia/Singapore';
const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `
query GitHubContributions($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            weekday
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}
`;

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function datePartsInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  }).formatToParts(date);

  return parts.reduce((result, part) => {
    if (part.type === 'day' || part.type === 'month' || part.type === 'year') {
      result[part.type] = Number(part.value);
    }
    return result;
  }, {});
}

function utcDateFromParts({ year, month, day }) {
  return new Date(Date.UTC(year, month - 1, day));
}

function addCalendarYears(date, years) {
  const copy = new Date(date.getTime());
  copy.setUTCFullYear(copy.getUTCFullYear() + years);
  return copy;
}

function getPastYearRange(now = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const toDay = utcDateFromParts(datePartsInTimeZone(now, timeZone));
  const fromDay = addCalendarYears(toDay, -1);
  const toEnd = new Date(toDay.getTime() + 24 * 60 * 60 * 1000 - 1);

  return {
    from: fromDay.toISOString(),
    to: toEnd.toISOString(),
    fromDate: isoDate(fromDay),
    toDate: isoDate(toDay),
  };
}

function monthLabel(dateString) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${dateString}T00:00:00.000Z`));
}

function weekdayFromDate(dateString) {
  return new Date(`${dateString}T00:00:00.000Z`).getUTCDay();
}

function transformContributionCalendar({ username, range, calendar, generatedAt }) {
  const weeks = calendar.weeks.map((week) => ({
    days: week.contributionDays.reduce((days, day) => {
      const weekday = day.weekday ?? weekdayFromDate(day.date);
      days[weekday] = {
        date: day.date,
        count: day.contributionCount,
        level: LEVELS[day.contributionLevel] ?? 0,
      };
      return days;
    }, Array.from({ length: 7 }, () => ({ empty: true, level: 0 }))),
  }));

  const months = [];
  let lastMonth = '';
  weeks.forEach((week, index) => {
    const firstDay = week.days.find((day) => !day.empty);
    if (!firstDay) return;
    const label = monthLabel(firstDay.date);
    if (label !== lastMonth) {
      months.push({ label, column: index + 1 });
      lastMonth = label;
    }
  });

  return {
    username,
    generatedAt,
    range: {
      from: range.fromDate,
      to: range.toDate,
    },
    totalContributions: calendar.totalContributions,
    weekCount: weeks.length,
    months,
    weeks,
  };
}

async function buildContributionData({
  username,
  token,
  now = new Date(),
  fetchImpl = fetch,
  timeZone = DEFAULT_TIME_ZONE,
}) {
  if (!token) {
    throw new Error('GITHUB_TOKEN is required to fetch GitHub contribution data.');
  }

  const range = getPastYearRange(now, timeZone);
  const response = await fetchImpl(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        username,
        from: range.from,
        to: range.to,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed with HTTP ${response.status}.`);
  }

  const payload = await response.json();
  if (payload.errors && payload.errors.length > 0) {
    throw new Error(`GitHub GraphQL request returned ${payload.errors.length} error(s).`);
  }

  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    throw new Error(`GitHub contribution calendar was not found for ${username}.`);
  }

  return transformContributionCalendar({
    username,
    range,
    calendar,
    generatedAt: now.toISOString(),
  });
}

async function main() {
  const username = process.env.GITHUB_CONTRIBUTIONS_USERNAME || 'virgoC0der';
  const timeZone = process.env.GITHUB_CONTRIBUTIONS_TIME_ZONE || DEFAULT_TIME_ZONE;
  const token = process.env.GITHUB_TOKEN;
  const outputPath = path.resolve(process.cwd(), 'data/github_contributions.json');
  const data = await buildContributionData({ username, token, timeZone });

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Wrote GitHub contribution data for ${username} (${data.range.from} to ${data.range.to}).`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  buildContributionData,
  getPastYearRange,
  transformContributionCalendar,
};
