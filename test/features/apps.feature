Feature: List apps

  Scenario: No apps
    Given there is no app
    When I GET "/v1/apps"
    Then I should see an empty list

  Scenario: One app
    Given the "neutron" app exists
    When I GET "/v1/apps"
    Then I should see the app list
    And the app list should contain the "neutron" app

  Scenario: More apps
    Given the "neutron" app exists
    Given the "todo" app exists
    When I GET "/v1/apps"
    Then I should see the app list
    And the app list should contain the "neutron" app
    And the app list should contain the "todo" app
