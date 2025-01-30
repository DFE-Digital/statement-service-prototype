//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

// each page is in order of their appearance in the service

//const { isDate, isValid } = require('date-fns')
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const fs = require('fs');


function generateRandomId() {
  return Math.random().toString(36).substr(2, 9); //Generates a random string
}


function filterByPrinciple(selectedPrinciple) {
  const data = JSON.parse(fs.readFileSync('app/data/wcag.json', 'utf8'));
  return data.filter(item => item.principle === selectedPrinciple);
}


// Function to check if a date is valid
function isValidDateCheck(day, month, year) {
  // Month is 0-indexed in JavaScript Date (January = 0)
  // Need to deduct 1 off the month entered
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}


// Route for 'service-details.html'
router.post('/service-details-answer', function (req, res) {
  let serviceName = req.session.data['service-name'];
  let teamName = req.session.data['team-name'];
  let pmRoName = req.session.data['pm-ro-name'];
  let teamEmail = req.session.data['team-email'];

  let errors = [];

  if (serviceName === "") {
    let error = {
      id: 'service-name',
      message: 'Enter the name of the service'
    }

    errors.push(error)
  }

  if (teamName === "") {
    let error = {
      id: 'team-name',
      message: 'Enter the name of the team that manages the service'
    }

    errors.push(error)
  }

  if (pmRoName === "") {
    let error = {
      id: 'pm-ro-name',
      message: 'Enter the name of the product manager or the responsible officer'
    }

    errors.push(error)
  }

  if (teamEmail === "") {
    let error = {
      id: 'team-email',
      message: 'Enter the contact email of the team'
    }

    errors.push(error)
  }


  if (errors.length) {
    return res.render('service-details', { errors })
  }

  else {
    res.redirect('/audit-date')
  }

})


// Route for 'audit-date.html'
router.post('/audit-date-answer', function (req, res) {

  // var auditDay = req.session.data['audit-date-day'];
  // var auditMonth = req.session.data['audit-date-month'];
  // var auditYear = req.session.data['audit-date-year'];

  // AnJo - the dates are being passed around as strings, when they need to be numbers (Date() method expects numbers not strings.
  // Parse them as numbers.
  // Should do additional validation on the input to check its a number too.

  const auditDay = parseInt(req.session.data['audit-date-day'], 10);
  const auditMonth = parseInt(req.session.data['audit-date-month'], 10);
  const auditYear = parseInt(req.session.data['audit-date-year'], 10);

  let errors = [];

  // Check if all fields are empty
  if (!auditDay && !auditMonth && !auditYear) {
    errors.push({
      id: 'audit-date-all',
      message: 'Enter the date the audit was completed',
    });
  } else {
    // Check individual fields
    if (!auditDay) {
      errors.push({
        id: 'audit-date-day',
        message: 'The date the audit was completed must include a day',
      });
    }
    if (!auditMonth) {
      errors.push({
        id: 'audit-date-month',
        message: 'The date the audit was completed must include a month',
      });
    }
    if (!auditYear) {
      errors.push({
        id: 'audit-date-year',
        message: 'The date the audit was completed must include a year',
      });
    }

    // Validate if the date is valid
    if (auditDay && auditMonth && auditYear) {
      const isValidDate = isValidDateCheck(auditDay, auditMonth, auditYear);
      
      if (!isValidDate) {
        errors.push({
          id: 'audit-date-invalid',
          message: 'Enter a valid date',
        });
      }
    }
  }
  
  if (errors.length) {
    return res.render('audit-date', { errors })
  }
  
  else (
    res.redirect('/name-audit')
  )
  
})


// Route for 'name-audit.html'
router.post('/name-audit-answer', function (req, res) {

  var nameAudit = req.session.data['name-audit']

  let errors = [];

  if (nameAudit === "") {
    let error = {
      id: 'name-audit',
      message: 'Enter the name of the company that completed the audit'
    }

    errors.push(error);
  }


  if (errors.length) {
    return res.render('name-audit', { errors })
  }

  if (nameAudit !== undefined) {
    res.redirect('/did-audit-find-issues')
  }

})


