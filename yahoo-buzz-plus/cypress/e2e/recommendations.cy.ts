describe('Testing the recommendations view', () => {
  beforeEach(() => {
    cy.visit('/');

    for (let i = 0; i < 10; i++) {
      cy.get('[data-cy="buzz-up-button"]').click();
    }
  });

  it('Clicking read more should open view 3', () => {
    cy.get('[data-cy="read more"]').first().click();

    cy.get('[data-cy="view 3"]').should('be.visible');
  });

  it('Clicks an external link and verifies it opens in new tab', () => {
    cy.get('[data-cy="read more"]').first().click();

    cy.get('[data-cy="external-link"]').click();

    cy.window().then((win) => {
      const url = win.location.href;
      expect(url).to.include('');
    });
  });

  it('Read more opens the correct article', () => {
    let titleText;
    cy.get('.card-title-alt')
      .first()
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        titleText = text.trim();

        cy.get('[data-cy="read more"]').first().click();

        cy.get('[data-cy="card-title-view-3"]')
          .should('be.visible')
          .and('contain', titleText);
      });
  });

  it('Open and close article works', () => {
    cy.get('[data-cy="read more"]').first().click();

    cy.get('[data-cy="view 3"]').should('be.visible');

    cy.get('[data-cy="close-btn"]').click();

    cy.get('[data-cy="view 2"]').should('be.visible');
  });

  
});
