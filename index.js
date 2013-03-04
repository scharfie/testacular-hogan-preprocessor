var hogan = require('hogan.js');

var createHoganPreprocessor = function(logger, basePath) {
  var log = logger.create('preprocessor.hogan');

  // TODO - read these from configuration somehow
  var pathPrefix = "app/templates/";
  var templateNamespace = "App.Template.templates";

  return function(content, file, done) {
    var processed = null;
    var templateName = null;
    var templateFunction = null;

    log.debug('Processing "%s".', file.originalPath);
    file.path = file.originalPath.replace(/\.mustache$/, '.js');
    templateName = file.path.split(pathPrefix).pop();
    templateName = templateName.replace(/\.js$/, '')

    try {
      templateFunction = hogan.compile(content, {asString: true});
      processed = templateNamespace + "['" + templateName + "'] = " + templateFunction;
    } catch (e) {
      log.error('%s\n  at %s', e.message, file.originalPath);
    }

    done(processed);
  };
};

createHoganPreprocessor.$inject = [
  'logger', 
  'config.basePath'
];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:hogan': ['factory', createHoganPreprocessor]
};
