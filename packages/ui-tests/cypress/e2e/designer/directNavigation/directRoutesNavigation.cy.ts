describe('Route Direct Navigation', () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  //   it('Route Direct Navigation - highlight route node when navigating', () => {
  //     cy.uploadFixture('flows/camelRoute/direct-route.yaml');
  //     cy.openDesignPage();

  //     cy.get('foreignObject[data-nodelabel="test"]').eq(0).find('[data-testid="goto-route-btn"]').click();
  //     cy.get('foreignObject[data-nodelabel="test"]').eq(2).parent().should('have.attr', 'data-selected', 'true');

  //     cy.get('foreignObject[data-nodelabel="other"]').eq(2).find('[data-testid="goto-route-btn"]').click();
  //     cy.get('[data-testid="goto-route-option-route-addPet"]').click();
  //     cy.get('foreignObject[data-nodelabel="other"]').eq(2).parent().should('have.attr', 'data-selected', 'true');
  //   });

  it('Route Direct Navigation - display hidden route', () => {
    cy.uploadFixture('flows/camelRoute/direct-route.yaml');
    cy.openDesignPage();

    cy.toggleFlowsList();
    cy.get('button[data-testid="toggle-btn-route-1234"]').click();
    cy.get('button[data-testid="toggle-btn-route-4321"]').click();
    cy.closeFlowsListIfVisible();

    cy.get('foreignObject[data-nodelabel="other"]').eq(0).find('[data-testid="goto-route-btn"]').click();
    cy.get('foreignObject[data-nodelabel="other"]')
      .eq(1)
      .should('be.visible')
      .parent()
      .should('have.attr', 'data-selected', 'true');
  });
});