// Route for 'did-audit-find-issues.html'
router.post('/did-audit-find-issues-answer', function (req, res) {

  // Make a variable and give it the value from 'did-audit-find-issues'
  var didAuditFindIssues = req.session.data['did-audit-find-issues']

  let errors = [];

  if (didAuditFindIssues === undefined) {
    let error = {
      id: 'did-audit-find-issues',
      message: 'Select Yes if the audit found accessibility issues'
    }

    errors.push(error);
  }


  if (errors.length) {
    return res.render('did-audit-find-issues', { errors })
  }

  // Check whether the variable matches a condition
  if (didAuditFindIssues == "Yes") {
    // Send user to next page
    res.redirect('/pour-selection')
  } else if (didAuditFindIssues == "No") {
    res.redirect('/contact-information')
  }

})


// Route for 'pour-selection.html'
router.post('/pour-selection-answer', function (req, res) {
  
  var genissues = req.session.data['pour-selection']
  
  let errors = [];

  if (genissues === undefined) {
    let error = {
      id: 'pour-selection-1',
      message: 'Select the principle of the issue that has not been met'
    }

    errors.push(error);
  }

  if (errors.length) {
    return res.render('pour-selection', { errors })
  }

  if (genissues !== undefined) {
    req.session.data['wcag-criteria'] = undefined
    res.redirect('/wcag-specific-issues')
  }

})


// Filters the 'wcag-specific-issues.html' page by the 'pour-selection.html' answer
router.get('/wcag-specific-issues', function (req, res) {
  let selectedPrinciple = req.session.data['pour-selection'];
  if (selectedPrinciple != "") {

    const filteredData = filterByPrinciple(selectedPrinciple);

    return res.render('wcag-specific-issues', { criterion: filteredData })
  } 
  else {
    return res.redirect('pour-selection')
  }

})


// Route for 'wcag-specific-issues.html'
router.post('/wcag-specific-issues-answer', function (req, res) {

  var specissues = req.session.data['wcag-criteria']
  var listOfIssues = req.session.data.issues
  let errors = [];

  if (specissues === undefined) {
    let error = {
      id: 'wcag-criteria-0',
      message: 'Select the criteria that has not been met'
    }

    errors.push(error);
  }
  if (!listOfIssues) {
  }
  else if (listOfIssues.length) {

    listOfIssues.forEach((issue) => {
      if (issue.criteria === specissues) {
        let error = {
          id: 'wcag-criteria-0',
          message: 'You cannot select the same criteria twice. Select a different criteria'
        }
        errors.push(error);
      }
    }
    )
  };
  if (errors.length) {
    let selectedPrinciple = req.session.data['pour-selection'];
    const filteredData = filterByPrinciple(selectedPrinciple);
    return res.render('wcag-specific-issues', { errors, criterion: filteredData })
  }



  if (specissues !== undefined) {
    res.redirect('/planning-to-fix-issue')
  }

})


// Route for 'planning-to-fix-issue.html'
router.post('/planning-to-fix-issue-answer', function (req, res) {

  var planningToFixIssue = req.session.data['planning-to-fix-issue']

  let errors = [];

  if (planningToFixIssue === undefined) {
    let error = {
      id: 'planning-to-fix-issue',
      message: 'Select Yes if you are planning to fix this issue'
    }

    errors.push(error);
  }

  if (errors.length) {
    return res.render('planning-to-fix-issue', { errors })
  }

  // Check whether the variable matches a condition
  if (planningToFixIssue == "Yes") {
    // Send user to next page
    res.redirect('/how-fix-issue')
  } else if (planningToFixIssue == "No") {
    res.redirect('/why-no-fix-issue')

  }

})


