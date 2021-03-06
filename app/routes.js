// External dependencies
const express = require("express");
const router = express.Router();
const patient = require('./data/patient.js');
const gpInfo = require('./data/gp-info.js');

/* ---------------------------------------- */
/* ----------------ROUTES------------------ */
/* ---------------------------------------- */
router.use("/", require('./routes/pnl.js'))
/* ---------------------------------------- */
/* ---------------------------------------- */
/* ---------------------------------------- */

// This cheeky function just grabs the first part of the url after the first forward slash
// It will return just the 'v1' or 'v5' depending on what is passed to it
// This means there is no need for duplicate code for each iteration
// oh and it only works up to to v9
function getVersion(a) {
  var secondBracket = a.url.indexOf('/', 1);
  return a.url.substring(1, secondBracket) || "v1";
}

router.post('/v12/choose-defer-reason', function (req, res) {
  //console.log('choosing a deferral!!')
  var deferReason = req.session.data['pnl-defer-reason'];
  //console.log("defer reason: " + deferReason)

  var minMonths = '';
  var maxMonths = '';

  if (deferReason == 'Recent test') {
    minMonths = '1';
    maxMonths = '3';
  } else {
    minMonths = '3';
    maxMonths = '12';
  }

  req.session.data['minMonths'] = minMonths;
  req.session.data['maxMonths'] = maxMonths;

  res.redirect("/" + getVersion(req) + "/prior-notification/prior-notification-12-defer-length");
})


router.post("/*/patient/change-due-date/change", function(req, res) {
  var reason = req.session.data["reason"];
  // Check whether the variable matches a condition
  if (
    reason == "No cervix" ||
    reason == "Cease - Patient choice" ||
    reason == "Mental capacity act" ||
    reason == "Receiving radiotherapy" ||
    reason == "Aged over 65" ||
    reason == "Patient choice" ||
    reason == "Cease - Other reason"
  ) {
    // Send user to next page
    res.redirect("/" + getVersion(req) + "/patient/change-due-date/enter-reason-check-cease");
  } else {
    // Send user to ineligible page
    res.redirect("/" + getVersion(req) + "/patient/change-due-date/enter-test-date"
    );
  }
});

router.post("/csass/add-test-result/v2/change", function(req, res) {
  var reason = req.session.data["change-due-date"];
  if (reason == "Defer") {
    res.redirect("/archive/csass/add-test-result/v2/defer");
  } else {
    res.redirect("/archive/csass/add-test-result/v2/cease");
  }
});

router.post("/csass/add-test-result/v1/change", function(req, res) {
  var reason = req.session.data["change-due-date"];
  if (reason == "Defer") {
    res.redirect("/archive/csass/add-test-result/v1/defer");
  } else {
    res.redirect("/archive/csass/add-test-result/v1/cease");
  }
});

router.post("/*/hmr101/choose", function(req, res) {
  var reason = req.session.data["choose"];
  console.log(reason);
  if (reason == "print") {
    res.redirect("/" + getVersion(req) + "/patient/hmr101/preview");
  } else {
    if (getVersion(req) == 'v8') {
      res.redirect("/" + getVersion(req) + "/patient/hmr101/confirm-address");
    } else {
      res.redirect("/" + getVersion(req) + "/patient/hmr101/confirm-address");
    }
  }
});

router.post("/*/hmr101/episode-address", function(req, res) {
  var reason = req.session.data["episode-address"];
  console.log(reason);
  if (reason == "new") {
    res.redirect("/" + getVersion(req) + "/patient/hmr101/postcode-lookup");
  } else {
    res.redirect("/" + getVersion(req) + "/patient/hmr101/step-1");
  }
});

router.post("/*/hmr101/confirm-address", function (req, res) {
  console.log('working')
  var confirmAddress = req.session.data["confirmAddress"];

  console.log("check reason: " + confirmAddress);
  if (confirmAddress == "yes") {
    res.redirect("/" + getVersion(req) + "/patient/hmr101/step-1");
  }

  if (confirmAddress == "no") {
      res.redirect("/" + getVersion(req) + "/patient/hmr101/episode-address");
  }
});

