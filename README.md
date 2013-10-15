# A/B Test Calculator

Calculate how many days an A/B test must run for in order to get actionable results.

Simultaneously calculates results for a range of minimum detectable effects.
The smaller the lift you wish to calculate, the longer the test will have to run.

### Ideas for Improvent

**Sample range lengthening**
Automatically detect when the user doesn't have a statistically significant
conversion rate over the last month (the default sampling date range) and
prompt them to lengthen the date range in order to get more accurate results.

For example, if I try to calculate hpw long a test will have to run but I only
have 120 pageviews and 10 conversions in the last 30 days, the conversion rate
calculated won't be very accurate (because of the small sample size). In this
instance, we should prompt the user to lengthen the range to try and capture
more samples.
