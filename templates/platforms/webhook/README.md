# {SLUSH{=name}} ({SLUSH{=domain}})

> {SLUSH{=description}}

> To launch a simple demo, utilizing your selections and providing some code
  to get started, run `gulp serve` and then visit `localhost:2002/demo`

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

> *This uses the Webhook deploy process -- you should have already created
  a site in this folder.

## Directory structure

* `assets` place files and directories to be directly copied to the output /
  static directory.

* `icons` place `svg` files you would like automatically compiled into an icon
  font. The filename becomes the basis for an auto-generated set of classes.

* `images` static images (backgrounds, etc) that you want optimized.

* `scripts` client-side JS, to be compiled with Browserify. Code style dictates
  use of ES6 (all files are transpiled using babel) and the `jsx` extension
  when appropriate.

* `styles` all site styles, written in Stylus. `nib`, and `rupture` available,
  along with your chosen framework (Basic, Bootstrap, Skeleton)

* `pages` where your page templates live. These get converted into site pages.
  Uses Webhook-flavored swig.

* `templates` supporting template files -- some Webhook templates may conflict

* `tasks` are all the gulp tasks for the project. caveat lector

### This site was made using slush-stencil

You can find it here: [slush-stencil](http://ronik-design.github.io/slush-stencil/)

### This is a Webhook powered website.

This is the boilerplate readme installed whenever you create a [Webhook CMS](http://www.webhook.com) powered site. You should probably replace it with information specific to your site.

* [Documentation for users found here.](http://webhook.com/docs/)
* [Documentation for code contributors found here.](https://github.com/webhook/webhook-generate/blob/master/CONTRIBUTING.md)

{SLUSH{ if (css === 'bootstrap') { }}}
> Boostrap Note
  Bootstrap component JS is made available in `scripts` via a webpack alias.
  You can import components individually like, e.g. `import 'bootstrap/alert'`
{SLUSH{ } }}
