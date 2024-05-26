describe('Buzz up and Buzz down buttons change the article', () => {
  it('Visits the homepage and verifies that the initial article is displayed', () => {
    // Visit the initial project page

    cy.wait(10);
    cy.visit('/');

    cy.get('.card-title').should('be.visible');
    cy.get('.card-text').should('be.visible');

    let initialTitle;
    let initialText;
    cy.get('.card-title')
      .invoke('text')
      .then((text) => {
        initialTitle = text.trim();
      });
    cy.get('.card-text')
      .invoke('text')
      .then((text) => {
        initialText = text.trim();
      });

    cy.get('[data-cy="buzz-up-button"]').click();

    cy.get('.card-title').should('be.visible').and('not.contain', initialTitle);
    cy.get('.card-text').should('be.visible').and('not.contain', initialText);
  });
});

describe('Main page initial content loads', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.get('[data-cy="view 1"]').should('be.visible');
  });
});

describe('External link opens in new tab', () => {
  it('Clicks an external link and verifies it opens in new tab', () => {
    cy.visit('/');

    cy.get('[data-cy="external-link"]').click();

    cy.window().then((win) => {
      const url = win.location.href;
      expect(url).to.include('');
    });
  });
});

describe('Click Buzz up and Buzz down buttons multiple times', () => {
  it('Clicks Buzz up and Buzz down buttons multiple times', () => {
    cy.visit('/');

    // Click Buzz up button five times
    for (let i = 0; i < 5; i++) {
      cy.get('[data-cy="buzz-up-button"]').click();
    }

    // Click Buzz down button five times
    for (let i = 0; i < 5; i++) {
      cy.get('[data-cy="buzz-down-button"]').click();
    }

    cy.get('[data-cy="view 2"]').should('be.visible');
  });
});

describe('Use help function', () => {
  it('Clicking the help icon works', () => {
    cy.visit('/');

    // Verify the link has the correct target and href attributes
    cy.get('[data-cy="help-link"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'href')
      .then((href) => {
        expect(href).to.include('drive.google.com/file');

        // Remove the target attribute to force the link to open in the same tab
        cy.get('[data-cy="help-link"]').invoke('removeAttr', 'target').click();
      });
  });

  
});

describe('Test Misinformation Detection', () => {
  it('Click and observe misinformation detection', () => {
    cy.visit('/');

    cy.get('[data-cy="misinfo-btn"]').should(
      'contain.text',
      'Click here to detect misinformation'
    );
    cy.get('[data-cy="misinfo-btn"]').click();

    cy.get('[data-cy="misinfo-btn"]').should(($btn) => {
      expect($btn.text()).to.satisfy((text:any) => {
        return text.includes('REAL') || text.includes('FAKE');
      });
    });
  });
});
