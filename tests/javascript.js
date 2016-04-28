describe('Set the `data-eq-pts` attribute via JavaScript', function () {
  var elem = document.createElement('div'),
      body = document.querySelector('body'),
      sizes = [],
      points = '',
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
    elem.removeEventListener('eqResize');
    body.style.width = '0px';

    points = eqjs.definePts(elem, {
      small: sizes[0],
      medium: sizes[1],
      large: sizes[2]
    });

    // Reset result
    result = null;
  });

  //////////////////////////////
  // Should Have Attribute
  //////////////////////////////
  it('should have `data-eq-pts` attribute', function () {
    result = elem.getAttribute('data-eq-pts');
    expect(result).toBe(points);
  });

  //////////////////////////////
  // No Sizes
  //////////////////////////////
  it('should have no state if its width is smaller than smallest size', function () {
    body.style.width = (sizes[0] - 1) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe(null);
    });
  });

  //////////////////////////////
  // Small Sizes
  //////////////////////////////
  it('should be `small` when its width is equal to its smallest size', function () {
    body.style.width = (sizes[0]) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small');
    });
  });

  it('should be `small` when its width is larger to its smallest size but smaller than its `medium` size', function () {
    body.style.width = (sizes[0] + 1) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small');
    });
  });

  //////////////////////////////
  // Medium Sizes
  //////////////////////////////
  it('should be `small medium` when its width is equal to its smallest size', function () {
    body.style.width = (sizes[1]) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small medium');
    });
  });

  it('should be `small medium` when its width is larger to its medium size but smaller than its `larger` size', function () {
    body.style.width = (sizes[1] + 1) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small medium');
    });
  });

  //////////////////////////////
  // Large Sizes
  //////////////////////////////
  it('should be `small medium large` when its width is equal to its largest size', function () {
    body.style.width = (sizes[2]) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small medium large');
    });
  });

  it('should be `small medium large` when its width is larger to its largest size', function () {
    body.style.width = (sizes[2] + 1) + 'px';
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small medium large');
    });
  });

  //////////////////////////////
  // Events
  //////////////////////////////
  it('should fire an event when the element gets resized', function () {
    var eventSpy = jasmine.createSpy();
    body.style.width = (sizes[0]) + 'px';
    elem.addEventListener('eqResize', eventSpy);
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      expect(eventSpy).toHaveBeenCalled();
    });
  });

  it('should allow events to bubble up through the DOM', function() {
    var eventSpy = jasmine.createSpy();
    body.style.width = (sizes[0]) + 'px';
    body.addEventListener('eqResize', eventSpy);
    eqjs.refreshNodes();
    eqjs.query(undefined, function () {
      expect(eventSpy).toHaveBeenCalled();
    });
  });

  //////////////////////////////
  // All Query
  //////////////////////////////
  it('should query properly with `all` query', function () {
    body.style.width = (sizes[2]) + 'px';
    eqjs.all(function () {
      result = elem.getAttribute('data-eq-state');
      expect(result).toBe('small medium large');
    });
  });
});
