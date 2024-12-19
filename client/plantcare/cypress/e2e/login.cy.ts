describe('Login Page', () => {
    const apiUrl = 'http://localhost:3000/api/v1/auth/login';
    const homeUrl = 'http://localhost:5173/home';

    beforeEach(() => {
        cy.visit('/login'); // Assuming the login page is at `/login`
    });

    it('renders the login form with all fields and a button', () => {
        cy.get('.loginform').should('exist');
        cy.get('input[type="email"]').should('exist');
        cy.get('input[type="password"]').should('exist');
        cy.get('button[type="submit"]').should('exist').and('contain', 'Login');
    });

    it('allows typing into the email and password fields', () => {
        cy.get('input[type="email"]')
            .type('test@example.com')
            .should('have.value', 'test@example.com');

        cy.get('input[type="password"]')
            .type('password123')
            .should('have.value', 'password123');
    });

    it('displays an error message for failed login attempts', () => {
        cy.intercept('POST', apiUrl, {
            statusCode: 401,
            body: { message: 'Invalid email or password' },
        });

        cy.get('input[type="email"]').type('wrong@example.com');
        cy.get('input[type="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        // Ensure the error message is displayed
        cy.get('.error-message').should('be.visible').and('contain', 'Invalid email or password');
    });


    it('redirects to the home page on successful login', () => {
        cy.intercept('POST', apiUrl, {
            statusCode: 200,
            body: {
                user: { id: 1, name: 'Test User', email: 'test@example.com' },
                token: 'mock-jwt-token'
            },
        });

        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Ensure token is stored and redirection happens
        cy.window().its('sessionStorage.token').should('equal', 'mock-jwt-token');
        cy.url().should('equal', homeUrl);
    });
});
