describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    
    const user1 = {
      name: 'Selina Zheng',
      username: 'SelinaZzz',
      password: '12345678'
    }
    const user2 = {
      name: 'Sam Y',
      username: 'SamYyy',
      password: '12345678'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1) 
    cy.request('POST', 'http://localhost:3003/api/users/', user2) 
    cy.visit('http://localhost:3000')
  })

    it('log in form is shown', function() {
      cy.get('form').contains('form', 'username', 'password')
    })


    describe('Login', function() {
      it('succeeds with correct credentials', function() {
        cy.get('#username').type('SelinaZzz')
        cy.get('#password').type('12345678')
        cy.get('#login-button').click()

        cy.contains('Selina Zheng is logged in')
      })
  
      it('fails with wrong credentials', function() {
        cy.get('#username').type('SelinaZzz')
        cy.get('#password').type('wrong')
        cy.get('#login-button').click()

        cy.get('.notification')
          .contains('wrong username or password')
          .should('have.css', 'color', 'rgb(255, 0, 0)')
      })
    })


    describe('When logged in', function() {
      beforeEach(function() {
        // cy.get('#username').type('SelinaZzz')
        // cy.get('#password').type('12345678')
        // cy.get('#login-button').click()

        cy.login({ username: 'SelinaZzz', password: '12345678' })
      })
  
      it('A new blog can be created', function() {
        cy.contains('create new blog').click()
        cy.get('#title').type('a blog created by cypress')
        cy.get('#author').type('admin')
        cy.get('#url').type('http://no-fun.com')
        cy.get('#create-button').click()

        cy.get('.blogDefault').contains('a blog created by cypress').contains('admin')
      })
    })


    describe('When there are many blogs', function() {
      beforeEach(function() {
        cy.login({ username: 'SelinaZzz', password: '12345678' })
        cy.createBlog({ title:'a blog created by cypress', author:'admin', url: 'http://no-fun.com' })
        cy.createBlog({ title:'another cypress blog', author:'admin', url: 'http://no-fun.com' })
      })

      it('A user can like a blog', function() {
        cy.contains('another cypress blog').contains('view').click()
        cy.contains('likes').contains('like').click({force: true})
        cy.contains('likes').contains('1')
      })

      it('A user can delete a blog they created', function() {
        cy.contains('another cypress blog').contains('view').click()
        cy.contains('another cypress blog').parent().find('#remove-button').click()
        
        cy.get('.blogDefault')
            .should('contain', 'a blog created by cypress')
            .and('not.contain', 'another cypress blog')
        cy.get('.blogDetails')
            .should('not.contain', 'another cypress blog')
      })

      it('A user cannot delete a blog they did not create', function() {
        cy.get('#logout-button').click()
        cy.login({ username: 'SamYyy', password: '12345678' })
        cy.contains('another cypress blog').contains('view').click()
        cy.contains('another cypress blog').parent().should('not.contain','#remove-button')
      })
    })

    describe.only('When blogs have different likes', function() {
      it('Blogs are ordered according to likes, with the blog with the most likes being first', function() {
        cy.login({ username: 'SelinaZzz', password: '12345678' })
        cy.createBlog({ title:'first blog', author:'admin', url: 'http://no-fun.com', likes: 200 })
        cy.createBlog({ title:'second blog', author:'admin', url: 'http://no-fun.com', likes: 83 })
        cy.createBlog({ title:'third blog', author:'admin', url: 'http://no-fun.com', likes: 593 })
        cy.createBlog({ title:'fourth blog', author:'admin', url: 'http://no-fun.com', likes: 402 })

        cy.get('.blogDefault')
            .should('have.length', '4')
            .then(($blogs) => {
              return ($blogs.first())
              // const likes = $blogs.map(function(b) { return b.likes })
              // return likes
            })
            .should('contain', 'third blog')
            // .should((likes)=> {
            //   expect(likes.get()).to.eq([593, 402, 200, 83])
            // })

        // cy.get('.blogDefault')
        // .should('have.length', '4')
        // .then(($blogs) => {
        //   const likes = $blogs.map(function(b) { return b.likes })
        //   return likes
        // })
        // .should((likes)=> {
        //   expect(likes.get()).to.eq([593, 402, 200, 83])
        // })
      })
    })
  })