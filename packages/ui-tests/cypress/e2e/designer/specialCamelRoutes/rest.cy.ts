describe('Test for root rest container', () => {
  beforeEach(() => {
    cy.openHomePage();
  });

  it('Root rest configuration', () => {
    cy.openRestEditor();

    cy.get('[data-testid="rest-tree-toolbar-menu"]').find('button').click();
    cy.get('[data-testid="add-rest-service-btn"]').click();

    cy.interactWithConfigInputObject('description', 'description Label');
    cy.interactWithConfigInputObject('path', 'testPath');
    cy.selectMediaTypes('consumes', ['application/json', 'application/xml']);
    cy.selectMediaTypes('produces', ['application/json', 'application/xml']);
    cy.selectInTypeaheadField('bindingMode', 'json');

    // Insert special node intercept to Route Configuration
    cy.get('[data-testid="rest-tree-toolbar-menu"]').find('button').click();
    cy.get('[data-testid="add-rest-operation-btn"]').click();

    cy.get('[data-testid="#.method-typeahead-select-input"]').find('input').clear().type('get');
    cy.get('[data-testid="add-method-modal"]').within(() => {
      cy.interactWithConfigInputObject('path', 'testPath');
      cy.interactWithConfigInputObject('id', 'testId');
    });
    cy.get('[data-testid="add-method-modal-add-btn"]').click();

    cy.openSourceCode();

    cy.checkCodeSpanLine('- rest:');
    cy.checkCodeSpanLine('description: description Label');
    cy.checkCodeSpanLine('path: testPath');
    cy.checkCodeSpanLine('consumes: application/json, application/xml');
    cy.checkCodeSpanLine('produces: application/json, application/xml');
    cy.checkCodeSpanLine('bindingMode: json');
    cy.checkCodeSpanLine('get:');
  });

  it('Move rest methods', () => {
    cy.uploadFixture('flows/camelRoute/restDsl.yaml');
    cy.openDesignPage();

    cy.selectMoveAfterNode('get', 0);
    cy.selectMoveBeforeNode('get', 1);

    cy.openSourceCode();
    const rest = [
      '- id: get-1871',
      'to:',
      'id: to-3216',
      'uri: direct',
      'parameters:',
      'name: operation-get-right',
      '- id: get-3806',
      'to:',
      'id: to-3916',
      'uri: direct',
      'parameters:',
      'name: operation-get-left',
    ];

    cy.openSourceCode();

    cy.checkMultiLineContent(rest);
  });
});
