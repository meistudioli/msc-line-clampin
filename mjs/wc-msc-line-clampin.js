import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

/*
 reference:
 - https://stackoverflow.com/questions/68130648/apply-padding-to-the-truncated-line-of-a-multiline-text
 - https://developer.mozilla.org/en-US/docs/Web/CSS/mask
 - https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
 - https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units
*/

const defaults = {};
const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = [];
const custumEvents = {
  expand: 'msc-line-clampin-expand'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{position:relative;display:block;}

.main {
  --line-clamp: var(--msc-line-clampin-line-clamp, 2);
  --padding-size: var(--msc-line-clampin-padding-size, 86px);
  --button-color: var(--msc-line-clampin-button-text-color, rgba(52 120 246));
  --button-text: var(--msc-line-clampin-button-text, 'more');
  
  --button-display: block;
  --mask:
    linear-gradient(to top, black 0%, black 0%) 100% 100% / 100% 100% no-repeat exclude,
    linear-gradient(to left, black 50%, transparent 100%) 100% 100% / var(--padding-size) 1lh no-repeat exclude;

  position: relative;
  font-size: inherit;
  line-height: inherit;
  outline: 0 none;

  &.main--expand {
    --line-clamp: none;
    --button-display: none;
    --mask: none;
  }

  .main__slot {
    font-size: inherit;
    inline-size: 100%;
    line-height: inherit;

    /* line-clamp */
    display: -webkit-box;
    -webkit-line-clamp: var(--line-clamp);
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;

    /* mask */
    mask: var(--mask);
  }

  .main__button {
    font-size: inherit;
    line-height: inherit;
    color: var(--button-color);
    display: var(--button-display);

    appearance: none;
    background: transparent;
    border: 0 none;
    outline: 0 none;
    margin: 0;
    padding: 0;

    position: absolute;
    inset-inline-end: 0;
    inset-block-end: 0;
    cursor: pointer;

    &::before {
      content: var(--button-text);
    }
  }
}
</style>

<div class="main" ontouchstart="" tabindex="0">
  <slot class="main__slot"></slot>
  <button
    type="button"
    class="main__button"
  >
  </button>
</div>
`;

// Houdini Props and Vals, https://web.dev/at-property/
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-line-clampin-line-clamp',
      syntax: '<integer>',
      inherits: true,
      initialValue: '2'
    });

    CSS.registerProperty({
      name: '--msc-line-clampin-padding-size',
      syntax: '<length>',
      inherits: true,
      initialValue: '86px'
    });

    CSS.registerProperty({
      name: '--msc-line-clampin-button-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(52 120 246)'
    });
  } catch(err) {
    console.warn(`msc-line-clampin: ${err.message}`);
  }
}

export class MscLineClampin extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      main: this.shadowRoot.querySelector('.main'),
      button: this.shadowRoot.querySelector('.main__button'),
      slot: this.shadowRoot.querySelector('.main__slot')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscLineClampin(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
    this._onSlotchange = this._onSlotchange.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    this.#nodes.button.addEventListener('click', this._onClick, { signal });
    this.#nodes.slot.addEventListener('slotchange', this._onSlotchange, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscLineClampin.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscLineClampin.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  _onClick() {
    this.#nodes.main.classList.toggle('main--expand', true);
    this.#fireEvent(custumEvents.expand);
  }

  _onSlotchange() {
    this.#nodes.main.classList.toggle('main--expand', false);
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscLineClampin');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscLineClampin'), MscLineClampin);
}