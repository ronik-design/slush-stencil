## SVG Sprites

Any `svg` files placed in here will automatically be incorporated into a svg
stack, and can then be used via the `<use>` tag in your templates. The
different directories create different stacks. e.g. `sprites/icons` -> 
`sprites/icons.stack.svg`

For example:

* Place `open.svg` in folder `sprites/icons`.
* The `sprites/icons.stack.svg` file will be updated
* You can now reference it in your code.

```html
<svg><use xlink:href="/sprites/icons.stack.svg#open"></use></svg>
```
