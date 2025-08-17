# Goal

[ Design Pilot ](https://uxpilot.ai/s/45c9566081f4de4088d3bcca93fc9acf)

Dashboard to power insights around helpline engagement, schedule coverage, and operator participation.

Data structure:

Calls: - date & time - caller state - duration - is_missed_cal - operator_name (if someone answered) - assigned_operator (for all calls)
Schedule: - hour_of_day - day_of_week - operator_cnt - operators_assigned
Operators: - hour_of_day - day_of_week - operator_name

## Tab Structure

Global selector: Helpline selector (norcal or national)

#### Calls (focusing on the health of the helpline)

Selectors:

- last N day selector for summary (summary includes data for the past week, month, quarter, year, all time)
- time series start date (date to start the time series from).
  - I don't want to tie this to the last N selector as I may want to see weekly stats while looking at longer-term trends
- historical group by (month, year)
  - to understand trends over time

1. Summary row
   1. Most recent call
   2. Calls in last N days (plus change from a year ago)
   3. Abandoned calls in last N days (plus change from a year ago)
   4. Abandonment rate in the last N days (plus change from a year ago)
   5. Median Duration in last N days (may need to trim out the very short calls here -- if we do that we should call it Median Substantial Call Duration). Likely also filter out missed calls here

2. Time Series Row
   1. Time series view
      1. calls over time for the last timeSeriesStartDate days
         1. stacked area of connected calls and abandoned calls
   2. Year-over-year comparison view:
      1. Stack data by the historicalGroupBy dimension and show individual lines or bars for each year we have data for. Augment with historical data.

3. Breakdown View
   1. Calls by top N states
   2. CDF of call duration
   3. Missed calls by top N states

4. Geographic Call Patterns
   1. Call volume heat map by state
   2. State-specific abandonment rates (in tooltip)
   3. State-by-state performance comparison (abandonment rate, avg duration, missed call rate) (in tooltip)

#### Schedule (focused on the health of scheduling)

Share lastNDays dropdown from Calls

1. Summary row
   1. Hours currently covered by operators
   2. Hours in a week
   3. Fraction of hours covered by operators
   4. Fraction of missed calls landing in scheduled hours (drop this if lastNDays extends beyond the start of our assignment data -- 2025-04-01)

2. day/hour view:
   1. days across x-axis, hours down y-axis
   2. Each box should show (color coded) call volume in the last N days
   3. Use fill pattern to designate if the shift if covered or not
   4. Some visual indicator of the abandoned call rate in the bin
   5. Tooltip can show assigned operators. This could help us identify scheduled blocks that are still getting high missed calls as potential places for double scheduling

#### Operator (focused on operator engagement)

Share lastNDays dropdown from Calls

1. Summary Row
   1. Number of operators currently taking calls
   2. Average (or median) shift length for operators
   3. Max commitment for operators
   4. Calls answered in the lastNDays
   5. Total minutes talking to callers in the lastNDays

2. Operator Breakdowns
   1. Call volume by operator
   2. Total call duration by operator
   3. Median call duration by operator
   4. Missed call rate (missed calls per scheduled hour) by operator

3. Table View
   1. Operators for follow up (no answered calls in window, but has missed calls in their times)

#### Reports (focused on helping generate monthly and yearly reports)

Selectors:
Report type: Monthly / Yearly
Date selector: Month or Year

Report stats:

1. Table with total calls, missed calls, missed call rate for the observation window and for the window a year previous to it
2. Total operators committed to the helpline
3. Fraction of weekly hours covered by the helpline

Provide this as text and table.

Include a "Copy as MD" button that copies the content of the page to markdown for pasting in other systems.

Even better if we can change copy as MD to export and include MD to clipboard or a format that would work for a google doc or office file.
