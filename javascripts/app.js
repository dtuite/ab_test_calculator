requirejs.config({
  // By default load any module IDs from js/lib
  baseUrl: 'javascripts/lib',
  // except, if the module ID starts with "app",
  // load it from the js/app directory. paths
  // config is relative to the baseUrl, and
  // never includes a ".js" extension since
  // the paths config could be for a directory.
  paths: {
    app: '../app',
  }
});

require([
    // "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js",
    "jquery",
    // "http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js",
    "app/calculator"
  ], function($, Calculator) {

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
});
