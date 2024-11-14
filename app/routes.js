//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

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
    return res.redirect('wcag-general-issues')
  }

})

//
router.post('/wcag-general-issues-answer', function (req, res) {

    res.redirect('/wcag-specific-issues')


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
    res.redirect('/wcag-general-issues')
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

  // Make a variable and give it the value from 'how-many-balls'


  // Check whether the variable matches a condition
  if (planningToFixIssue == "Yes") {
    // Send user to next page
    res.redirect('/how-fix-issue')
  } else if (planningToFixIssue == "No") {
    res.redirect('/why-no-fix-issue')

    }

})



router.post('/how-fix-issue-answer', function (req, res) {
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
try{
  // Get the submitted data from the request session
  const issue = {
    id: generateRandomId(),
    principle: req.session.data['pour-selection'],
    criteria: req.session.data['wcag-criteria'],
    fixIssueYN: req.session.data['planning-to-fix-issue'],
    whyNotFixIssue: req.session.data['no-fix-issue']
  };

  // Push the new approved product to the session array
  req.session.data.issues.push(issue);

  console.log(issue)


  //clearing session data
  req.session.data['pour-selection'] = ""
  req.session.data['wcag-criteria'] = ""
  req.session.data['planning-to-fix-issue'] = ""
  req.session.data['no-fix-issue'] = ""

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

