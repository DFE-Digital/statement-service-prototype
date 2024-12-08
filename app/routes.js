//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const {isDate, isValid} = require('date-fns')
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

router.get('/wcag-specific-issues', function (req, res) { 
  let selectedPrinciple = req.session.data['pour-selection'];
  if (selectedPrinciple != "") {

    //console.log(data)
    const filteredData = filterByPrinciple(selectedPrinciple);



    console.log(filteredData)
    return res.render('wcag-specific-issues', {criterion:filteredData})
  } else {
    return res.redirect('pour-selection')
  }

})

//
router.post('/pour-selection-answer', function (req, res) {

  var genissues = req.session.data['pour-selection']

    let errors = [];

  if (genissues === undefined)
  {
    let error = {
      id: 'pour-selection-1',
      message: 'Select a criteria that has not been met'
    }

    errors.push(error);
  }

    if(errors.length)
    {
      return res.render('pour-selection', {errors})
    }

    if(genissues !== undefined){
      req.session.data['wcag-criteria'] = undefined
      res.redirect('/wcag-specific-issues')
    }

})

router.post('/wcag-specific-issues-answer', function (req, res) {

  var specissues = req.session.data['wcag-criteria']
  var listOfIssues = req.session.data.issues
  console.log(specissues)
    let errors = [];

  if (specissues === undefined)
  {
    let error = {
      id: 'wcag-criteria-0',
      message: 'Select a criteria that has not been met'
    }

    errors.push(error);
  }
  if (!listOfIssues){
  }
  else if(listOfIssues.length)
    {

      listOfIssues.forEach((issue) => {
        if (issue.criteria === specissues){
          let error = {
            id: 'wcag-criteria-0',
            message: 'You can not select the same criteria twice'
          }
          errors.push(error);
        }
      }
      )};
    if(errors.length)
    {
      let selectedPrinciple = req.session.data['pour-selection'];
        const filteredData = filterByPrinciple(selectedPrinciple);
      return res.render('wcag-specific-issues', {errors,criterion:filteredData})
    }



    if(specissues !== undefined){
      res.redirect('/planning-to-fix-issue')
    }

})



router.post('/service-details-answer', function (req, res) {
  let serviceName = req.session.data['service-name'];
  let teamName = req.session.data['team-name'];
  let pmRoName = req.session.data['pm-ro-name'];
  let teamEmail = req.session.data['team-email'];

  let errors = [];

  if (serviceName === "")
  {
    let error = {
      id: 'service-name',
      message: 'Enter the service\'s name'
    }

    errors.push(error)
  }

  if (teamName === "")
    {
      let error = {
        id: 'team-name',
        message: 'Enter the team that manages the service\'s name'
      }
  
      errors.push(error)
    }

  if (pmRoName === "")
    {
      let error = {
        id: 'pm-ro-name',
        message: 'Enter the name of the product manager or the responsible officer'
      }
    
      errors.push(error)
    }

  if (teamEmail === "")
    {
      let error = {
        id: 'team-email',
        message: 'Enter the team\'s contact email'
      }
      
      errors.push(error)
    }


  if (errors.length)
  {
    return res.render('service-details', {errors})
  }

  else
  {
    res.redirect('/audit-date')
  }
  
})



router.post('/contact-information-answer', function (req, res) {
  let reportIssues = req.session.data['email-to-report-issues'];
  let differentFormat = req.session.data['email-for-different-format'];
  let daysReply = req.session.data['days-for-reply'];

  let errors = [];

  if (reportIssues === "")
  {
    let error = {
      id: 'email-to-report-issues',
      message: 'Enter the email for users to report issues'
    }

    errors.push(error)
  }

  if (differentFormat === "")
    {
      let error = {
        id: 'email-for-different-format',
        message: 'Enter the email for users to recieve data in a different format'
      }
  
      errors.push(error)
    }

  if (daysReply === "")
    {
      let error = {
        id: 'days-for-reply',
        message: 'Enter the number of days for users to get a reply'
      }
    
      errors.push(error)
    }


  if (errors.length)
  {
    return res.render('contact-information', {errors})
  }

  else
  {
    res.redirect('/check-and-confirm')
  }
  
})