router.post("/*/worklists-v9b/rejected-exceeds-letter-time", function (req, res) {
  console.log('working')
  var rejectAction = req.session.data["rejectAction"];

  console.log("check reason: " + rejectAction);
  if (rejectAction == "log") {
    res.redirect("/v12/worklists-v9b/rejected-exceeds-letter-time-log");
  }

  if (rejectAction == "delete") {
      res.redirect("/v12/worklists-v9b/rejected-delete");
  }
});

router.post("/*/worklists-v9b/rejected-invalid", function (req, res) {
  console.log('working')
  var rejectAction = req.session.data["rejectAction"];

  console.log("check reason: " + rejectAction);
  if (rejectAction == "log") {
    res.redirect("/v12/worklists-v9b/rejected-invalid-log");
  }

  if (rejectAction == "delete") {
      res.redirect("/v12/worklists-v9b/rejected-delete");
  }
});

router.post("/*/hmr101/cervix", function(req, res) {
  var reason = req.session.data["cervix"];
  console.log(reason);
  if (reason == "cervix") {
    res.redirect("/" + getVersion(req) + "/patient/hmr101/address");
  } else {
    res.redirect("/" + getVersion(req) + "/patient/hmr101/address");
  }
});

router.post("/*/change-due-date", function(req, res) {
  if (req.session.data["recall"] == "defer") {
    res.redirect("/" + getVersion(req) + "/patient/patient-summary-deferred");
  }

  if (req.session.data["recall"] == "cease") {
    res.redirect("/" + getVersion(req) + "/patient/patient-summary-ceased");
  }

  res.redirect("/" + getVersion(req) + "/patient/patient-summary-deferred");
});

router.post("/*/enter-test-result", function (req, res) {
  req.session.data["pnl_update_msg_show"] = 0;
  var testType = req.session.data['result-type'];
  if (testType == "Abroad") {
    res.redirect("/" + getVersion(req) + "/patient/add-test-result/add-test-result-test-info");
  }

  res.redirect("/" + getVersion(req) + "/patient/add-test-result/add-test-result-details");
});
router.post("/*/enter-logged-test-result", function (req, res) {
  req.session.data["pnl_update_msg_show"] = 0;
  var testType = req.session.data['result-type'];
  if (testType == "Abroad") {
    res.redirect("/" + getVersion(req) + "/patient/log-test-result/log-test-result-test-info");
  }

  res.redirect("/" + getVersion(req) + "/patient/log-test-result/log-test-result-details");
});

router.post("/*/enter-add-logged-test-result", function (req, res) {
  req.session.data["pnl_update_msg_show"] = 0;
  var testType = req.session.data['result-type'];
  if (testType == "Abroad") {
    res.redirect("/" + getVersion(req) + "/patient/add-logged-result/add-log-test-result-test-info");
  }

  res.redirect("/" + getVersion(req) + "/patient/add-logged-result/add-log-test-result-details");
});

router.post("/search-v2/", function (req, res) {
  var nhsNumber = req.session.data["searchnhs"];

  if (nhsNumber == "3816158897") {
    res.redirect("/archive/sample-taker/v2/history");
  }
  if (nhsNumber == "6170211547") {
    res.redirect("/archive/sample-taker/v2/history-routine");
  }
  if (nhsNumber == "7594384164") {
    res.redirect("/archive/sample-taker/v2/history-colposcopy");
  }
  console.log("not found");
});

