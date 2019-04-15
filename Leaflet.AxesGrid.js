L.AxesGrid = L.GridLayer.extend({
  options: {
    cells: 5,
    color: '#40404044',
    axesColor: '#ff6754',
    axesWidth: 0.8,
    zoom: 10,
    showLabel:false,
    defaultLabel: {
      scale: 1,
      unit: 'm',
      color: '#404040',
      size: 13
    }
  },
  createTile: function(coords) {
    let svg = this.createParentTile();
    // const n = this.options.cells;
    const n = this.options.cells; //*(2**(this.options.maxZoom - coords.z));
    this.m = this.options.cells * 2 ** (this.options.zoom - coords.z);
    console.log(coords.z, n);
    const size = 256 / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let tile = this.Rect(i * size, j * size, size, size);
        svg.appendChild(tile);
      }
    }

    svg.setAttributeNS(null, 'id', coords.x);

    if (coords.x == 0 || coords.x == -1) {
      const weight = this.options.axesWidth || 4;
      const x = coords.x == 0 ? weight : 256;
      let line = this.Line(x - weight / 2, 0, x - weight / 2, 256, weight);
      svg.appendChild(line);
    }

    if (coords.y == 0 || coords.y == -1) {
      const weight = this.options.axesWidth || 4;
      const y = coords.y == 0 ? weight : 256;
      let line = this.Line(0, y - weight / 2, 256, y - weight / 2, weight);
      svg.appendChild(line);
    }

    if (this.options.showLabel) {
      if(!this.options.label) {
        this.options.label = this.options.defaultLabel;
      }

      const size = this.options.label.size || '13';
      const color = this.options.label.color || '#000';

      if (coords.x == 0) {
        if(coords.y==0) {
          const text = this.Text('0,0', 1, size+3, color, size+3);
          svg.appendChild(text);
        }
        else {
          const yLabel = this.normilize(coords.y, true);
          const text = this.Text(yLabel, 5, size, color, size);
          svg.appendChild(text);
          const line = this.Line(0, 0, size / 2, 0, 2);
          svg.appendChild(line);
        }

        for (let i = 1; i < n; i++) {
          let y = (coords.y+1)*i/n;
          if(coords.y<0) {
            y = coords.y*(n-i)/n;
          }
          const text = this.Text(this.normilize(y), 5, (i * 256.) / n, color, size-2);
          svg.appendChild(text);
        }
      }
      if (coords.y == 0) {
        if(coords.x!=0) {
          const xLabel = this.normilize(coords.x, true);
          const text = this.Text(xLabel, 2, size, color, size);
          svg.appendChild(text);
          const line = this.Line(0, 0, 0, size / 2, 2);
          svg.appendChild(line);
        }

        for (let i = 1; i < n; i++) {
          let x = (coords.x+1)*i/n;
          if(coords.x<0) {
            x = coords.x*(n-i)/n;
          }
          
          const text = this.Text(this.normilize(x), (i * 256.) / n, size, color, size-2);
          svg.appendChild(text);
        }
      }
    }

    return svg;
    // let tile = document.createElement('div');
    // tile.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPgAAAD4CAYAAADB0SsLAAAM60lEQVR4Xu3dsc6d1RGFYSwS0SAByRVEossVmpKCv+AW6VMlpARLliNLtgua806kOdrePNTLPux3zZrZswt/r37++ed//Pbbb3/5wn8IIHAVgbdv3/711cvLy/evX7/+ZetkP/30099/+OGHf2/9/e//Xr/R6WL152H18vLynYBHvwUjgtJwO6hlVgI+sELAOyyszmAl4N0HawBWAwJdutkMBbz7IOBYDQh0qYAHVpuQPv683whGfJBgdQYrE7z7YIJjNSDQpZvNUMC7DwKO1YBAlwp4YLUJyRU9GPAHCT86s01WJnj3wQTHakCgSwU8sNqEZIIHA0zwOaQnPEia4ANbNJEOC6szWAl498EVHasBgS7dbIYC3n0QcKwGBLpUwAOrTUh28GCAHXwOyQ7emQk4Vp1AV37udeWK3r12RcdqQKBLN5uIgHcfBByrAYEuFfDAahOSHTwYYAefQ7KDd2YCjlUn0JWfe125onevXdGxGhDo0s0mIuDdBwHHakCgSwU8sNqEZAcPBtjB55CeuYO/e/fu1//7//DBH3z79u3fvvzyy/9s/f3v/95Xr159t3kGvzFzjx+d1yarN2/efOOfTY5euCVEUMv/FLAbVffBDt5Z2cGxGhDo0s3BIeDdBwHHakCgSwU8sNqE5EoYDPDINof0zEc23yZ77I8m8piRZtgZPYOVK/rADwHvsLA6g5WAdx/s4FgNCHTpZjMU8O6DgGM1INClAh5YbUJ6xq7kN4LJHvLGkEzwATJNpMPC6gxWAt59cEXHakCgSzeboYB3HwQcqwGBLhXwwGoTkv04GGA/nkP68Cc2a9cEH9iyaYQmMjDiCcG4xQ8BH9SVgHdYWJ3BSsC7D3ZwrAYEunSzGQp490HAsRoQ6FIBD6w2Id2yjzlHKKTLHgtN8IHnmkiHhdUZrAS8++CKjtWAQJduNkMB7z4IOFYDAl0q4IHVJiS7azDgst31Fs9N8EHtaiIdFlZnsBLw7oMrOlYDAl262Qw/BXzzowHP+PDBM35j8x+o/1gOfqMHA6vHrHz44DGjT4rNTnvLzuccg4L6IN2sK1f0gR+bRgjGwIgnBOMWPwR8UFcC3mFhdQYrAe8+eGTDakCgSzeboYB3HwQcqwGBLhXwwGoT0i37mHOEQvqD5HOvKxN84PnnbraAD8y+5CFPwAeeC3iHhdUZrAS8+2AHx2pAoEs3m6GAdx8EHKsBgS4V8MBqE5LdNRhw2ePULZ6b4IPa1UQ6LKzOYCXg3QdXdKwGBLp0sxkKePdBwLEaEOhSAQ+sNiHdso85Ryiky94STPCB55pIh4XVGawEvPvgio7VgECXbjZDAe8+CDhWAwJdKuCB1SYku2sw4LLd9RbPTfBB7WoiHRZWZ7AS8O6DKzpWAwJdutkMBbz7IOBYDQh0qYAHVpuQbtnHnCMU0mVvCSb4wHNNpMPC6gxWPnzQffjCxxU6LB8lOIOVDx90H+zgWA0IdOnmbccVvfsg4FgNCHSpgAdWm5A8TgUDLnucusVzE3xQu5pIh4XVGawEvPvgio7VgECXbjZDAe8+CDhWAwJdKuCB1SakW/Yx5wiFdNlbggk+8FwT6bCwOoOVgHcfXNGxGhDo0s1mKODdBwHHakCgSwU8sNqEZHcNBly2u97iuQk+qF1NpMPC6gxWAt59cEXHakCgSzeboYB3HwQcqwGBLhXwwGoT0i37mHOEQrrsLcEEH3iuiXRYWJ3BSsC7D67oWA0IdOlmMxTw7oOAYzUg0KUCHlhtQrK7BgMu211v8dwEH9SuJtJhYXUGKwHvPriiYzUg0KWbzVDAuw8CjtWAQJcKeGC1CemWfcw5QiFd9pZggg8810Q6LKzOYOXDB92Hp3z4wMcVuiE+rvCYlQ8fPGb0SWEqdVhYncHKFb374JENqwGBLt1shgLefRBwrAYEulTAA6tNSF6fgwGXvT7f4rkJPqhdTaTDwuoMVgLefXBFx2pAoEs3m6GAdx8EHKsBgS4V8MBqE9It+5hzhEK67C3BBB94rol0WFidwUrAuw+u6FgNCHTpZjMU8O6DgGM1INClAh5YbUKyuwYDLttdb/HcBB/UribSYWF1BisB7z64omM1INClm81QwLsPAo7VgECXCnhgtQnpln3MOUIhXfaWYIIPPNdEOiyszmAl4N0HV3SsBgS6dLMZCnj3QcCxGhDoUgEPrDYh2V2DAZftrrd4boIPalcT6bCwOoOVgHcfXNGxGhDo0s1mKODdBwHHakCgSwU8sNqEdMs+5hyhkC57S/Dhg4Hnz/gowS2/4aMEvbA2WfnwQffBFR2rAYEu3bx92sG7DwKO1YBAlwp4YLUJye4aDLhsd73FcxN8ULuaSIeF1RmsBLz74IqO1YBAl242QwHvPgg4VgMCXSrggdUmpFv2MecIhXTZW4IJPvBcE+mwsDqDlYB3H1zRsRoQ6NLNZijg3QcBx2pAoEsFPLDahGR3DQZctrve4rkJPqhdTaTDwuoMVgLefXBFx2pAoEs3m6GAdx8EHKsBgS4V8MBqE9It+5hzhEK67C3BBB94rol0WFidwUrAuw+u6FgNCHTpZjMU8O6DgGM1INClAh5YbUKyuwYDLttdb/HcBB/UribSYWF1BisB7z64omM1INClm81QwLsPAo7VgECXCnhgtQnpln3MOUIhXfaWYIIPPNdEOiyszmDlwwfdhy9u+SjBLefY/GDAx7L43H/Dhw8GATeVOiyszmDlit598MiG1YBAl242QwHvPgg4VgMCXSrggdUmJK/PwYDLXp9v8dwEH9SuJtJhYXUGKwHvPriiYzUg0KWbzVDAuw8CjtWAQJcKeGC1CemWfcw5QiFd9pZggg8810Q6LKzOYCXg3QdXdKwGBLp0sxkKePdBwLEaEOhSAQ+sNiHZXYMBl+2ut3hugg9qVxPpsLA6g5WAdx9c0bEaEOjSzWYo4N0HAcdqQKBLBTyw2oR0yz7mHKGQLntLMMEHnmsiHRZWZ7AS8O6DKzpWAwJdutkMBbz7IOBYDQh0qYAHVpuQ7K7BgMt211s8N8EHtauJdFhYncFKwLsPruhYDQh06WYzFPDug4BjNSDQpQIeWG1CumUfc45QSJe9JfjwwcDzWz4Y4BzddB8+CKxM1wDpgwQrrDqBx0o7+GNGnxTC12FhdQYrAe8+eGTDakCgSzeboYB3HwQcqwGBLhXwwGoTktfnYMBlr8+3eG6CD2pXE+mwsDqDlYB3H1zRsRoQ6NLNZijg3QcBx2pAoEsFPLDahHTLPuYcoZAue0swwQeeayIdFlZnsBLw7oMrOlYDAl262QwFvPsg4FgNCHSpgAdWm5DsrsGAy3bXWzw3wQe1q4l0WFidwUrAuw+u6FgNCHTpZjMU8O6DgGM1INClAh5YbUK6ZR9zjlBIl70lmOADzzWRDgurM1gJePfBFR2rAYEu3WyGAt59EHCsBgS6VMADq01IdtdgwGW76y2em+CD2tVEOiyszmAl4N0HV3SsBgS6dLMZCnj3QcCxGhDo0qcE/N27d7/2/6WZ0j+033lh9edjtflxhTdv3nzz6uXl5fvXr1//0tHOlJsd6pbHEOeY1dR7tbp6zMwV/TGjTwoF1WFhdQYrAe8+mBhYDQh06WYzFPDug4BjNSDQpQIeWG1Csh8HA/4g4UdntsnKBO8+mOBYDQh0qYAHVpuQTPBggAk+h/ThT2zWrgk+sGXTCE1kYMQTgnGLHwI+qCsB77CwOoOVgHcf7OBYDQh06WYzFPDug4BjNSDQpQIeWG1CumUfc45QSJc9FprgA881kQ4LqzNYCXj3wRUdqwGBLt1shgLefRBwrAYEulTAA6tNSHbXYMBlu+stnpvgg9rVRDosrM5gJeDdB1d0rAYEunSzGQp490HAsRoQ6FIBD6w2Id2yjzlHKKTL3hJM8IHnmkiHhdUZrAS8++CKjtWAQJduNkMB7z4IOFYDAl0q4IHVJiS7azDgst31Fs8/TXAfPnhcxD5K8JjRRwVWZ7Dy4YPugys6VgMCXbp5+7SDdx8EHKsBgS4V8MBqE9It+5hzhEK67C3BBB94rol0WFidwUrAuw+u6FgNCHTpZjMU8O6DgGM1INClAh5YbUKyuwYDLttdb/HcBB/UribSYWF1BisB7z64omM1INClm81QwLsPAo7VgECXCnhgtQnpln3MOUIhXfaWYIIPPNdEOiyszmAl4N0HV3SsBgS6dLMZCnj3QcCxGhDoUgEPrDYh2V2DAZftrrd4boIPalcT6bCwOoOVgHcfXNGxGhDo0s1mKODdBwHHakCgSwU8sNqEdMs+5hyhkC57SzDBB55rIh0WVmewEvDugys6VgMCXbrZDAW8+yDgWA0IdOl6wH/88cd/fv311//q/0sz5e+///7tV1999d/Zn5qp/UbnhdWfitW3/wMswFInh0fcRQAAAABJRU5ErkJggg==')";
    // tile.style.backgroundSize = 'cover';
    // return tile;
  },

  normilize(val, withUnit) {
    const labelUnit = this.options.label.unit || 'm';
    val = this.options.label.scale * val * this.m;
    val = Math.round(val * 100) / 100;
    let unit = labelUnit + '';
    // if (labelUnit == 'cm' && (val >= 100 || val <= -100)) {
    //   unit = 'm';
    //   val = Math.round(val) / 100;
    // }
    return withUnit ? val + unit : val;
  },

  createParentTile() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS(
      'http://www.w3.org/2000/svg',
      'xlink',
      'http://www.w3.org/1999/xlink'
    );
    svg.setAttributeNS('http://www.w3.org/2000/svg', 'height', '256');
    svg.setAttributeNS('http://www.w3.org/2000/svg', 'width', '256');

    var rect = this.Rect(0, 0, 256, 256, 2);
    svg.appendChild(rect);
    return svg;
  },

  Rect(x, y, width, height, weight = 0.5) {
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttributeNS(null, 'height', height);
    rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'fill', 'none');
    rect.setAttributeNS(null, 'stroke', this.options.color);
    rect.setAttributeNS(null, 'stroke-width', weight);
    return rect;
  },

  Line(x1, y1, x2, y2, weight = 1) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttributeNS(null, 'x1', x1);
    line.setAttributeNS(null, 'y1', y1);
    line.setAttributeNS(null, 'x2', x2);
    line.setAttributeNS(null, 'y2', y2);
    line.setAttributeNS(null, 'stroke', this.options.axesColor);
    line.setAttributeNS(null, 'stroke-width', weight);
    return line;
  },

  Text(text, x, y, color, size) {
    var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttributeNS(null, 'x', x);
    txt.setAttributeNS(null, 'y', y);
    txt.setAttributeNS(null, 'fill', color);
    txt.setAttributeNS(null, 'font-size', size);
    txt.textContent = text;
    return txt;
  }
});

L.axesGrid = function(opts) {
  return new L.AxesGrid(opts);
};
