## Icons

Any `svg` files placed in here will automatically be incorporated into the
iconfont, and made available via icon-[filename] classes.

For example:

* Place `open.svg` in folder.
* File is renamed `uE002-open.svg`
* Iconfont codepoint is accessible in a class like this:

## IMPORTANT

All svg sources must use common dimensions or the results can be erractic. I suggest
square icons out of Illustrator.

## Illustrator

Save your file as SVG with the following settings:

SVG Profiles: SVG 1.1
Fonts Type: SVG
Fonts Subsetting: None
Options Image Location: Embed
Advanced Options
CSS Properties: Presentation Attributes
Decimal Places: 1
Encoding: UTF-8
Output fewer elements: check
Leave the rest unchecked.

```html
<span class="icon icon-open"></span>
```