router.post("/*/patient/search/search", function(req, res) {
  var nhsNumber = req.session.data["searchnhs"];

  // Male not in cohort
  if (nhsNumber == "8344690382") {
    res.redirect("/" + getVersion(req) + "/pds/search/search-all-results-forNHSno");
  }

  req.session.data["addresult_update_msg_show"] = 0;
  if (getVersion(req) == 'v9' || 'v10' || 'v11' || 'v12') {
    console.log('try to get the patient out of the database')
    const patientSummary = patient.getPatient(nhsNumber);
    req.session.data['patientSummary'] = patientSummary;
    //console.log(patientSummary);
  }
  else {
    if (nhsNumber == "6170211547") {
      req.session.data["nhsNumber"] = "617 021 1547";
      req.session.data["title"] = "Miss";
      req.session.data["firstName"] = "Josie";
      req.session.data["lastName"] = "Jackson";
      req.session.data["dob"] = "29 years (4 June 1991)";
      req.session.data["ntdd"] = "09 04 2025";
      req.session.data["reason"] = "";
      req.session.data["status"] = "ROUTINE";
      req.session.data["address"] = "19 Polly Fall Close, Bradford, BD10 3RT";
      res.redirect("/" + getVersion(req) + "/patient/patient-summary");
    }

    // Referred to colposcopy - Recall is 6 months away
    if (nhsNumber == "7594384164") {
      req.session.data["nhsNumber"] = "759 438 4164";
      req.session.data["title"] = "Mrs";
      req.session.data["firstName"] = "Francesca";
      req.session.data["lastName"] = "Williams";
      req.session.data["dob"] = "40 years (15 Dec 1979)";
      req.session.data["ntdd"] = "09 04 2020";
      req.session.data["reason"] = "";
      req.session.data["status"] = "REFERRED TO COLPOSCOPY";
      req.session.data["address"] = "19 Polly Fall Close, Bradford, BD10 3RT";
      res.redirect("/" + getVersion(req) + "/patient/patient-summary");
    }

    // Ceased
    if (nhsNumber == "3816158897") {
      req.session.data["nhsNumber"] = "381 615 8897";
      req.session.data["title"] = "Mrs";
      req.session.data["firstName"] = "Francesca";
      req.session.data["lastName"] = "Williams";
      req.session.data["dob"] = "40 years (15 Dec 1979)";
      req.session.data["ntdd"] = "09 04 2020";
      req.session.data["status"] = "ceased";
      req.session.data["reason"] = "no cervix";
      req.session.data["address"] = "19 Polly Fall Close, Bradford, BD10 3RT";
      req.session.data["alreadyCeased"] = true;
      res.redirect("/" + getVersion(req) + "/patient/patient-summary");
    }

     
  }

   
  const patVersion = req.session.data["patversion"];

  if (patVersion >= '2') {
    res.redirect("/" + getVersion(req) + "/patient/patient-summary-" + patVersion);
  } else {
    res.redirect("/" + getVersion(req) + "/patient/patient-summary");
  }

});

router.post("/*/prior-notification-4-check", function (req, res) {
  var invite = req.session.data["pnl-invite"];

  if (invite == "yes") {
    res.redirect(
      "/" +
        getVersion(req) +
        "/prior-notification/prior-notification-4-confirmation"
    );
  } else {
    res.redirect(
      "/" + getVersion(req) + "/prior-notification/prior-notification-4"
    );
  }
});

router.post("/*/prior-notification-6-check", function (req, res) {
  var invite = req.session.data["pnl-invite"];

  if (invite == "yes") {
    res.redirect(
      "/" +
      getVersion(req) +
      "/prior-notification/prior-notification-6-confirmation"
    );
  } else {
    res.redirect(
      "/" + getVersion(req) + "/prior-notification/prior-notification-6"
    );
  }
});


// v8/non-responder/example"
router.post("/v8/non-responder/example", function (req, res) {
  console.log ('checking age!!')
var age = req.session.data['age'];

if (age == 'yes') {
  res.redirect("/v8/non-responder/yes");
}

if (age == 'no') {
  res.redirect("/v8/non-responder/no");
}
  //  default action if nothing selected

})

router.get("/*/start-adding-test*", function (req, res) {
    console.log("START ADDING TEST");
    req.session.data["addresult_update_msg_show"] = 0;
    const params = new URLSearchParams(req.query);
    const nhsNumber = params.get('nhsNumber');
    //const version = params.get('pnlversion');
    //req.session.data["pnlversion"] = version;
    var pnlPatient = patient.getPatient(nhsNumber);
    req.session.data["pnl_patient"] = pnlPatient;
    req.session.data['action-text'] = "";
    req.session.data['result-action'] = "";
    req.session.data['result-infection'] = "";
    req.session.data['infection-text'] = "";
    req.session.data['result-text'] = "";
    req.session.data['result-result'] = "";
    req.session.data['example-year'] = "";
    req.session.data['example-month'] = "";
    req.session.data['example-day'] = "";
    req.session.data['sender-code'] = "";
    req.session.data['national-code'] = "";
    req.session.data['slide-number'] = "";
    req.session.data['source-code'] = "";
    req.session.data['result-type'] = "";
    req.session.data['health-authority'] = "";
    req.session.data['result-infection'] = "";
    req.session.data['hpv-primary'] = "";
    req.session.data['crm'] = "";
    req.session.data['comments'] = "";

    res.redirect("/" + getVersion(req) + "/patient/add-test-result/add-test-result")
})

