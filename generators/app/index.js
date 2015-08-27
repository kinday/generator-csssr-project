'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
var git = require('simple-git')();
var path = require('path');
var rimraf = require('rimraf');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Your journey starts here...'));
    this.log([
      'If you continue, this will',
      chalk.red('delete everything'),
      'in the \'',
      chalk.blue('app'),
      '\' directory and',
      chalk.red('reset'),
      'local repo and its settings.'
    ].join(' '));

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name:'
      },
      {
        type: 'input',
        name: 'repo',
        message: 'Repo name: ' + chalk.dim('github.com/CSSSR/'),
        default: function (props) {
          return _.kebabCase(props.name);
        },
        filter: function (prop) {
          return _.kebabCase(prop);
        }
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;

      done();
    }.bind(this));
  },

  default: {
    rimraffing: function () {
      this.log(chalk.red('delete'), 'Previous repository');
      rimraf.sync(this.destinationPath('.git'));

      this.log(chalk.red('delete'), 'Previous package.json');
      rimraf.sync(this.destinationPath('package.json'));

      this.log(chalk.red('delete'), 'Previous Readme');
      rimraf.sync(this.destinationPath('readme.md'));

      this.log(chalk.red('delete'), 'Previous /app');
      rimraf.sync(this.destinationPath('app'));
    }
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          name: _.kebabCase(this.props.name),
          repo: this.props.repo
        }
      );

      this.fs.copyTpl(
        this.templatePath('_readme.md'),
        this.destinationPath('readme.md'),
        {
          name: this.props.name,
          repo: this.props.repo
        }
      );

      this.fs.copy(
        this.templatePath('static/**/*'),
        this.destinationPath('app')
      );
    },
  },

  end: {
    git: function () {
      var url = [
        'https://github.com/CSSSR/',
        this.props.repo,
        '.git'
      ].join('');

      git
        .init()
        .addRemote('origin', url)
        .add('./*')
        .commit('chore(' + this.props.repo + '): init');
    }
  }
});
