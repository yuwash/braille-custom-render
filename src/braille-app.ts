import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as braille from 'braille';
import { decode } from 'braille-encode';
import { SVG, Svg } from '@svgdotjs/svg.js';
import { renderText } from './braille-utils';

@customElement('braille-app')
class BrailleApp extends LitElement {
  @state() text: string = '';
  @state() canvasCssClass: string = 'braille-canvas';
  @state() private draw?: Svg;
  @state() private textAsBraille: string = '';
  @state() private textAsUint8Array: number[] = [];
  onTextInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.text = input.value;
  }
  render() {
    this.textAsBraille = braille.toBraille(this.text);
    this.textAsUint8Array = decode(this.textAsBraille);
    const formattedBytes = this.textAsUint8Array.reduce(
      (s: string, b: number) => s + ' ' + b.toString(16),
      ''
    );
    return html`
    <textarea @input=${this.onTextInput} .value=${this.text} placeholder="Enter text here"></textarea>
    <p>As Braille: ${this.textAsBraille}</p>
    <p>As Code: ${formattedBytes}</p>
    <div class="${this.canvasCssClass}"></div>
  `;
  }
  firstUpdated() {
    if (!this.draw) {
      const canvasDiv = this.renderRoot.querySelector(
        '.' + this.canvasCssClass
      );
      this.draw = SVG().addTo(canvasDiv).size(640, 360);
    }
  }
  updated() {
    const renderedText = renderText({
      text: this.textAsUint8Array,
      x: 0,
      y: 0,
      width: 6,
      height: 12,
      pageWidth: 640,
      letterSpacing: 2,
      lineHeight: 14,
    });
    this.draw.clear();
    renderedText.forEach(([x1, y1, x2, y2]) =>
      this.draw
        .rect(x2 - x1, y2 - y1)
        .move(x1, y1)
        .attr({ fill: '#000' })
    );
  }
}
