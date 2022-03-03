describe("tests end to end", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("checks url", () => {
    cy.url().should("equal", "http://localhost:3000/");
  });

  it("displays map loader", () => {
    cy.get("[data-test=map-loader]");
  });

  it("displays map", () => {
    cy.get("[class=mapboxgl-map]");
  });

  it("displays list and checks elements count", () => {
    cy.get("[data-test=list]");
    cy.get("[class=ride-unit]").should("have.length", 5);
  });

  it("clicks on load button and checks elements count", () => {
    cy.get("[class=load-more]").should("have.length", 1);
    cy.get("[class=load-more]")
      .click()
      .then((e) => {
        cy.get("[class=ride-unit]").should("have.length", 10);
      });
  });
});
