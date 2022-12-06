describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'max',
      username: 'maxxof',
      password: 'opsec'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('maxxof')
      cy.get('#password').type('opsec')
      cy.get('#login-button').click()
      cy.contains('max logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('maxxof')
      cy.get('#password').type('wrong:/')
      cy.get('#login-button').click()

      cy.get('.red')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      
      cy.get('html').should('not.contain', 'max logged in')
    })
  })
})