router.post('/audit-date-answer', function (req, res) {

  var auditDay = req.session.data['audit-date-day'];
  var auditMonth = req.session.data['audit-date-month'];
  var auditYear = req.session.data['audit-date-year'];

  let errors = [];

  if(auditDay === "" && auditMonth === "" && auditYear === ""){
    let error = {
      id: 'audit-date-all',
      message: 'Enter the date the audit was completed'
    }
    errors.push(error);
  } 
  else if(auditDay === ""){
    if(auditMonth === ""){
      let error = {
        id:'audit-date-day-month',
        message: 'The date the audit was complete must include a day and a month'
      }
      errors.push(error);
    }
    else if(auditYear === ""){
      let error = {
        id: 'audit-date-day-year',
        message: 'The date the audit was completed must include a day and a year'
      }
      errors.push(error);
    }
    else{
      let error = {
        id: 'audit-date-day',
        message: 'The date the audit was completed must include a day' 
      }
    errors.push(error);
  }}


  else if(auditMonth === ""){
    if(auditYear === ""){
      let error = {
        id: 'audit-date-month-year',
        message: 'The date the audit was completed must include a month and a year'
      }
      errors.push(error);
    }
    else{
      let error = {
        id: 'audit-date-month',
        message: 'The date the audit was completed must include a month'
      }
    errors.push(error); 
  }}
  else if(auditYear === ""){
    let error = {
      id: 'audit-date-year',
      message: 'The date the audit was completed must include a year'
    }
    errors.push(error);
  }
  console.log(auditDay)
  console.log(auditMonth)
  console.log(auditYear)
  //let isValidDate = isDate(auditYear+"-"+auditMonth+"-"+auditDay)
  const isValidDate = isDate(new Date(auditYear,auditMonth,auditDay))
  console.log(isValidDate)
  
  if(errors.length)
    {
      return res.render('audit-date', {errors})
    }
  
  else(
    res.redirect('/name-audit')
  )

})





router.post('/name-audit-answer', function (req, res) {

  var nameAudit = req.session.data['name-audit']

  console.log(nameAudit)
  let errors = [];

  if(nameAudit === "")
  {
    let error = {
      id: 'name-audit',
      message: 'Enter the person who created the audit'
    }

    errors.push(error);
  }
  console.log(errors)


  if(errors.length)
  {
    return res.render('name-audit', {errors})
  }

  if(nameAudit !== undefined){
    res.redirect('/did-audit-find-issues')
  }
    
})





// Run this code when a form is submitted to 'did-audit-find-issues'
router.post('/did-audit-find-issues-answer', function (req, res) {

  // Make a variable and give it the value from 'did-audit-find-issues'
  var didAuditFindIssues = req.session.data['did-audit-find-issues']

  let errors = [];

  if( didAuditFindIssues === undefined)
  {
    let error = {
      id: 'did-audit-find-issues',
      message: 'Select an option'
    }

    errors.push(error);
  }


  if(errors.length)
  {
    return res.render('did-audit-find-issues', {errors})
  }

  // Check whether the variable matches a condition
  if (didAuditFindIssues == "Yes") {
    // Send user to next page
    res.redirect('/pour-selection')
  } else if (didAuditFindIssues == "No") {
    res.redirect('/contact-information')
  }

})



// Run this code when a form is submitted to '/planning-to-fix-issues'
router.post('/planning-to-fix-issue-answer', function (req, res) {

  var planningToFixIssue = req.session.data['planning-to-fix-issue']

  let errors = [];

  if(planningToFixIssue === undefined)
  {
    let error = {
      id: 'planning-to-fix-issue',
      message: 'Select an option'
    }

    errors.push(error);
  }

  if(errors.length)
  {
    return res.render('planning-to-fix-issue', {errors})
  }

  // Check whether the variable matches a condition
  if (planningToFixIssue == "Yes") {
    // Send user to next page
    res.redirect('/how-fix-issue')
  } else if (planningToFixIssue == "No") {
    res.redirect('/why-no-fix-issue')

    }

})




router.post('/how-fix-issue-answer', function (req, res) {

  var howFixIssue = req.session.data['how-fix-issue']

  console.log(howFixIssue)
  let errors = [];

  if(howFixIssue === "")
  {
    let error = {
      id: 'how-fix-issue',
      message: 'Enter what you are doing to fix the issue'
    }

    errors.push(error);
  }
  console.log(errors)


  if(errors.length)
  {
    return res.render('/how-fix-issue', {errors})
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
try{
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

  console.log(issue)


  //clearing session data
  req.session.data['pour-selection'] = ""
  req.session.data['wcag-criteria'] = ""
  req.session.data['planning-to-fix-issue'] = ""
  req.session.data['how-fix-issue'] = ""

  console.log(req.session.data.issues); // For debugging
}catch(error){
  console.log(error)
}
  // Redirect to the next page or back to the products page
  return res.redirect('/table-of-users-wcag-issues');
})




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

  if(whyNoFixIssue === "")
  {
    let error = {
      id: 'why-no-fix-issue',
      message: 'Enter why you are not fixing the issue'
    }

    errors.push(error);
  }


  if(errors.length)
  {
    return res.render('why-no-fix-issue', {errors})
  }
  
try{
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

  console.log(issue)


  //clearing session data
  req.session.data['pour-selection'] = ""
  req.session.data['wcag-criteria'] = ""
  req.session.data['planning-to-fix-issue'] = ""
  req.session.data['why-no-fix-issue'] = ""

  console.log(req.session.data.issues); // For debugging
}catch(error){
  console.log(error)
}
  // Redirect to the next page or back to the products page
  return res.redirect('/table-of-users-wcag-issues');
})


router.get('/table-of-users-wcag-issues', function (req, res) {
let listOfIssues = []
if (req.session.data.issues) {
  listOfIssues = req.session.data.issues;
}
return res.render('/table-of-users-wcag-issues', {listOfIssues})
})

