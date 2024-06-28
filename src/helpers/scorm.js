/*
 * Developer: Craig Stowers
 * Email: craig.stowers@outlook.com
 * Website: craigstowers.com
 * Date: 20/02/2024
 * Description: SCORM wrapper which finds hosts API and provides common interaction helpers
 */

// Set var to test system outside of SCORM compliant LMS
// Only using for testing when. not in the LMS
var APIOFFLINE = false;

// Put all vars and functions under _scorm object
// to keep global clean.
const _scorm = {};

_scorm.userdat = {
   studentid: null,
   studentname: null,
   firstname: null,
   lastname: null,
};
_scorm.currentpage = null;
_scorm.starttimestamp = null;
_scorm.processedunload = false;
_scorm.reachedend = false;

//Constants
_scorm.SCORM_TRUE = "true";
_scorm.SCORM_FALSE = "false";
_scorm.SCORM_NO_ERROR = "0";

//Since the Unload handler will be called twice, from both the onunload
//and onbeforeunload events, ensure that we only call LMSFinish once.
_scorm.finishCalled = false;

//Track whether or not we successfully initialized.
_scorm.findAPITries = 0;
_scorm.initialized = false;
_scorm.API = null;

_scorm.initScorm = function () {
   console.log("init scorm");
   //record the time that the learner started the SCO so that we can report the total time
   _scorm.startTimeStamp = new Date();

   if (!APIOFFLINE) {
      // If we are NOT testing
      //initialize communication with the LMS
      _scorm.scormProcessInitialize();
      //it's a best practice to set the lesson status to incomplete when
      //first launching the course (if the course is not already completed)
      var completionStatus = _scorm.scormProcessGetValue("cmi.core.lesson_status");
      if (completionStatus === "not attempted") {
         _scorm.scormProcessSetValue("cmi.core.lesson_status", "incomplete");
      }

      if (_scorm.initialized) {
         var sid = _scorm.scormProcessGetValue("cmi.core.student_id");
         var sname = _scorm.scormProcessGetValue("cmi.core.student_name");
         //_scorm.scormProcessGetValue("cmi.core.lesson_status");
         //_scorm.scormProcessGetValue("cmi.core.entry");
         //_scorm.scormProcessGetValue("cmi.core.total_time");
         //_scorm.scormProcessGetValue("cmi.core.lesson_mode");
         var nameparts = sname.split(", ");
         _scorm.userdat.studentid = sid;
         _scorm.userdat.studentname = sname;
         _scorm.userdat.firstname = nameparts[1].trim();
         _scorm.userdat.lastname = nameparts[0].trim();
      } else {
         _scorm.userdat.studentid = "Unknown";
         _scorm.userdat.studentname = "Unknown";
         _scorm.userdat.firstname = "Unknown";
         _scorm.userdat.lastname = "Unknown";
      }
   } else {
      // If APIOFFILNE set to true
      // Just set the main students vars so we can test
      _scorm.initialized = true;
      _scorm.userdat.studentid = "gulbisander@gmail.com";
      _scorm.userdat.studentname = "Gulbis, Andre";
      _scorm.userdat.firstname = "Andre";
      _scorm.userdat.lastname = "Gulbis";
   }

   // Tell rest of code (Leaderboard) that SCORM init has finished
   //$("body").trigger("scorm-initcomplete");
};

_scorm.setLessonStatusComplete = function () {
   _scorm.reachedEnd = true;
   _scorm.scormProcessSetValue("cmi.core.lesson_status", "completed");
};

_scorm.doExit = function () {
   //note use of short-circuit AND. If the user reached the end, don't prompt.
   //just exit normally and submit the results.
   if (_scorm.reachedEnd === false && window.confirm("Would you like to save your progress to resume later?")) {
      //set exit to suspend
      _scorm.scormProcessSetValue("cmi.core.exit", "suspend");
   } else {
      //set exit to normal
      _scorm.scormProcessSetValue("cmi.core.exit", "");
   }
   //process the unload handler to close out the session.
   //the presense of an adl.nav.request will cause the LMS to
   //take the content away from the user.
   _scorm.doUnload(true);
};

