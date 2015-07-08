# slush-stencil ![npm release](https://img.shields.io/npm/v/slush-stencil.svg?style=flat)

<img src="http://ronik-design.github.io/slush-stencil/img/stencil-logo.svg" height="128" width="128" align="right">

> Bootstrapping websites of all shapes and sizes projects. Build tools, and
  platform selection, supporting static sites with S3 deployment, Webhook CMS-
  powered sites, and a choice of three client-side JS frameworks (Knockout,
  Backbone, React/Flux/alt).

> Created by [Ronik Design](http://www.ronikdesign.com) and used to speed up internal development.

## Features

* Scaffold static sites and [Webhook](http://webhook.com) projects
* Deploy easily to S3 (requires a properly configured AWS account. The easiest approach here is probably `brew install awscli` then `aws configure`)
* Choose from one of three JS approaches, all using [ES6](http://babeljs.io) and [webpack](http://webpack.github.io)
  * Knockout (The most basic setup, for enhancing your static site with some client-side magic)
  * Backbone
  * React w/ [alt](https://github.com/goatslacker/alt) & React Router
* Choose from one of three CSS approaches, all using Stylus
  * Basic setup, using custom utils, project structure and [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
  * Bootstrap, using bootstrap-stylus
  * Skeleton.css
* Iconfont folder and auto compilation through Gulp (creates iconfonts automatically from SVG files and generates classes)
* Image optimization
* Gulp-based build tools are fast!
* Other buzzwords and cool technologies...

## Getting Started

Install your global dependencies.

```sh
$ npm install -g slush slush-stencil
```

> Deployment is optional, you can use Stencil as a simple static site
generator and collection of build tools, but hook into your own publishing process

### Static platform

```sh
$ mkdir [sitename]
$ cd [sitename]
$ slush stencil
```

To develop:

```sh
$ gulp develop
```

And when you're ready to deploy to S3 (and you have your AWS credentials configured):

```sh
$ gulp deploy [--production]
```

### Webhook platform

```sh
$ npm install -g wh grunt-cli
```

If this is a totally new Webhook project, create your Webhook site, then run
Stencil:

```sh
$ wh create [sitename]
$ cd [sitename]
$ slush stencil
```

> Warning! Stencil uses conflict resolution and allows you to reject overwriting
files, BUT you could very easily overwrite something you care about as it spews
a bunch of files and folders into your current directory and merges with your
package.json. Be careful, try it out first on something you don't care about,
commit or backup first. But also, feel free to run it again and again.

To develop:

```sh
$ gulp develop
```

When you're ready to deploy with webhook:

```sh
$ gulp deploy
```

### Collaborating with git

Create your git repository in Github. Don't add any default files.

```shell
$ git init
$ git remote add origin git@github.com:[repo-name].git
$ git add .
$ git commit -am "Initial commit"
$ git branch --set-upstream-to=origin/master
$ git pull --rebase
$ git push origin master
```


## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

Slush does not contain anything "out of the box", except the ability to locate installed slush generators and to run them with liftoff.

To find out more about Slush, check out the [documentation](https://github.com/klei/slush).

## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/ronik-design/slush-website/blob/master/CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/ronik-design/slush-website/issues).
