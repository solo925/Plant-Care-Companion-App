describe('Registration Page', () => {
    const apiUrl = 'http://localhost:3000/api/v1/auth/register';

    beforeEach(() => {
        cy.visit('/register');
    });

    it('renders the registration form with all fields and a button', () => {
        cy.get('input[placeholder="Name"]').should('be.visible');
        cy.get('input[placeholder="Email"]').should('be.visible');
        cy.get('input[placeholder="Password"]').should('be.visible');
        cy.get('input[placeholder="Confirm Password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible').and('contain', 'Register');
    });

    it('allows typing into the fields', () => {
        cy.get('input[placeholder="Name"]').type('Test User').should('have.value', 'Test User');
        cy.get('input[placeholder="Email"]').type('test@example.com').should('have.value', 'test@example.com');
        cy.get('input[placeholder="Password"]').type('password123').should('have.value', 'password123');
        cy.get('input[placeholder="Confirm Password"]').type('password123').should('have.value', 'password123');
    });

    it('displays an error message for failed registration attempts', () => {
        cy.intercept('POST', apiUrl, {
            statusCode: 400,
            body: { message: 'Email already exists' },
        });

        cy.get('input[placeholder="Name"]').type('Test User');
        cy.get('input[placeholder="Email"]').type('existing@example.com');
        cy.get('input[placeholder="Password"]').type('password123');
        cy.get('input[placeholder="Confirm Password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Ensure the error message is displayed
        cy.get('.error-message').should('be.visible').and('contain', 'Email already exists');
    });

    it('redirects to the login page on successful registration', () => {
        cy.intercept('POST', apiUrl, {
            statusCode: 200,
            body: {
                user: { id: 1, name: 'Test User', email: 'test@example.com' },
                token: 'mockToken',
            },
        });

        cy.get('input[placeholder="Name"]').type('Test User');
        cy.get('input[placeholder="Email"]').type('test@example.com');
        cy.get('input[placeholder="Password"]').type('password123');
        cy.get('input[placeholder="Confirm Password"]').type('password123');
        cy.get('button[type="submit"]').click();


        cy.url().should('include', '/login');
    });
});
