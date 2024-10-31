//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Run this code when a form is submitted to 'did-audit-find-issues'
router.post('/did-audit-find-issues-answer', function (req, res) {

    // Make a variable and give it the value from 'did-audit-find-issues'
    var didAuditFindIssues = req.session.data['did-audit-find-issues']
  
    // Check whether the variable matches a condition
    if (didAuditFindIssues == "yes"){
      // Send user to next page
      res.redirect('/WCAG-fails')
    } 
    else if (didAuditFindIssues == "no"){
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
    if (planningToFixIssue == "Yes"){
      // Send user to next page
      res.redirect('/fix-issue')
    } 
    else if (planningToFixIssue == "No"){
        res.redirect('/fix-issue')

    } else {
      // Send user to ineligible page
      res.redirect('/temp-error-page')
    }
  
  })