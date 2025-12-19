/* Minimal browser wrapper for DualScaleControl
   Exposes `window.DualScaleControl` for demo usage.
   This is a tiny adaptation of the CommonJS source to run directly in the browser.
*/
(function (root) {
  function getDistance(latlng1, latlng2) {
    var rad = Math.PI / 180;
    var lat1 = latlng1.lat * rad;
    var lat2 = latlng2.lat * rad;
    var a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);
    return 6371e3 * Math.acos(Math.min(a, 1));
  }

  function getRoundNum(num) {
    var pow10 = Math.pow(10, ("" + Math.floor(num)).length - 1);
    var d = num / pow10;
    d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;
    return pow10 * d;
  }

  function setScale(container, maxWidth, maxDistance, unit) {
    var distance = getRoundNum(maxDistance);
    var ratio = distance / maxDistance;
    if (unit === 'm' && distance >= 1000) {
      container.innerHTML = (distance / 1000) + ' km';
    } else {
      container.innerHTML = distance + ' ' + unit;
    }
    container.style.width = (maxWidth * ratio) + 'px';
  }

  function updateScale(map, metricContainer, imperialContainer, options) {
    var maxWidth = (options && options.maxWidth) || 100;
    var a = map._container.clientHeight / 2;
    var r = getDistance(map.unproject([0, a]), map.unproject([maxWidth, a]));
    var s = 3.2808 * r;
    if (s > 5280) {
      setScale(imperialContainer, maxWidth, s / 5280, 'mi');
    } else {
      setScale(imperialContainer, maxWidth, s, 'ft');
    }
    setScale(metricContainer, maxWidth, r, 'm');
  }

  function updatePosition(map, container, lngLat) {
    var lat = lngLat.lat.toFixed(6);
    var lng = lngLat.lng.toFixed(6);
    container.innerHTML = lat + ', ' + lng;
  }

  function createEl(tag, className, parent) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (parent) parent.appendChild(el);
    return el;
  }

  function DualScaleControl(options) {
    this.options = options || {};
    this._onMove = this._onMove.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
  }

  DualScaleControl.prototype.getDefaultPosition = function () { return 'bottom-left'; };

  DualScaleControl.prototype._onMove = function () {
    updateScale(this._map, this._metricContainer, this._imperialContainer, this.options);
  };

  DualScaleControl.prototype._onMouseMove = function (e) {
    updatePosition(this._map, this._positionContainer, e.lngLat);
  };

  DualScaleControl.prototype._applyStyles = function () {
    this._container.style.cssText = 'border:none!important;padding:0!important;background-color:transparent!important;position:relative;height:24px;margin:10px!important;';
    this._positionContainer.style.display = 'none';
    this._metricContainer.style.cssText = 'height:12px;font-size:10px;line-height:12px;text-align:center;background-color:rgba(255,255,255,0.8);border-width:0 2px 2px 2px;border-style:solid;border-color:#333;padding:0 5px;color:#333;position:absolute;top:-2px;left:0;white-space:nowrap;';
    this._imperialContainer.style.cssText = 'height:12px;font-size:10px;line-height:12px;text-align:center;background-color:rgba(255,255,255,0.8);border-width:2px 2px 0 2px;border-style:solid;border-color:#333;padding:0 5px;color:#333;position:absolute;top:10px;left:0;white-space:nowrap;';
  };

  DualScaleControl.prototype.onAdd = function (map) {
    this._map = map;
    this._container = createEl('div', 'maplibregl-ctrl maplibregl-ctrl-scale maphubs-ctrl-scale', map.getContainer());
    this._positionContainer = createEl('div', 'map-position', this._container);
    this._metricContainer = createEl('div', 'metric-scale', this._container);
    this._imperialContainer = createEl('div', 'imperial-scale', this._container);

    this._applyStyles();

    this._map.on('move', this._onMove);
    this._onMove();
    this._map.on('mousemove', this._onMouseMove);

    return this._container;
  };

  DualScaleControl.prototype.onRemove = function () {
    if (this._container && this._container.parentNode) this._container.parentNode.removeChild(this._container);
    this._map.off('move', this._onMove);
    this._map.off('mousemove', this._onMouseMove);
    this._map = undefined;
  };

  root.DualScaleControl = DualScaleControl;
})(window || this);