_scorm.doUnload = function (pressedExit) {
   //don't call this function twice

   if (!_scorm.initialized) return;
   if (_scorm.processedUnload === true) {
      return;
   }
   _scorm.processedUnload = true;
   //record the session time
   var endTimeStamp = new Date();

   var totalMilliseconds = endTimeStamp.getTime() - _scorm.startTimeStamp.getTime();
   var scormTime = _scorm.convertMilliSecondsToSCORMTime(totalMilliseconds, false);
   _scorm.scormProcessSetValue("cmi.core.session_time", scormTime);
   //if the user just closes the browser, we will default to saving
   //their progress data. If the user presses exit, he is prompted.
   //If the user reached the end, the exit normall to submit results.
   if (pressedExit === false && _scorm.reachedEnd === false) {
      _scorm.scormProcessSetValue("cmi.core.exit", "suspend");
   }
   _scorm.scormProcessFinish();
};

window.onunload = _scorm.doUnload;
window.onbeforeunload = _scorm.doUnload;

//called from the assessmenttemplate.html page to record the results of a test
//passes in score as a percentage
_scorm.recordTest = function (score) {
   _scorm.scormProcessSetValue("cmi.core.score.raw", score);
   _scorm.scormProcessSetValue("cmi.core.score.min", "0");
   _scorm.scormProcessSetValue("cmi.core.score.max", "100");
   //if we get a test result, set the lesson status to passed/failed instead of completed
   //consider 70% to be passing
   if (score >= 70) {
      _scorm.scormProcessSetValue("cmi.core.lesson_status", "passed");
   } else {
      _scorm.scormProcessSetValue("cmi.core.lesson_status", "failed");
   }
};

//SCORM requires time to be formatted in a specific way
_scorm.convertMilliSecondsToSCORMTime = function (intTotalMilliseconds, blnIncludeFraction) {
   var intHours;
   var intMinutes;
   var intSeconds;
   var intMilliseconds;
   var intHundredths;
   var strCMITimeSpan;
   if (blnIncludeFraction === null || blnIncludeFraction === undefined) {
      blnIncludeFraction = true;
   }
   //extract time parts
   intMilliseconds = intTotalMilliseconds % 1000;
   intSeconds = ((intTotalMilliseconds - intMilliseconds) / 1000) % 60;
   intMinutes = ((intTotalMilliseconds - intMilliseconds - intSeconds * 1000) / 60000) % 60;
   intHours = (intTotalMilliseconds - intMilliseconds - intSeconds * 1000 - intMinutes * 60000) / 3600000;
   /*
	deal with exceptional case when content used a huge amount of time and interpreted CMITimstamp 
	to allow a number of intMinutes and seconds greater than 60 i.e. 9999:99:99.99 instead of 9999:60:60:99
	note - this case is permissable under SCORM, but will be exceptionally rare
	*/
   if (intHours === 10000) {
      intHours = 9999;
      intMinutes = (intTotalMilliseconds - intHours * 3600000) / 60000;
      if (intMinutes === 100) {
         intMinutes = 99;
      }
      intMinutes = Math.floor(intMinutes);
      intSeconds = (intTotalMilliseconds - intHours * 3600000 - intMinutes * 60000) / 1000;
      if (intSeconds === 100) {
         intSeconds = 99;
      }
      intSeconds = Math.floor(intSeconds);
      intMilliseconds = intTotalMilliseconds - intHours * 3600000 - intMinutes * 60000 - intSeconds * 1000;
   }
   //drop the extra precision from the milliseconds
   intHundredths = Math.floor(intMilliseconds / 10);
   //put in padding 0's and concatinate to get the proper format
   strCMITimeSpan =
      _scorm.zeroPad(intHours, 4) + ":" + _scorm.zeroPad(intMinutes, 2) + ":" + _scorm.zeroPad(intSeconds, 2);
   if (blnIncludeFraction) {
      strCMITimeSpan += "." + intHundredths;
   }
   //check for case where total milliseconds is greater than max supported by strCMITimeSpan
   if (intHours > 9999) {
      strCMITimeSpan = "9999:99:99";
      if (blnIncludeFraction) {
         strCMITimeSpan += ".99";
      }
   }
   return strCMITimeSpan;
};

_scorm.zeroPad = function (intNum, intNumDigits) {
   var strTemp;
   var intLen;
   var i;
   //strTemp = new String(intNum);
   strTemp = intNum;
   intLen = strTemp.length;
   if (intLen > intNumDigits) {
      strTemp = strTemp.substr(0, intNumDigits);
   } else {
      for (i = intLen; i < intNumDigits; i++) {
         strTemp = "0" + strTemp;
      }
   }
   return strTemp;
};