// Route for 'how-fix-issue.html'
router.post('/how-fix-issue-answer', function (req, res) {

  var howFixIssue = req.session.data['how-fix-issue']

  let errors = [];

  if (howFixIssue === "") {
    let error = {
      id: 'how-fix-issue',
      message: 'Enter what you are doing to fix the issue'
    }

    errors.push(error);
  }


  if (errors.length) {
    return res.render('/how-fix-issue', { errors })
  }

  //if(howFixIssue !== undefined){
  //  res.redirect('/did-audit-find-issues')
  //}

  // Check if the session data exists
  if (!req.session.data) {
    req.session.data = {};
  }

  // Initialize approved products array if it doesn't exist
  if (!req.session.data.issues) {
    req.session.data.issues = [];
  }
  try {
    // Get the submitted data from the request session
    const issue = {
      id: generateRandomId(),
      principle: req.session.data['pour-selection'],
      criteria: req.session.data['wcag-criteria'],
      fixIssueYN: req.session.data['planning-to-fix-issue'],
      howFixIssue: req.session.data['how-fix-issue']
    };


    // Push the new approved product to the session array
    req.session.data.issues.push(issue);



    //clearing session data
    req.session.data['pour-selection'] = ""
    req.session.data['wcag-criteria'] = ""
    req.session.data['planning-to-fix-issue'] = ""
    req.session.data['how-fix-issue'] = ""

    // console.log(req.session.data.issues); // For debugging
  } catch (error) {
  }
  // Redirect to the next page or back to the products page
  return res.redirect('/table-of-users-wcag-issues');
})


// Route for 'why-no-fix-issue.html'
router.post('/why-no-fix-issue-answer', function (req, res) {
  // Check if the session data exists
  if (!req.session.data) {
    req.session.data = {};
  }

  // Initialize approved products array if it doesn't exist
  if (!req.session.data.issues) {
    req.session.data.issues = [];
  }

  var whyNoFixIssue = req.session.data['why-no-fix-issue']

  let errors = [];

  if (whyNoFixIssue === "") {
    let error = {
      id: 'why-no-fix-issue',
      message: 'Enter why you are not fixing the issue'
    }

    errors.push(error);
  }


  if (errors.length) {
    return res.render('why-no-fix-issue', { errors })
  }

  try {
    // Get the submitted data from the request session
    const issue = {
      id: generateRandomId(),
      principle: req.session.data['pour-selection'],
      criteria: req.session.data['wcag-criteria'],
      fixIssueYN: req.session.data['planning-to-fix-issue'],
      whyNotFixIssue: req.session.data['why-no-fix-issue']
    };

    // Push the new approved product to the session array
    req.session.data.issues.push(issue);



    //clearing session data
    req.session.data['pour-selection'] = ""
    req.session.data['wcag-criteria'] = ""
    req.session.data['planning-to-fix-issue'] = ""
    req.session.data['why-no-fix-issue'] = ""

  } catch (error) {
  }
  // Redirect to the next page or back to the products page
  return res.redirect('/table-of-users-wcag-issues');
})


// Route for 'table-of-users-wcag-issues.html'
router.get('/table-of-users-wcag-issues', function (req, res) {
  let listOfIssues = []
  if (req.session.data.issues) {
    listOfIssues = req.session.data.issues;
  }
  return res.render('/table-of-users-wcag-issues', { listOfIssues })
})


// Route for 'contact-information.html'
router.post('/contact-information-answer', function (req, res) {
  let reportIssues = req.session.data['email-to-report-issues'];
  let differentFormat = req.session.data['email-for-different-format'];
  let daysReply = req.session.data['days-for-reply'];

  let errors = [];

  if (reportIssues === "") {
    let error = {
      id: 'email-to-report-issues',
      message: 'Enter the email for users to use to report issues'
    }

    errors.push(error)
  }

  if (differentFormat === "") {
    let error = {
      id: 'email-for-different-format',
      message: 'Enter the email for users to use to recieve data in a different format'
    }

    errors.push(error)
  }

  if (daysReply === "") {
    let error = {
      id: 'days-for-reply',
      message: 'Enter the number of days for users to wait to get a reply'
    }

    errors.push(error)
  }


  if (errors.length) {
    return res.render('contact-information', { errors })
  }

  else {
    res.redirect('/check-and-confirm')
  }

})

