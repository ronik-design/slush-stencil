# {SLUSH{=name}} ({SLUSH{=domain}})

> {SLUSH{=description}}

> To launch a simple demo, utilizing your selections and providing some code
  to get started, run `gulp serve` then visit `localhost:2002/demo` in your browser

## Useful commands

Prints all available top-level gulp tasks / commands.

```shell
$ gulp
```

Builds, starts watch tasks, and launches the dev server.

```shell
$ gulp develop
```

Builds all files, as for a release

```shell
$ gulp build
```

Lint your js (gulp stuff mostly, optionally client-side JS),
also happens automatically before a build.

```shell
$ gulp lint [--scripts]
```

Put your website somewhere people can see it!*

```shell
$ gulp deploy
```

> *This requires credentials acceptable to [s3-website](https://github.com/klaemo/s3-website)
  and generally doing things s3 allows (your bucket name must be unique)

> `--production` flag publishes to the primary domain, by default the domain has
  `stage.` prepended.

## Directory structure

* `assets` place files and directories to be directly copied to the output /
  static directory.

* `sprites` place `svg` files you would like automatically compiled into a svg icon
  stack.

* `images` static images (backgrounds, etc) that you want optimized.

* `scripts` client-side JS, to be compiled with Webpack. Code style dictates
  use of ES6 (all files are transpiled using babel) and the `jsx` extension
  when appropriate.

* `styles` all site styles, written in Stylus. `nib`, and `rupture` available,
  along with your chosen framework (Basic, Bootstrap, Skeleton)

* `data` json files that can store page data for swig templates

* `pages` where your page templates live. These get converted into site pages. Uses swig.

* `templates` supporting template files

* `tasks` are all the gulp tasks for the project. caveat lector

### This site was made using slush-stencil

You can find it here: [slush-stencil](http://ronik-design.github.io/slush-stencil/)

{SLUSH{ if (cssFramework === 'bootstrap') { }}}
> Boostrap Note
  Bootstrap component JS is made available in `scripts` via a webpack alias.
  You can import components individually like, e.g. `import 'bootstrap/alert'`
{SLUSH{ } }}
