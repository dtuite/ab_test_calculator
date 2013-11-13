// moment will be required from javascripts/lib because of the RequireJS
// configuration we have set up.
define(['moment', 'qnorm'], function(moment, qnorm) {

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

  var DEFAULTS = {
    'SAMPLE_LENGTH': daysInLastMonth(),
    'ALPHA_LEVEL': 0.05,
    'POWER_LEVEL': 0.80,
    'MDE': 0.05
  };

  // Calculating Related Stuff
  // -------------------------

  // IDEA: Why am I making this into an object? The only benefit with making it
  // an object and making things like daysNeeded into methods is so that I could
  // mutate the calculator and get new, correct answers.
  //
  // Example:
  // 
  //   var calc = new Calculator({
  //    currentPageviews: 8800,
  //    currentConversions: 634
  //   });
  //   calc.daysNeeded();
  //   calc.currentPageviews = 12999;
  //   calc.daysNeeded();
  //
  // This is silly though because I don't want to mutate the calculator. Instead,
  // it should just be a function. Give args in and it returns the days needed.
  var Calculator = function(options) {
    this.currentPageviews = parseFloat(options.currentPageviews, 10);
    this.sampleLength = parseFloat(options.sampleLength, 10) || DEFAULTS.SAMPLE_LENGTH;
    this.currentConversions = parseFloat(options.currentConversions, 10);
    this.mde = options.mde || DEFAULTS.MDE;
    this.alphaLevel = DEFAULTS.ALPHA_LEVEL
    this.powerLevel = DEFAULTS.POWER_LEVEL

    this.currentConversionRate = function() {
      return this.currentConversions / this.currentPageviews;
    };

    this.tAlpha2 = function() { return qnorm(1.0 - this.alphaLevel / 2); };
    this.tBeta = function() { return qnorm(this.powerLevel); };

    this.sd1 = function() {
      var p = this.currentConversionRate();
      return Math.sqrt(2 * p * (1.0 - p));
    };

    this.sd2 = function() {
      var p = this.currentConversionRate();
      return Math.sqrt(p * (1.0 - p) + (p + this.mde) * (1.0 - p - this.mde));
    };

    this.samplesNeeded = function() {
      var mdeSquared = this.mde * this.mde,
          tAlpha2 = this.tAlpha2(),
          tBeta = this.tBeta(),
          sd1 = this.sd1(),
          sd2 = this.sd2(),
          num = (tAlpha2 * sd1 + tBeta * sd2);

      console.log("Samples needed", num * num / mdeSquared);

      return num * num / mdeSquared;
    };

    this.daysNeeded = function() {
      return (this.sampleLength * this.samplesNeeded()) / this.currentPageviews;
    };
  };

  return Calculator;
});
