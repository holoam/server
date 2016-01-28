Feature: Update

  Background:
    Given the "neutron" app exists

  Scenario: App does not exist
    Given there is no app
    When I GET "/v1/apps/neutron/update/1.0.0"
    Then I should get a 404
    And the error message should be "The 'neutron' app does not exist"

  Scenario: No update available
    Given there is no release for the "neutron" app
    When I GET "/v1/apps/neutron/update/1.0.0"
    Then I should get a 204

  Scenario: Update available with lower version
    Given the "1.0.0" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/update/2.0.0"
    Then I should get a 204

  Scenario: Major Update available
    Given the "1.0.0" release exists for the "neutron" app
    And the "2.0.0" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/update/1.0.0"
    Then I should see a release
    And the release version should be "2.0.0"
    And the release url should be "http://localhost:8080/v1/apps/neutron/releases/2.0.0/download"

  Scenario: Minor Update available
    Given the "1.0.0" release exists for the "neutron" app
    And the "1.1.0" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/update/1.0.0"
    Then I should see a release
    And the release version should be "1.1.0"
    And the release url should be "http://localhost:8080/v1/apps/neutron/releases/1.1.0/download"

  Scenario: Minor Update available
    Given the "1.0.0" release exists for the "neutron" app
    And the "1.0.1" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/update/1.0.0"
    Then I should see a release
    And the release version should be "1.0.1"
    And the release url should be "http://localhost:8080/v1/apps/neutron/releases/1.0.1/download"

  Scenario: Several updates available
    Given the "1.0.0" release exists for the "neutron" app
    Given the "1.0.1" release exists for the "neutron" app
    And the "1.1.0" release exists for the "neutron" app
    And the "1.1.1" release exists for the "neutron" app
    And the "2.0.0" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/update/1.0.0"
    Then I should see a release
    And the release version should be "2.0.0"
    And the release url should be "http://localhost:8080/v1/apps/neutron/releases/2.0.0/download"
