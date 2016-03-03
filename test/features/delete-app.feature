Feature: Delete app

  Scenario: App does not exist
    Given there is no app
    When I DELETE "/v1/apps/neutron"
    Then I should get a 404
    And the error message should be "The 'neutron' app does not exist"

  Scenario: App exists
    Given the "neutron" app exists
    When I DELETE "/v1/apps/neutron"
    Then I should get a 204
    When I GET "/v1/apps/neutron"
    Then I should get a 404

  Scenario: App exists and has releases
    Given the "neutron" app exists
    And the "1.0.0" release exists for the "neutron" app
    And the "2.0.0" release exists for the "neutron" app
    When I DELETE "/v1/apps/neutron"
    Then I should get a 204
    When I GET "/v1/apps"
    Then I should see an empty list
    When I GET "/v1/apps/neutron"
    Then I should get a 404
