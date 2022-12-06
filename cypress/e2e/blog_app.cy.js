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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'maxxof', password: 'opsec' })
      cy.get('#username').type('maxxof')
      cy.get('#password').type('opsec')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('new title')
      cy.get('#author').type('new author')
      cy.get('#url').type('new url')
      cy.get('#create-button').click()

      cy.contains('new title new author')
    })

    describe('and some blogs blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'first author', url: 'first url' })
        cy.createBlog({ title: 'second blog', author: 'second author', url: 'second url' })
      })

      it('User can like a blog', function() {
        cy.contains('first blog first author')
          .get('#view-button')
          .click()
          .get('#like-button')
          .click()
        cy.contains('likes 1') 
      })
    })
  })
})