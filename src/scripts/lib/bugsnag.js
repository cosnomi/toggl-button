import bugsnag from 'bugsnag-js';

const client = bugsnag({
  apiKey: process.env.BUGSNAG_API_KEY,
  appVersion: process.env.VERSION,
  releaseStage: process.env.NODE_ENV,
  notifyReleaseStages: ['production', 'development'],
  autoBreadcrumbs: false,
  autoCaptureSessions: false,
  collectUserIp: false,
  beforeSend: function (report) {
    if (localStorage.getItem('sendErrorReports') !== 'true') {
      report.ignore();
      return false;
    }

    report.stacktrace = report.stacktrace.map(function (frame) {
      frame.file = frame.file.replace(/chrome-extension:/g, 'chrome_extension:');
      // Create consistent file paths for source mapping / error reporting.
      frame.file = frame.file.replace(
        /(moz-extension|file):\/\/.*\/scripts\/(.*)/ig,
        'togglbutton://scripts/$2'
      );
      return frame;
    });
  }
});

export default client;
