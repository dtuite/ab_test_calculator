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
    bootstrap: 'http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min'
  },
  shim: {
    "bootstrap": {
      deps: ["jquery"],
      exports: "$.fn.modal",
      enforceDefine: true
    }
  }
});

require([
    "jquery",
    "bootstrap",
    "app/calculator"
  ], function($, bootstrap, Calculator) {

  $(function(){
    var inputSelectors = '#current-pageviews, #current-conversions';

    var $currentPageviews = $('#current-pageviews');
    var $currentConversions = $('#current-conversions');
    var $resultCells = $('tbody tr td:last-child');
    var $errorArea = $('.alert');
    var errorTimer;

    var isNumber = function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };

    var update = function() {
      var pageviews = $currentPageviews.val(),
          conversions = $currentConversions.val();

      $resultCells.empty();
      $errorArea.empty().addClass('invisible');
      $currentPageviews.closest('.form-group').removeClass('has-error');
      $currentConversions.closest('.form-group').removeClass('has-error');
      clearTimeout(errorTimer);
      

      if (pageviews === '' || !isNumber(pageviews)) {
        $currentPageviews.closest('.form-group').addClass('has-error');
      } else if (conversions === '' || !isNumber(conversions)) {
        $currentConversions.closest('.form-group').addClass('has-error');
      // It makes no sense to have more conversions than pageviews.
      } else if (parseFloat(conversions, 10) > parseFloat(pageviews, 10)) {
        // If I show the user an error message straight away when they change 
        // the pageviews input then they end up seeing errors when all they're 
        // trying to do is tab into the conversion box to change that. 
        // Better to delay and only show the error if they appear stuck.
        errorTimer = setTimeout(function() {
          $errorArea.text('Oops! You can\'t have more conversions than pageviews!').removeClass('invisible');
        }, 5000);
      } else {
        populateResultsTable(results(pageviews, conversions));
      }
    }

    var results = function(pageviews, conversions) {
      return [0.01, 0.02, 0.03, 0.05, 0.10].map(function(mde) {
        return new Calculator({
          currentPageviews: pageviews,
          currentConversions: conversions,
          mde: mde
        }).daysNeeded();
      });
    };

    var populateResultsTable = function(numbers) {
      $resultCells.each(function(index, el) {
        el.innerHTML = (Math.round(numbers.shift() * 100) / 100) + ' days';
      });
    };

    var emptyResultsTable = function() { 
      $resultCells.empty();
    };

    $(inputSelectors).on('keyup', update);

    $('form').on('submit', function(e) {
      e.preventDefault();
      update();
    });

    update();
  });
});
