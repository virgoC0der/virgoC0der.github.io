const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  buildContributionData,
  getPastYearRange,
  transformContributionCalendar,
} = require('./github-contributions');

test('getPastYearRange uses the current UTC day and goes back one calendar year', () => {
  const range = getPastYearRange(new Date('2026-06-03T13:52:37+08:00'));

  assert.equal(range.from, '2025-06-03T00:00:00.000Z');
  assert.equal(range.to, '2026-06-03T23:59:59.999Z');
  assert.equal(range.fromDate, '2025-06-03');
  assert.equal(range.toDate, '2026-06-03');
});

test('getPastYearRange defaults to the site timezone instead of the runner UTC day', () => {
  const range = getPastYearRange(new Date('2026-06-03T00:30:00+08:00'));

  assert.equal(range.fromDate, '2025-06-03');
  assert.equal(range.toDate, '2026-06-03');
});

test('transformContributionCalendar maps GitHub weeks into renderable heatmap data', () => {
  const calendar = {
    totalContributions: 7,
    weeks: [
      {
        contributionDays: [
          { date: '2025-06-01', contributionCount: 1, contributionLevel: 'FIRST_QUARTILE' },
          { date: '2025-06-02', contributionCount: 2, contributionLevel: 'SECOND_QUARTILE' },
        ],
      },
      {
        contributionDays: [
          { date: '2025-06-08', contributionCount: 0, contributionLevel: 'NONE' },
          { date: '2025-06-09', contributionCount: 5, contributionLevel: 'FOURTH_QUARTILE' },
        ],
      },
    ],
  };

  const data = transformContributionCalendar({
    username: 'virgoC0der',
    range: {
      fromDate: '2025-06-03',
      toDate: '2026-06-03',
    },
    calendar,
    generatedAt: '2026-06-03T06:00:00.000Z',
  });

  assert.equal(data.username, 'virgoC0der');
  assert.equal(data.totalContributions, 7);
  assert.equal(data.weekCount, 2);
  assert.deepEqual(data.months, [{ label: 'Jun', column: 1 }]);
  assert.deepEqual(data.weeks[0].days[0], {
    date: '2025-06-01',
    count: 1,
    level: 1,
  });
  assert.deepEqual(data.weeks[1].days[1], {
    date: '2025-06-09',
    count: 5,
    level: 4,
  });
});

test('buildContributionData queries GitHub GraphQL with the past-year range', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      async json() {
        return {
          data: {
            user: {
              contributionsCollection: {
                contributionCalendar: {
                  totalContributions: 3,
                  weeks: [
                    {
                      contributionDays: [
                        { date: '2025-06-03', contributionCount: 3, contributionLevel: 'THIRD_QUARTILE' },
                      ],
                    },
                  ],
                },
              },
            },
          },
        };
      },
    };
  };

  const data = await buildContributionData({
    username: 'virgoC0der',
    token: 'test-token',
    now: new Date('2026-06-03T13:52:37+08:00'),
    fetchImpl,
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.github.com/graphql');
  assert.match(calls[0].options.headers.Authorization, /^Bearer /);
  assert.deepEqual(JSON.parse(calls[0].options.body).variables, {
    username: 'virgoC0der',
    from: '2025-06-03T00:00:00.000Z',
    to: '2026-06-03T23:59:59.999Z',
  });
  assert.equal(data.totalContributions, 3);
  assert.equal(data.range.from, '2025-06-03');
  assert.equal(data.range.to, '2026-06-03');
});
