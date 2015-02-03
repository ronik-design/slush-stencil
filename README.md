# slush-webhook

> Bootstrapping webhook projects.


## Getting Started

Install your global dependencies.

```bash
$ npm install -g slush ronik-design/slush-webhook wh grunt-cli
```

### Usage

If this is a totally new project, you'll first need to create your webhook site.

```shell
$ wh create [my-site]
```

Run the generator from within the new [my-site] folder:

```shell
$ cd [my-site]
$ slush webhook
```

### Collaborating with git

Create your git repository in github. Don't add any default files.

```shell
$ git init
$ git remote add origin git@github.com:[repo-name].git
$ git commit -a -m "Initial commit"
$ git push origin master
```


## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

Slush does not contain anything "out of the box", except the ability to locate installed slush generators and to run them with liftoff.

To find out more about Slush, check out the [documentation](https://github.com/klei/slush).

## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/ronik-design/slush-webhook/blob/master/CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/ronik-design/slush-webhook/issues).

## License

The MIT License

Copyright (c) 2015, Michael Shick

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

