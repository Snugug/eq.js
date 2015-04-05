describe('Set the `data-eq-state` attribute based on the element width and its CSS styling', function () {
  var elem = document.createElement('div'),
      body = document.querySelector('body'),
      style = document.createElement('style'),
      head = document.querySelector('head'),
      sizes = [],
      css,
      result;

  body.appendChild(elem);
  elem.setAttribute('id', 'foo');

  head.appendChild(style);
  style.type = 'text/css';

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
    style.innerHTML = '';


    // Set new sizes
    css = 'html:before { display: none; content: "#foo"; }';
    css += '#foo:before { display: none; ';
    css += 'content: "small: ' + sizes[0] + ', medium: ' + sizes[1] + ', large: ' + sizes[2] + '"; }';
    style.appendChild(document.createTextNode(css));

    // Reset result
    result = null;
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
});
