# msc-line-clampin

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-line-clampin) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/28719/branches/925217/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=28719&bid=925217)

&lt;msc-line-clampin /> is a common text render effect. Sometimes we like to hide text in a restrick area and provide a more button to expand the whole content. This is exactly what &lt;msc-line-clampin /> do.

![<msc-line-clampin />](https://blog.lalacube.com/mei/img/preview/msc-line-clampin.png)

## Basic Usage

&lt;msc-line-clampin /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-line-clampin />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://unpkg.com/msc-line-clampin/mjs/wc-msc-line-clampin.js">        
</script>
```

- Structure

Put &lt;msc-line-clampin /> into HTML document.

```html
<msc-line-clampin>
  TikTok 是一款玩轉音樂創作的短影音 App，更是年輕人的交友社群。
  在這裡每個人都可以拍出屬於自己的創意影片，
  跟著音樂的節奏，你可以盡情拍攝多種影片內容，
  個人才藝、生活紀錄、表演、舞蹈、劇情演繹等。
  點子有多狂，TikTok 舞台就有多大。
  趕快上傳影片，讓世界看見你的創意吧！
</msc-line-clampin>
```

## JavaScript Instantiation

&lt;msc-line-clampin /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscLineClampin } from 'https://unpkg.com/msc-line-clampin/mjs/wc-msc-line-clampin.js';

//use DOM api
const nodeA = document.createElement('msc-line-clampin');
const textA = document.createTextNode('write your text content here.');
document.body.appendChild(nodeA);
nodeA.appendChild(textA);

// new instance with Class
const nodeB = new MscLineClampin();
const textB = document.createTextNode('write your text content here.');
document.body.appendChild(nodeB);
nodeB.appendChild(textB);
</script>
```

## Style Customization

&lt;msc-line-clampin /> uses CSS variables to hook control panel's theme. That means developer could easy change it into the looks you like.

```html
<style>
msc-line-clampin {
  --msc-line-clampin-line-clamp: 2;
  --msc-line-clampin-padding-size: 86px;
  --msc-line-clampin-button-text-color: rgba(52 120 246);
  --msc-line-clampin-button-text: 'more';
}
</style>
```

## Event
| Event Signature | Description |
| ----------- | ----------- |
| msc-line-clampin-expand | Fired when &lt;msc-line-clampin /> expanded. |

## Reference
- [&lt;msc-line-clampin /> demo](https://blog.lalacube.com/mei/webComponent_msc-line-clampin.html)
- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/element/msc-line-clampin)
