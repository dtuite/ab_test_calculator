define(function() {
  // Calculates the Percentage Points of the Normal Distribution
  //
  // Found on Github: http://goo.gl/dB5znJ
  // I think this is original: http://rangevoting.org/Qnorm.html
  // I replicated here: 
  var qnorm = function(p) {
    // ALGORITHM AS 111, APPL.STATIST., VOL.26, 118-121, 1977.
    // Computes z = invNorm(p)

    p = parseFloat(p);
    var split = 0.42;

    var a0 = 2.50662823884;
    var a1 = -18.61500062529;
    var a2 = 41.39119773534;
    var a3 = -25.44106049637;
    var b1 = -8.47351093090;
    var b2 = 23.08336743743;
    var b3 = -21.06224101826;
    var b4 =  3.13082909833;
    var c0 = -2.78718931138;
    var c1 = -2.29796479134;
    var c2 =  4.85014127135;
    var c3 =  2.32121276858;
    var d1 =  3.54388924762;
    var d2 =  1.63706781897;

    var q = p - 0.5;

    var r, ppnd;

    if (Math.abs(q) <= split) {
      r = q * q;
      ppnd = q * (((a3*r+a2)*r+a1)*r+a0)/((((b4*r+b3)*r+b2)*r+b1)*r+1);
    } else {
      r = p;
      if (q > 0) r = 1 - p;
      if (r > 0) {
        r = Math.sqrt(-Math.log(r));
        ppnd = (((c3*r+c2)*r+c1)*r+c0)/((d2*r+d1)*r+1);
        if (q < 0) ppnd = -ppnd;
      }
      else {
        ppnd = 0;
      }
    }

    return ppnd;
  };

  return qnorm;
});
