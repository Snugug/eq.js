describe('Set the `data-eq-state` attribute based on element width', function () {
  var elem = document.createElement('div'),
      body = document.querySelector('body'),
      async = new AsyncSpec(this),
      sizes = [],
      result;

  body.appendChild(elem);

  function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  beforeEach(function () {
    // Generate Sizes
    sizes.push(random(50, 400));
    sizes.push(random(405, 600));
    sizes.push(random(605, 900));

    // Remove State and Width
    elem.removeAttribute('data-eq-state');
    body.style.width = '0px';


    // Set new sizes
    elem.setAttribute('data-eq-pts', 'small: ' + sizes[0] + ', medium: ' + sizes[1] + ', large: ' + sizes[2]);

    // Reset result
    result = null;
  });

  //////////////////////////////
  // No Sizes
  //////////////////////////////
  async.it('should have no state if its width is smaller than smallest size', function (done) {
    body.style.width = (sizes[0] - 1) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe(null);
      done();
    });
  });

  //////////////////////////////
  // Small Sizes
  //////////////////////////////
  async.it('should be `small` when its width is equal to its smallest size', function (done) {
    body.style.width = (sizes[0]) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small');
      done();
    });
  });

  async.it('should be `small` when its width is larger to its smallest size but smaller than its `medium` size', function (done) {
    body.style.width = (sizes[0] + 1) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small');
      done();
    });
  });

  //////////////////////////////
  // Medium Sizes
  //////////////////////////////
  async.it('should be `medium` when its width is equal to its smallest size', function (done) {
    body.style.width = (sizes[1]) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('medium');
      done();
    });
  });

  async.it('should be `medium` when its width is larger to its medium size but smaller than its `larger` size', function (done) {
    body.style.width = (sizes[1] + 1) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('medium');
      done();
    });
  });

  //////////////////////////////
  // Large Sizes
  //////////////////////////////
  async.it('should be `large` when its width is equal to its largest size', function (done) {
    body.style.width = (sizes[2]) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('large');
      done();
    });
  });

  async.it('should be `large` when its width is larger to its largest size', function (done) {
    body.style.width = (sizes[2] + 1) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('large');
      done();
    });
  });
});