router.get("/*/start-logging-test*", function (req, res) {
  console.log("START LOGGING TEST");
  req.session.data["addresult_update_msg_show"] = 0;
  const params = new URLSearchParams(req.query);
  const nhsNumber = params.get('nhsNumber');
  //const version = params.get('pnlversion');
  //req.session.data["pnlversion"] = version;
  var pnlPatient = patient.getPatient(nhsNumber);
  req.session.data["pnl_patient"] = pnlPatient;
  req.session.data['action-text'] = "";
  req.session.data['result-action'] = "";
  req.session.data['result-infection'] = "";
  req.session.data['infection-text'] = "";
  req.session.data['result-text'] = "";
  req.session.data['result-result'] = "";
  req.session.data['example-year'] = "";
  req.session.data['example-month'] = "";
  req.session.data['example-day'] = "";
  req.session.data['sender-code'] = "";
  req.session.data['national-code'] = "";
  req.session.data['slide-number'] = "";
  req.session.data['source-code'] = "";
  req.session.data['result-type'] = "";
  req.session.data['health-authority'] = "";
  req.session.data['result-infection'] = "";
  req.session.data['hpv-primary'] = "";
  req.session.data['crm'] = "";
  req.session.data['comments'] = "";

  res.redirect("/" + getVersion(req) + "/patient/log-test-result/log-test-result")
})

router.post("/*/add-test-result", function (req, res) {
  console.log('ADDING-TEST-RESULT');
  req.session.data["addresult_update_msg_show"] = "2";
  //console.log("year " + req.session.data['example-year'])
  //console.log("month " + req.session.data['example-month'])
  //console.log("day " + req.session.data['example-day'])
  const params = new URLSearchParams(req.query);
  const nhsNumber = params.get('nhsNumber');
  //console.log(nhsNumber)
  var currentPatient = patient.getPatient(nhsNumber);
  patient.addTestResult(nhsNumber, req.session.data);
  patient.reinstatePatient(nhsNumber);
  
  
  // get the patient again with the new results
  currentPatient = patient.getPatient(nhsNumber);
  req.session.data['patientSummary'] = currentPatient;
  const patVersion = req.session.data["patversion"];
  
  res.redirect("/" + getVersion(req) + "/patient/patient-summary-" + patVersion);
})

router.post("/*/edit-test-result", function (req, res) {
  console.log('EDITING-TEST-RESULT');
  req.session.data["editresult_update_msg_show"] = "2";

  const params = new URLSearchParams(req.query);
  const nhsNumber = params.get('nhsNumber');
  //console.log(nhsNumber)
  var currentPatient = patient.getPatient(nhsNumber);
  patient.editTestResult(nhsNumber, req.session.data);
  // patient.reinstatePatient(nhsNumber);

  // get the patient again with the new results
  currentPatient = patient.getPatient(nhsNumber);
  req.session.data['patientSummary'] = currentPatient;
  const patVersion = req.session.data["patversion"];
  
  res.redirect("/" + getVersion(req) + "/patient/patient-summary-" + patVersion);
})

router.post("/*/delete-test-result", function (req, res) {
  console.log('DELETING-TEST-RESULT');
  req.session.data["deleteresult_update_msg_show"] = "2";

  const params = new URLSearchParams(req.query);
  const nhsNumber = params.get('nhsNumber');
  var currentPatient = patient.getPatient(nhsNumber);
  patient.deleteTestResult(nhsNumber, req.session.data);

  // get the patient again with the new results
  currentPatient = patient.getPatient(nhsNumber);
  req.session.data['patientSummary'] = currentPatient;
  const patVersion = req.session.data["patversion"];
  
  res.redirect("/" + getVersion(req) + "/patient/patient-summary-" + patVersion);
})

