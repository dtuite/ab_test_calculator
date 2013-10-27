// moment will be required from javascripts/lib because of the RequireJS
// configuration we have set up.
define(['moment'], function(moment) {
  var DEFAULT_MDE = 0.05;

  // Time Related Stuff
  // ------------------

  // Moment.js 
  // http://momentjs.com/

  var MILLISECONDS_IN_ONE_DAY = 86400000;

  // INFO: http://stackoverflow.com/a/2627493/574190
  var daysBetweenDates = function(firstDate, secondDate) {
    var millisecondDiff = firstDate.getTime() - secondDate.getTime();
    return Math.round(Math.abs(millisecondDiff/MILLISECONDS_IN_ONE_DAY));
  };

  var yesterday = function() {
    return new Date(moment().subtract('days', 1));
  };

  // Return a Date object representing this day last month.
  //
  // Examples:
  //
  //   Starting day is the 15th of October
  //   thisDayOneMonthAgo(startingDay);
  //   // => 15th September
  //
  //   Starting day is the 12th of January 2013
  //   thisDayLastMonth(startingDay);
  //   // => 15th December 2012
  var thisDayOneMonthAgo = function(startingDay) {
    return new Date(moment(startingDay).subtract('months', 1));
  };

  // Count the number of days which passed between yesterday and this day last month.
  // Designed to replicate the date selector in Google Analytics.
  var daysInLastMonth = function() {
    return daysBetweenDates(thisDayOneMonthAgo(yesterday()), yesterday());
  };

  var DEFAULT_SAMPLE_LENGTH = daysInLastMonth();

  // Calculating Related Stuff
  // -------------------------

  var Calculator = function(options) {
    this.currentPageviews = parseFloat(options.currentPageviews, 10);
    this.sampleLength = parseFloat(options.sampleLength, 10) || DEFAULT_SAMPLE_LENGTH;
    this.currentConversions = parseFloat(options.currentConversions, 10);
    this.mde = options.mde || DEFAULT_MDE;

    this.currentConversionRate = function() {
      return this.currentConversions / this.currentPageviews;
    };

    this.samplesNeeded = function() {
      var mdeSquared = this.mde * this.mde,
          numerator = this.currentConversionRate() * (1 - this.currentConversionRate());

      return 16 * numerator / mdeSquared;
    };

    this.daysNeeded = function() {
      return (this.sampleLength * this.samplesNeeded()) / this.currentPageviews;
    };
  };

  return Calculator;
});
