"use strict";

var Lab = require("lab");
var code = require("code");
var lab = exports.lab = Lab.script();
var server = require("../server");

var expect = code.expect;

lab.experiment("basic static server", function () {

  lab.test("root index responds", function (done) {

    var request = {
      method: "GET",
      url: "/"
    };

    server.inject(request, function (response) {

      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  lab.test("404s are also handled by root index", function (done) {

    var request = {
      method: "GET",
      url: "/404"
    };

    server.inject(request, function (response) {

      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  lab.test("other errors return errors", function (done) {

    var request = {
      method: "GET",
      url: "../../"
    };

    server.inject(request, function (response) {

      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
