# slush-website

> Bootstrapping websites of all shapes and sizes projects. Build tools, and
  platform selection, supporting static sites with S3 deployment, Webhook CMS-
  powered sites, and a choice of three client-side JS frameworks (jQuery,
  Backbone, React/Flux/alt).

## Getting Started

Install your global dependencies.

```bash
$ npm install -g slush ronik-design/slush-website
```

and for Webhook

```shell
$ npm install -g wh grunt-cli
```

### Usage

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
$ slush website
```

### Collaborating with git

Create your git repository in github. Don't add any default files.

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
