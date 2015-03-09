# slush-stencil ![npm release](https://img.shields.io/npm/v/slush-stencil.svg?style=flat)

<img src="http://ronik-design.github.io/slush-stencil/img/stencil-logo.svg" height="128" width="128" align="right">

> Bootstrapping websites of all shapes and sizes projects. Build tools, and
  platform selection, supporting static sites with S3 deployment, Webhook CMS-
  powered sites, and a choice of three client-side JS frameworks (jQuery,
  Backbone, React/Flux/alt).
  
> Created by [Ronik Design](http://www.ronikdesign.com) and used to speed up internal development.

## Features

* Scaffold [Webhook](http://webhook.com) projects
* Scaffold simple static (swig-templated) projects and deploy easily to S3 (requires a properly configured AWS account. The easiest approach here is probabl `brew install awscli` then `aws configure`)
* Choose from one of three JS approach, all using [ES6](http://babeljs.io) and [webpack](http://webpack.github.io)
  * jQuery (Simple module folder scaffolding, plus underscore/lodash)
  * Backbone
  * React w/ [alt](https://github.com/goatslacker/alt), react-router & [react-hot-loader](https://github.com/gaearon/react-hot-loader)
* Stylus styles, with documentation on best practices including [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
* Iconfont folder and auto compilation through Gulp (creates iconfonts automatically from SVG files and generates classes)
* Image optimization
* Gulp-based build tools are fast!
* Other buzzwords and cool technologies...

## Getting Started

Install your global dependencies.

```bash
$ npm install -g slush slush-stencil
```

and for Webhook

```shell
$ npm install -g wh grunt-cli
```

### Usage

> Warning! This generator uses conflict resolution with your input, BUT you could very easily overwrite something you care about as it spews a bunch of files and folders into your current directory and merges with your package.json. Be careful, try it out first on something you don't care about, commit or backup first. But also, feel free to run it again and again.

If this is a totally new Webhook project, you'll first need to create your Webhook site.

```shell
$ wh create [my-site]
```

Otherwise, make a new directory

```shell
$ mkdir [my-site]
```

Run the generator from within the new [my-site] folder:

```shell
$ cd [my-site]
$ slush stencil
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
