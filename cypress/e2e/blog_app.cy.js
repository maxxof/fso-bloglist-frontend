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
        cy.createBlog({ title: 'first blog', author: 'first author', url: 'first url', likes: 0 })
        cy.createBlog({ title: 'second blog', author: 'second author', url: 'second url', likes: 15 })
        cy.createBlog({ title: 'third blog', author: 'third author', url: 'third url', likes: 1 })
      })

      it('User can like a blog', function() {
        cy.contains('first blog first author')
          .contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1') 
      })

      it('User that created a blog can delete it', function () {
        cy.contains('second blog second author')
          .contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'second blog second author')
      })

      it('Blogs are ordered according to likes with the blog with the most likes being first', function () {
        cy.get('.blog').eq(0).should('contain', 'second blog')
        cy.get('.blog').eq(2).should('contain', 'first blog')

        cy.contains('first blog')
          .contains('view').click()
        cy.contains('like').click()
        cy.contains('like').click()
        cy.get('.blog').eq(2).should('contain', 'third blog')
      })
    })
  })
})