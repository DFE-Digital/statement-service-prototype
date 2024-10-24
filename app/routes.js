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
    router.post('/planning-to-fix-issues-answer', function (req, res) {

    // Make a variable and give it the value from 'how-many-balls'
    var planningToFixIssues = req.session.data['planning-to-fix-issues']
  
    // Check whether the variable matches a condition
    if (planningToFixIssues == "All"){
      // Send user to next page
      res.redirect('/fix-issues')
    } 
    else if (planningToFixIssues == "Some"){
        res.redirect('/fix-issues')
    } 
    else if (planningToFixIssues == "None"){
        res.redirect('/disproportionate-burden')

    } else {
      // Send user to ineligible page
      res.redirect('/temp-error-page')
    }
  
  })