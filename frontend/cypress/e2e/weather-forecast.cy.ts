describe('template spec', () => {
  beforeEach(() => {
    cy.visit('/', { timeout: 30000 })
    cy.window().should('have.property', 'google')
  })

  it('Should display header page', () => {
    cy.get('header > div').contains('Weather Forecast App')
    cy.get('nav > a').contains('Home')
    cy.get('nav > a').contains('About')
  })

  it('Should display Home page', () => {
    cy.contains('Type a city name to search')
    cy.contains('Weather forecast for selected location')
    cy.contains('Select a location to view weather forecast')
  })

  it('Should display About page', () => {
    cy.get('nav > a').contains('About').click()
    cy.contains('This is a weather forecast application')
  })

  it('Should search for a city', () => {
    const serachField = cy.get('[data-test="location-search"]')
    serachField.type('Copenhagen, Denmark')
    cy.wait(1000)
    cy.get('.pac-container').should('be.visible')
    cy.get('.pac-item').first().click()

    cy.get('[data-test="search-city-selected-location"]').should('be.visible')
    cy.get('[data-test="search-city-selected-location"]').should('contain', 'Copenhagen, Denmark')

    cy.get('.vue-map-container').should('be.visible')
  })

  it('Should select a location on the map', () => {
    const serachField = cy.get('[data-test="location-search"]')
    serachField.type('Copenhagen, Denmark')
    cy.wait(1000)
    cy.get('.pac-container').should('be.visible')
    cy.get('.pac-item').first().click()
    cy.wait(4000)
    cy.get('.vue-map-container').click(100, 100)
    cy.wait(2000)
    cy.get('[data-test="search-city-selected-location"]').should('be.visible')
    cy.get('[data-test="search-city-selected-location"]').should('contain', 'XQM2+R6 Videbaek, Denmark')
  })

  it('Should display weather forecast', () => {
    const serachField = cy.get('[data-test="location-search"]')
    serachField.type('Copenhagen, Denmark')
    cy.wait(1000)
    cy.get('.pac-container').should('be.visible')
    cy.get('.pac-item').first().click()
    cy.wait(4000)
    cy.get('[data-test="weather-forecast"]', { timeout: 30000 }).should('be.visible')
    cy.get('[data-test="temperature"]').should('be.visible')
    cy.get('[data-test="wind-speed"]').should('be.visible')
    cy.get('[data-test="wind-direction"]').should('be.visible')
    cy.get('[data-test="weather-condition"]').should('be.visible')
  })
})