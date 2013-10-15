(function($){
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

  $(function(){
    var inputSelectors = '#current-pageviews, #current-conversions';

    var $currentPageviews = $('#current-pageviews');
    var $currentConversions = $('#current-conversions');

    var results = function() {
      return [0.01, 0.02, 0.03, 0.05, 0.10].map(function(mde) {
        return new Calculator({
          currentPageviews: $currentPageviews.val(),
          currentConversions: $currentConversions.val(),
          mde: mde
        }).daysNeeded();
      });
    };

    var populateResultsTable = function(numbers) {
      $('tbody tr td:last-child').each(function(index, el) {
        el.innerHTML = (Math.round(numbers.shift() * 100) / 100) + ' days';
      });
    };

    $(inputSelectors).on('change', function(e) {
      populateResultsTable(results());
    });

    $('form').on('submit', function(e) {
      e.preventDefault();
      populateResultsTable(results());
    });

    populateResultsTable(results());
  });

})(jQuery);
