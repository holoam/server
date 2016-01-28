Feature: List releases

  Background:
    Given the "neutron" app exists

  Scenario: No Releases
    Given there is no release for the "neutron" app
    When I GET "/v1/apps/neutron/releases"
    Then I should see an empty list

  Scenario: One release
    Given the "1.0.0" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/releases"
    Then I should see the release list
    And the release list should contain the "1.0.0" release

  Scenario: More release
    Given the "1.0.0" release exists for the "neutron" app
    And the "2.0.0" release exists for the "neutron" app
    When I GET "/v1/apps/neutron/releases"
    Then I should see the release list
    And the release list should contain the "1.0.0" release
    And the release list should contain the "2.0.0" release
