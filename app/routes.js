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

  // Check whether the variable matches a condition
  if (didAuditFindIssues == "yes") {
    // Send user to next page
    res.redirect('/wcag-general-issues')
  } else if (didAuditFindIssues == "no") {
    res.redirect('/contact-information')
  } else {
    // Send user to ineligible page
    res.redirect('/temp-error-page')
  }

})

// Run this code when a form is submitted to '/planning-to-fix-issues'
router.post('/planning-to-fix-issue-answer', function (req, res) {

  // Make a variable and give it the value from 'how-many-balls'
  var planningToFixIssue = req.session.data['planning-to-fix-issue']

  // Check whether the variable matches a condition
  if (planningToFixIssue == "Yes") {
    // Send user to next page
    res.redirect('/how-fix-issue')
  } else if (planningToFixIssue == "No") {
    res.redirect('/disproportionate-burden')

  } else {
    // Send user to ineligible page
    res.redirect('/temp-error-page')
  }

})



router.post('/how-fix-issue-answer', function (req, res) {
  // Check if the session data exists
  if (!req.session.data) {
    req.session.data = {};
  }

  // Initialize approved products array if it doesn't exist
  if (!req.session.data.approvedProducts) {
    req.session.data.approvedProducts = [];
  }

  // Get the submitted data from the request session
  const approvedProduct = {
    id: generateRandomId(),
    principle: req.session.data['pour-selection'],
    criteria: req.session.data['wcag-criteria'],
    fixIssueYN: req.session.data['planning-to-fix-issue'],
    howFixIssue: req.session.data['how-fix-issue'],
    whyNotFixIssue: req.session.data['no-fix-issue'],
  };

  // Push the new approved product to the session array
  req.session.data.approvedProducts.push(approvedProduct);

  //clearing session data
  req.session.data['pour-selection'] = ""
  req.session.data['wcag-criteria'] = ""
  req.session.data['planning-to-fix-issue'] = ""
  req.session.data['how-fix-issue'] = ""
  req.session.data['no-fix-issue'] = ""

  console.log(req.session.data.approvedProducts); // For debugging

  // Redirect to the next page or back to the products page
  return res.redirect('/create/standard/products');
})


router.get('/summarylist-of-users-wcag-issues', function (req, res) {
let listOfIssues = []
if (req.session.data.approvedProducts) {
  listOfIssues = req.session.data.approvedProducts;
}
return res.render('/summarylist-of-users-wcag-issues', {listOfIssues})
})