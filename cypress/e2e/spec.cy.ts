describe('My First Test', () => {

    it('should navigate to the about page', () => {
    cy.visit('/about')
    cy.contains('Benvenuto nella pagina About.')
    })

    it('should login a user', () => {
    cy.visit('/login')
    // cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password')
    cy.get('button#myButton[type="submit"][data-cy="login-button"]').click({force: true})
  })
})
