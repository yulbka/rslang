import { createElement } from '../../scripts/helpers/createElement';

import { paintings1 } from './data/level1';
import { paintings2 } from './data/level2';
import { paintings3 } from './data/level3';
import { paintings4 } from './data/level4';
import { paintings5 } from './data/level5';
import { paintings6 } from './data/level6';

export const paintings = {
  1: paintings1,
  2: paintings2,
  3: paintings3,
  4: paintings4,
  5: paintings5,
  6: paintings6
};

export class Puzzle {
  constructor(width, type, text, position) {
    this.width = width;
    this.type = type;
    this.text = text;
    this.position = position;
  }

  render() {
    const data = document.querySelector('.data');
    const wrapper = createElement('div', data,
        ['puzzle-wrapper', 'new'],
        '', 'data-word', this.text);
    wrapper.dataset.position = this.position;
    if (this.type !== 'last') {
      wrapper.style.width = `${this.width - 20}px`;
    }
    const puzzle =
    createElement('canvas', wrapper, ['puzzle'], undefined, 'height', '50');
    const text = createElement('span', wrapper, ['puzzle__text'], this.text);
    text.style.left = `${this.width / 2 - text.offsetWidth / 2}px`;
    puzzle.setAttribute('width', `${this.width}`);
    const ctx = puzzle.getContext('2d');
    ctx.rect(0, 0, this.width, 50);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    if (this.type === 'last') {
      ctx.lineTo(this.width, 0);
      ctx.lineTo(this.width, 50);
    } else {
      ctx.lineTo(this.width - 20, 0);
      ctx.lineTo(this.width - 20, 16);
      ctx.arc(this.width - 14, 26, 12, 4 *Math.PI / 3, 2 * Math.PI / 3, false);
      ctx.lineTo(this.width - 20, 50);
    }
    ctx.lineTo(0, 50);
    if (this.type === 'first') {
      ctx.lineTo(0, 0);
    } else {
      ctx.lineTo(0, 34);
      ctx.arc(6, 26, 12, 2 * Math.PI / 3, 4 * Math.PI / 3, true);
      ctx.lineTo(0, 0);
    }
    ctx.fillStyle = '#b6ab98';
    ctx.fill();
    Puzzle.paintStroke(wrapper, 'lightgrey');
    ctx.clip();
  }

  static paintStroke(element, color) {
    const canvas = element.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  static fillPuzzle(element, color) {
    const canvas = element.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  static showPicture(element, position, rowPosition, level, page, color) {
    const canvas = element.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const src = paintings[level][page - 1].cutSrc;
    img.src = `https://raw.githubusercontent.com/Anna234365/rslang_data_paintings/master/${src}`;
    const result = document.querySelector('.result');
    img.onload = () => {
      const widthScale = result.offsetWidth / img.width;
      const heightScale = result.offsetHeight / img.height;
      ctx.drawImage(img, position / widthScale, rowPosition * 50 / heightScale,
          canvas.width / widthScale + 2, 50 / heightScale + 2,
          0, 0, canvas.width, 50);
      color ? Puzzle.paintStroke(element, color):
      Puzzle.paintStroke(element, 'lightgrey');
    };
  }
}