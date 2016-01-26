Feature: API

  Scenario: No apps
    When I GET "/apps"
    Then I should see an empty list

  Scenario: Apps
    Given the "neutron" app exists
    When I GET "/apps"
    Then I should see the app list
    And the app list should contain the "neutron" app

  Scenario: No Releases
    Given the "neutron" app exists
    When I GET "/apps/neutron"
    Then I should see an empty list

  Scenario: Releases
    Given the "neutron" app exists
    And the "1.0.0" release exists for the "neutron" app
    When I GET "/apps/neutron"
    Then I should see the release list
    And the release list should contain the "1.0.0" release
