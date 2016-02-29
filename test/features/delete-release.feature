Feature: Show release

  Background:
    Given the "neutron" app exists

  Scenario: App does not exist
    Given there is no app
    When I DELETE "/v1/apps/neutron/releases/1.0.0"
    Then I should get a 404
    And the error message should be "The 'neutron' app does not exist"

  Scenario: Release does not exist
    Given there is no release for the "neutron" app
    When I DELETE "/v1/apps/neutron/releases/1.0.0"
    Then I should get a 404
    And the error message should be "The '1.0.0' release for the 'neutron' app does not exist"

  Scenario: Release exists
    Given the "1.0.0" release exists for the "neutron" app
    When I DELETE "/v1/apps/neutron/releases/1.0.0"
    Then I should get a 204
    When I GET "/v1/apps/neutron/releases"
    Then I should see an empty list
    When I GET "/v1/apps/neutron/releases/1.0.0"
    Then I should get a 404
