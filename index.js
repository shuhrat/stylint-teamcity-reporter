var tsm = require('teamcity-service-messages');

var messagesByFile = {};

var REPORTER = 'Stylint';
var NEW_LINE = '\n';

// return messages as string instead of printing to stdout
tsm.stdout = false;

/**
 * @description format output message for console (default)
 * @param  {String} message  error msg from one of the checks
 * @param  {String} done whether or not this is the last message to output
 * @return {String | Function} either the formatted msg or done()
 */
module.exports = function (message, done) {
    var cache = this.cache;
    var options = this.config.reporterOptions || {};

    if (done === 'done') {
        var report = [];

        report.push(
            tsm.testSuiteStarted({name: REPORTER})
        );

        var files = Object.keys(messagesByFile);

        files.forEach(function(file) {
            var fileErrors = messagesByFile[file];

            report.push(tsm.testSuiteStarted({name: file}));

            fileErrors.forEach(function(error) {
                var errorName = error.rule;

                report.push(
                    tsm.testStarted({ name: errorName }),
                    tsm.testFailed({
                        name: errorName,
                        message: error.message,
                        detailed: error.detailed
                    }),
                    tsm.testFinished({ name: errorName })
                );
            });

            report.push(tsm.testSuiteFinished({name: file}));
        });

        // If there were no errors, tell TeamCity that tests ran successfully
        if (files.length === 0) {
            report.push(
                tsm.testStarted({ name: REPORTER}),
                tsm.testFinished({ name: REPORTER})
            );
        }

        report.push(
            tsm.testSuiteFinished({name: REPORTER})
        );

        this.cache.msg = report.join(NEW_LINE);

        return this.done();
    }

    var file = cache.file;
    var optionsSeverity = (options.severity || 'all').toLowerCase();

    if (optionsSeverity !== 'all') {
        var severity = this.state.severity.toLowerCase();

        if (severity !== optionsSeverity ) return '';
    }

    messagesByFile[file] || (messagesByFile[file] = []);

    messagesByFile[file].push({
        rule: cache.rule,
        message: message,
        detailed: message + ' at line ' + cache.lineNo
    });

    return '';
};