router.post("/*/check-test-result", function (req, res) {
  var result = (req.session.data["result-result"] + req.session.data["result-infection"] + req.session.data["result-action"]).toUpperCase();
  console.log("result : " + result)
  if(result=="X0R"){ 
    res.redirect("/v12/patient/add-test-result/add-test-result-repeat-in-months-x0r")
  }
  if(result=="09R" || result=="29R"){ 
    res.redirect("/v12/patient/add-test-result/add-test-result-repeat-in-months-09r")
  }
  if(result=="0R" || result=="0S" || result=="1R" || result=="1S" || result=="2R" || result=="2S" || result=="3R" || result=="3S" || result=="4S" || result=="5S" || result=="6S" || result=="7S" || result=="8R" || result=="8S" || result=="9R" || result=="9S"){ 
    res.redirect("/v12/patient/add-test-result/add-test-result-repeat-in-months-manual-input")
  }
  res.redirect("/v12/patient/add-test-result/add-test-result-ntdd")
});

router.post("/*/check-logged-test-result", function (req, res) {
  var result = (req.session.data["result-result"] + req.session.data["result-infection"] + req.session.data["result-action"]).toUpperCase();
  console.log("result : " + result)
  if(result=="X0R"){ 
    res.redirect("/v12/patient/log-test-result/log-test-result-repeat-in-months-x0r")
  }
  if(result=="09R" || result=="29R"){ 
    res.redirect("/v12/patient/log-test-result/log-test-result-repeat-in-months-09r")
  }
  if(result=="0R" || result=="0S" || result=="1R" || result=="1S" || result=="2R" || result=="2S" || result=="3R" || result=="3S" || result=="4S" || result=="5S" || result=="6S" || result=="7S" || result=="8R" || result=="8S" || result=="9R" || result=="9S"){ 
    res.redirect("/v12/patient/log-test-result/log-test-result-repeat-in-months-manual-input")
  }
  res.redirect("/v12/patient/log-test-result/log-test-result-ntdd")
});

router.post("/*/check-add-logged-test-result", function (req, res) {
  var result = (req.session.data["result-result"] + req.session.data["result-infection"] + req.session.data["result-action"]).toUpperCase();
  console.log("result : " + result)
  if(result=="X0R"){ 
    res.redirect("/v12/patient/add-log-test-result/add-log-test-result-repeat-in-months-x0r")
  }
  if(result=="09R" || result=="29R"){ 
    res.redirect("/v12/patient/add-log-test-result/add-log-test-result-repeat-in-months-09r")
  }
  if(result=="0R" || result=="0S" || result=="1R" || result=="1S" || result=="2R" || result=="2S" || result=="3R" || result=="3S" || result=="4S" || result=="5S" || result=="6S" || result=="7S" || result=="8R" || result=="8S" || result=="9R" || result=="9S"){ 
    res.redirect("/v12/patient/add-log-test-result/add-log-test-result-repeat-in-months-manual-input")
  }
  res.redirect("/v12/patient/add-logged-result/add-log-test-result-ntdd")
});


router.post("/*/cancel-result-letter", function (req, res) {
  //var cancelResult = req.session.data['cancel-result-letter'];
  var nhsNumber = req.session.data['nhsNumber'];
  patient.cancelResultLetter(nhsNumber, req.session.data);
  currentPatient = patient.getPatient(nhsNumber);
  req.session.data['patientSummary'] = currentPatient;
  req.session.data['audit_msg_show'] = "1"
  req.session.data['auditMsg'] = "Result letter has been cancelled"
  res.redirect("/" + getVersion(req) + "/patient/patient-summary-7")
});

router.post("/*/resend-result-letter", function (req, res) {
  //var cancelResult = req.session.data['resending-result-letter'];
  var nhsNumber = req.session.data['nhsNumber'];
  patient.resendResultLetter(nhsNumber, req.session.data);
  currentPatient = patient.getPatient(nhsNumber);
  req.session.data['patientSummary'] = currentPatient;
  req.session.data['audit_msg_show'] = "1"
  req.session.data['auditMsg'] = "Result letter has been resent"
  res.redirect("/" + getVersion(req) + "/patient/patient-summary-7")
});



module.exports = router;
