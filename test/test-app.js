'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('CSSSR Project generator', function () {
  var preset = {
    name: 'Belka Project',
    repo: 'strelka-repo'
  };

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(preset)
      .on('end', done);
  });

  it('creates package.json', function () {
    assert.file('package.json');
    assert.fileContent('package.json', /"name"\: "strelka-repo"/gi);
    assert.fileContent('package.json', /"url"\: ".+strelka-repo\.git"/gi);
  });

  it('creates readme.md', function () {
    assert.file('readme.md');
    assert.fileContent('readme.md', /# Belka Project/gi);
  });

  it('creates basic project tree', function () {
    assert.file([
      'app/blocks/head/head.jade',
      'app/blocks/icon/icon.jade',
      'app/blocks/layout-default/layout-default.jade',
      'app/blocks/scripts/scripts.jade',
      'app/pages/index.jade',
      'app/scripts/app.js',
      'app/styles/base/base.styl',
      'app/styles/base/fonts.styl',
      'app/styles/base/optimize.styl',
      'app/styles/helpers/mixins.styl',
      'app/styles/helpers/variables.styl',
      'app/styles/app.styl'
    ]);
  });
});
