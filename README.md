Welcome to the Meetup Event Planner app by Ulrik H. Gade.

USE

To use the app, build the project (see below) then install the 'build' folder on your Web server and go to 'index.html' in a modern Web browser (as of early 2016). Install e.g. WAMP to run the app locally on your own machine.

Choose "Sign Up" from the front page to create an account, and take it from there.

If your server does not provide a secure connection, you may need to enter your default location (in Account Settings) to get location suggestions to work.

Fair warning: Don't use the app for anything serious: this is a study project, not a commercial-grade service. You may very well loose all the data you enter, and have your password exposed. I am not actively maintaining the app; it may fail as time progresses.

BUILD

You can build the app yourself from the source using gulp in Node.js (see gulpfile.js for details).

Start by running 'npm install' in Node.js from the root directory (i.e. the one where this readme file resides) to install the required modules. Ignore any NPM warnings re. deprecated versions of some dependencies: usually, this is just the module devs falling behind on maintenance, with no relevant adverse effects for this project.

Then call 'gulp' to run the default build script, which should get everything ready for you. Or, run 'gulp setup' to just get ready for development without doing a complete build.

TEST

After completing the build, open 'src/test/test-runner.html' in a Web browser to run the unit and UI test suites. Expect the UI part to open and close a bunch of windows and popups, and the whole thing to last app. 60-70 secs secs.

To run the tests on the source files, change the setup of 'app.testutil.testTarget' in test-runner.html (see source for details). Even if only working on the source, you must run a full build at least once before the tests can run.

Known limitations: 1) The autocomplete/suggest tests may create false negatives. For now, just run the suite repeatedly until they pass. 2) The automated tests mess up local storage. Use a separate browser for actual use/manual testing.


ABOUT

I created this app in early 2016 as an exercise in user-friendly front-end form design for my Senior Web Developer Nanodegree course at Udacity.com.

I also used the app to experiment with cross-browser/platform, "classical" object-oriented programming in JavaScript, as well as modern build and testing tools. This ended up getting as involved as it was educational.

Please see the source code, docs and UML models in my Github repo for more technical details. 