Feature: App main window

  Scenario: App starts
    Given I wait 5 seconds
    Then the window title should be "Neutron TestApp"
    And the page title should be "Neutron TestApp"
