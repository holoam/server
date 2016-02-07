Feature: Show app

  Scenario: App does not exist
    Given there is no app
    When I GET "/v1/apps/neutron"
    Then I should get a 404
    And the error message should be "The 'neutron' app does not exist"

  Scenario: App exists
    Given the "neutron" app exists
    When I GET "/v1/apps/neutron"
    Then I should see an app
    And the app name should be "neutron"
