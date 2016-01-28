Feature: Show release

  Background:
    Given the "neutron" app exists

  Scenario: App does not exist
    Given there is no app
    When I GET "/v1/apps/neutron/releases"
    Then I should get a 404
    And the error message should be "The 'neutron' app does not exist"

  Scenario: Release does not exist
    Given there is no release for the "neutron" app
    When I GET "/v1/apps/neutron/releases/1.0.0"
    Then I should get a 404
    And the error message should be "The '1.0.0' release for the 'neutron' app does not exist"

  Scenario: Release exists
    Given the "1.0.0" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/releases/1.0.0"
    Then I should see a release
    And the release version should be "1.0.0"
    And the release url should be "http://localhost:8080/v1/apps/neutron/releases/1.0.0/download"

  Scenario: Download release
    Given the "1.0.0" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/releases/1.0.0/download"
    Then I should get a 200
    And the content type should be "application/zip"
    And the attached file should be "update.zip"