_scorm.scormProcessGetValue = function (element) {
   var result;
   if (_scorm.initialized === false || _scorm.finishCalled === true) {
      return;
   }
   result = _scorm.API.LMSGetValue(element);
   console.log("SCORM, scormProcessGetValue() > result", result);
   if (result === "") {
      var errorNumber = _scorm.API.LMSGetLastError();
      if (errorNumber !== _scorm.SCORM_NO_ERROR) {
         var errorString = _scorm.API.LMSGetErrorString(errorNumber);
         var diagnostic = _scorm.API.LMSGetDiagnostic(errorNumber);
         var errorDescription =
            "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
         console.log("Error - Could not retrieve a value from the LMS.\n\n" + errorDescription);
         return "";
      }
   }
   return result;
};

_scorm.scormProcessSetValue = function (element, value) {
   var result;
   if (_scorm.initialized === false || _scorm.finishCalled === true) {
      return;
   }
   result = _scorm.API.LMSSetValue(element, value);
   if (result === _scorm.SCORM_FALSE) {
      var errorNumber = _scorm.API.LMSGetLastError();
      var errorString = _scorm.API.LMSGetErrorString(errorNumber);
      var diagnostic = _scorm.API.LMSGetDiagnostic(errorNumber);
      var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
      console.log(
         "Error - Could not store a value in the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription
      );
      return;
   }
};

_scorm.scormProcessInitialize = function () {
   var result;
   _scorm.API = _scorm.getAPI();
   if (_scorm.API == null) {
      console.log("ERROR - Could not establish a connection with the LMS.\n\nYour results may not be recorded.");
      return;
   }
   result = _scorm.API.LMSInitialize("");
   if (result === _scorm.SCORM_FALSE) {
      var errorNumber = _scorm.API.LMSGetLastError();
      var errorString = _scorm.API.LMSGetErrorString(errorNumber);
      var diagnostic = _scorm.API.LMSGetDiagnostic(errorNumber);
      var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
      console.log(
         "Error - Could not initialize communication with the LMS.\n\nYour results may not be recorded.\n\n" +
            errorDescription
      );
      return;
   }
   _scorm.initialized = true;
};

_scorm.scormProcessFinish = function () {
   var result;

   console.log("terminate");
   //Don't terminate if we haven't initialized or if we've already terminated
   if (_scorm.initialized === false || _scorm.finishCalled === true) {
      return;
   }

   result = _scorm.API.LMSFinish("");
   _scorm.finishCalled = true;
   //$("body").trigger("scorm-finished");
   if (result === _scorm.SCORM_FALSE) {
      var errorNumber = _scorm.API.LMSGetLastError();
      var errorString = _scorm.API.LMSGetErrorString(errorNumber);
      var diagnostic = _scorm.API.LMSGetDiagnostic(errorNumber);
      var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
      console.log(
         "Error - Could not terminate communication with the LMS.\n\nYour results may not be recorded.\n\n" +
            errorDescription
      );
      return;
   }
};

_scorm.findAPI = function (win) {
   // Check to see if the window (win) contains the API
   // if the window (win) does not contain the API and
   // the window (win) has a parent window and the parent window
   // is not the same as the window (win)
   while (win.API == null && win.parent != null && win.parent !== win) {
      // increment the number of findAPITries
      _scorm.findAPITries++;
      // Note: 7 is an arbitrary number, but should be more than sufficient
      if (_scorm.findAPITries > 7) {
         console.log("Error finding API -- too deeply nested.");
         return null;
      }
      // set the variable that represents the window being
      // being searched to be the parent of the current window
      // then search for the API again
      win = win.parent;
   }
   return win.API;
};

_scorm.getAPI = function () {
   // start by looking for the API in the current window
   var theAPI = _scorm.findAPI(window);
   // if the API is null (could not be found in the current window)
   // and the current window has an opener window
   if (theAPI == null && window.opener != null && typeof window.opener != "undefined") {
      // try to find the API in the current window’s opener
      theAPI = _scorm.findAPI(window.opener);
   }
   // if the API has not been found
   if (theAPI == null) {
      // Alert the user that the API Adapter could not be found
      console.log("Unable to find an API adapter");
   }
   return theAPI;
};

export default _scorm;
