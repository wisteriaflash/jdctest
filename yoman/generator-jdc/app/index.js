'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the stupendous' + chalk.red('Jdc') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },
  //
  gruntfile: function () {
    this.template('Gruntfile.js');
  },
  packageJSON: function () {
    this.template('_package.json', 'package.json');
  },
  bower: function () {
    this.template('_bower.json', 'bower.json');
  },
  git: function () {
    this.template('gitignore', '.gitignore');
  },
  jshint: function () {
    this.copy('jshintrc', '.jshintrc');
  },
  editorConfig: function () {
    this.copy('editorconfig', '.editorconfig');
  },
  readme: function () {
    this.template('_readme.md', 'README.md');
  },


  //app
  app: function(){
    this.directory('src');
    this.mkdir('src/base');
    //dist
    this.mkdir('dist');
  },
  baseFiles: function(){
    this.directory('base','src/base');  //copy files
  },

  //install
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
