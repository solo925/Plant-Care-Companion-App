describe('BlogPostCard Component', () => {
    const post = {
        id: 1,
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        createdAt: '2024-12-01T00:00:00.000Z',
        likes: 10,
        author: {
            name: 'Test Author',
            profilePhoto: 'uploads/test-author.jpg',
        },
        imageUrl: 'uploads/test-image.jpg',
    };

    const commentsApiUrl = `http://localhost:3000/api/v1/comments/${post.id}`;
    const postUrl = `/post/${post.id}`;

    beforeEach(() => {
        cy.visit('/create-post');
    });

    it('renders the blog post card with all details', () => {
        cy.get('.blog-post-card').should('be.visible');
        cy.get('.author-avatar').should('have.attr', 'src').and('include', post.author.profilePhoto);
        cy.get('.author-info h4').should('contain', post.author.name);
        cy.get('.post-title').should('contain', post.title);
        cy.get('.post-content').should('contain', post.content);
        cy.get('.post-image').should('have.attr', 'src').and('include', post.imageUrl);
    });

    it('handles likes toggling', () => {
        cy.get('.like-section').click();
        cy.get('.like-section span').should('contain', post.likes + 1);

        cy.get('.like-section').click();
        cy.get('.like-section span').should('contain', post.likes);
    });

    it('fetches and displays comments', () => {
        cy.intercept('GET', commentsApiUrl, {
            statusCode: 200,
            body: {
                comments: [
                    { id: 1, content: 'Great post!' },
                    { id: 2, content: 'Very informative.' },
                ],
            },
        });

        cy.reload(); // Reload to trigger the comments fetch
        cy.get('.comment-section span').should('contain', '2 Comments');
    });

    it('allows adding a comment', () => {
        const newComment = 'This is a new comment!';

        cy.intercept('POST', commentsApiUrl, {
            statusCode: 200,
            body: {
                comment: { id: 3, content: newComment },
            },
        });

        cy.get('.comment-input').type(newComment).type('{enter}');
        cy.get('.comment-input').should('have.value', '');
        cy.get('.comment-section span').should('contain', '1 Comments');
    });
});
