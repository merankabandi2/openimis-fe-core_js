# openIMIS Frontend Core reference module

This repository holds the files of the openIMIS Frontend Core reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js) and provides

- openIMIS core mechanisms (authentication,...)
- openIMIS core components (Application iteself, MainMenu, JournalDrawer,...)
- openIMIS ModulesManager (loading, configuring and wiring all modules)
- many Generic components to be (re)used in other (business-focused) openimis components
- various helpers (building GraphQL queries,...)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/openimis/openimis-fe-core_js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/openimis/openimis-fe-core_js/alerts/)

## Core Components

- `App`: application pages container (all openIMIS pages are loaded within that container)
- `AppWrapper`: wrapping main menu around each application page
- `JournalDrawer`: side bar in which mutation journal is displayed
- `AlertDialog`: pop up (modal) dialog to display an alert message (one 'ok' button)
- `ConfirmDialog`: pop up (modal) dialog to display a confirmation message (with 'cancel' / 'confirm' buttons)
- `SelectDialog`: pop up (modal) dialog to display a message and take an action between two options (yes/no, do/do not, continue/go back) - with editable (through the props) button labels, message content and dialog title, without using Redux store and actions
- `FataError`: page for non-recoverable backend access errors
- `Help`: main menu entry for Help (link to manual)
- `Logout`: main menu entry to logout
- `KeepLegacyAlive`: component to be registered in core.Boot contribution to keep legacy openIMIS session alive while interacting with new openIMIS pages
- `ErrorPage`: displays error messages with status, title, and optional logo. Includes navigation button to the homepage.
- `PermissionCheck`: controls access to content based on user rights (403 error). Renders content if user has required rights, otherwise shows `ForbiddenPage`.
- `ForbiddenPage`: shown when a user lacks permission to access a specific page or resource. Displays an access denied message.
- `NotFoundPage`: appears when a user visits a non-existent route (404 error). Informs the user that the page is unavailable and suggests navigation option.
- `InternalServerErrorPage`: displays a message for a 500 Internal Server Error, informing users of a server-side issue in the application.
 * `LanguageQuickPicker` is a component that allows users to quickly switch between different languages. Available on user's navbar.

## Generic Components (to be reused along business-focused components)

- `MainMenuContribution`: generic class for main menu specific contributions (with route,...)
- `AutoSuggestion`: generic suggest-as-you-type (text)input field

  Note: cope with both pre-fetched (cached) suggestion list and query as you type (with debounce)

- `ConstantBasePicker`: fixed list select input field
- `Picker`: dialog-based (i.e. with search criteria) picker (handles pagination,...)
- `Contributions`: generic component to open business components for contributions
- `ControlledField`: field that is skipped based on module configuration
- `TextInput`,`NumberInput`, `AmountInput` & `SelectInput`: generic input components for the various data types
- `ValidatedTextInput`: generic input component which checks the uniqueness of entered data and gives the appropriate information about it
- `FieldLabel`: formatting a label in a form
- `FormattedMessage`: translated text (module/key)
- `ProgressOrError`: display progress during component's asynchronous calls... and hide or diaply error message when asynchronous call returns
- `Searcher`: generic searcher page (with criteria form and result table)
- `SearcherActionButton`: represents an action button used within a search interface.
- `Form`: generic form. Manage dirty state, displays add/save button,...
- `Table`: generic table. Headers (with -sort-actions), rows, optional setting - showOrdinalNumber that will show column with ordinal number as first column, ...

## Helpers

### Contexts

- `ToastContext`: This context provides toast notification functionality within the application. It enables you to easily display success, error, warning, or informational messages as toast notifications.
__To use it__, you need to import `useToast` from `@openimis/fe-core` and use one of the provided functions (e.g., `showSuccess`, `showError`, `showWarning`, `showInfo`) to trigger different types of toast notifications.

### redux actions helpers

- `journalize`: helper to trigger the `CORE_MUTATION_ADD` action (which register a mutation in the journal)
- `graphql`: helper to send the GraphQL queries (HTTP POST) and dispatch appropriate actions to redux
- `coreAlert`: helper to open the alert modal pop (cfr. AlertDialog)
- `coreConfirm`: helper to open the confirm modal pop (cfr. ConfirmDialog)

### api

- `formatQuery`: helper to format a simple GraphQL query (filters and projections)
- `formatPageQuery`: helper to format a GraphQL query (filters and projections), with pagination (edges and node)
- `formatPageQueryWithCount`: helper to format a GraphQL query, with pagination and totalCount
- `formatMutation`: helper to format a mutation (with clientMutationId and clientMutationLabel)
- `{de|en}codeId`: decoder|encoder for Graphene specific id mechanism
- `parseData`: navigate thru GraphQL standard edges|node structure and parse data from json to js object
- `pageInfo`: extract GraphQL standard pagination info (hasNextPage,...)
- `dispatchMutation{Req|Resp|Err}`: helper to submit a mutation and wait for response/error
- `formatServerError`: helper to format server error (error 500,...)
- `formatGraphQLError`: helper to format a graphql response returning (standard) error
- `openBlob`: helper to open a Blob (pdf,...) as a result of an asynchronous call

### i18n

- `formatMessage`: provide the translation of a module-prefixed key (fall back on openimis-fe_js/translations/ref.json)
- `formatMessageWithValues`: provide the translation of a module-prefixed key, for messages with vairable parts
- `formatAmount`: format an amount as a string
- `formatDateFromISO`: parse ISO date into (local) datetime

  Note: depends on the selected calendar (Gregorian vs. Nepali)

- `toISODate`: format local date to ISO format

  Note: depends on the selected calendar (Gregorian vs. Nepali)

### JSON handler

- `createFieldsBasedOnJSON`: Creates additional fields from a JSON string and returns an array of field objects.
- `renderInputComponent`: Renders the appropriate input component based on the field type and value.

### navigation

- `withHistory`: helper to inject history to any openIMIS component (allow navigation)
- `historyPush`: helper to push a new route to openIMIS navigation

### modules

- `withModulesManager`: helper to inject modulesManager to any openiMIS component

## Available Contribution Points

- `core.Boot`: register components that should be mounted at application start. It allows business modules to load cache at application startup, register to redux events (even when module not yet accessed),... The components registered for this contribution should not render any HTML (render should return null)
- `core.AppBar`: ability to add entries in the AppBar (known usage: insuree Enquiry component)
- `core.MainMenu`: ability to add main menu entries from modules (known usage: claim, insuree,...)
- `core.Router`: ability to register routes in client-side routing (known usage: claim, insuree,...)
- `core.UnauthenticatedRouter`: ability to register routes in client-side routing for pages that don't require user authentication
- `core.LoginPage`: ability to add components to the menu login page

## Contributions

- `core.Boot` - KeepLegacyAlive: contributing to own contribution point in order to register the component that pings the Legacy openIMIS application to prevent session timeout while in the new part.
- `core.Router`: registering `roles`, `roles/role` routes in openIMIS client-side router
- `admin.MainMenu`:

  **Roles Management** (`roleManagement.label` translation key)

## Published Components

- `core.DatePicker`, configured date picker (Gregorian vs. Nepali)
- `core.YearPicker`, pick a year within a range
- `core.MonthPicker`, contant-based month picker. Translation keys `month.null`, `month.1`,...
- `core.LanguagePicker`, pick from available languages
- `core.WarningBox`, simple alert component to show warnings or messages, with options to customize its look and size.

## Dispatched Redux Actions

- `CORE_ALERT{_CLEAR}`: display/close the AlertDialog modal pop up
- `CORE_CONFIRM{_CLEAR}`: display/close the ConfirmDialog modal pop up
- `CORE_USERS_CURRENT_USER_{REQ|RESP|ERR}`: retrieve authenticated info (language, rights,...)
- `CORE_MUTATION_{ADD|REQ|RESP|ERR}`: mutation lifecycle (request,...)
- `CORE_HISTORICAL_MUTATIONS_{REQ|RESP|ERR}`: retrieve mutations from previous sessions (init JournalDrawer)
- `CORE_ROLE_MUTATION_{REQ|ERR}`: sending a mutation on Role
- `CORE_ROLES_{REQ|RESP|ERR}`: retrieve Roles
- `CORE_MODULEPERMISSIONS_{REQ|RESP|ERR}`: retrieve permissions of all modules
- `CORE_LANGUAGES_{REQ|RESP|ERR}`: retrieve available languages and their codes
- `CORE_ROLE_{REQ|RESP|ERR}`: retrieve a single Role
- `CORE_ROLERIGHTS_{REQ|RESP|ERR}`: retrieve rights/permissions of a single Role
- `CORE_CREATE_ROLE_RESP`: receive a result of create Role mutation
- `CORE_UPDATE_ROLE_RESP`: receive a result of update Role mutation
- `CORE_DUPLICATE_ROLE_RESP`: receive a result of duplicate Role mutation
- `CORE_DELETE_ROLE_RESP`: receive a result of delete Role mutation
- `CORE_CALENDAR_TYPE_TOGGLE`: set calendar switch status between gregorian and other calendar

## Other Modules Listened Redux Actions

None

## Configurations Options
- `core.PublicPage`: This contributions point serves as the Public Page for the OpenIMIS App. To enable its use, it must be exposed as a **core.PublicPage** contribution point. Additionally, the database configuration variable **App.enablePublicPage** must be set to `true`.
- `showJournalSidebar`: This determines whether to render the Journal sidebar or not. __IMPORTANT__:  The Journal provides crucial information about the state of mutations, including whether they succeeded or failed. If you choose to hide it, you must ensure the user is informed of the mutation outcome - consider using toast notifications. **This configuration only hides the Journal. It does not automatically add toast notifications out of the box.**.
- `datePicker`: the concrete date picker to publish as `core.DatePicker` component ("ad"= Gregorian DatePicker, "ne"= Nepali calendar date picker )
- `useDynPermalinks`: use ?dyn=<Base64-URL> when opening in new tab (prevent sending client-side routes to server while) (Default: false)
- `core.JournalDrawer.pollInterval`: poll interval (in ms) to check for mutation status once submitted (Default: 2000)
- `core.KeepLegacyAlive.pollInterval`: poll interval (in ms) to send the ping to legacy openIMIS (to prevent session timeout). (Default: 300000 = 5')
- `journalDrawer.pageSize`: page size when loading (historical) mutations (Default: `5`)
- `AutoSuggestion.limitDisplay`: threshold to limit the number of items in the auto suggestions (adding 'more options...' message), default: 10
- `AmountInput.currencyPosition`: position of the currency for the AmountInput. Choices are `start` and `end` (default: `start`)
- `menuLeft`: position menu in the Drawer component on the left site of the application
- `calendarSwitch`: enable calendar switcher toggle on the navbar of the webpage. Currently supports nepali calendar. Default false.
- `secondCalendarFormatting`: formatting options for second calendar (both picker and display), default: "DD-MM-YYYY"
- `secondCalendarFormattingLang`: formatting language for second calendar (when displayed as saved data, not in pickers), default: "en"
- `redirectToCoreMISConfluenceUrl`: clicking on questionmark icon will take you to coreMIS confluence page, default openIMIS manual
- `App.economicUnitConfig`:
  In the specified configuration, when the parameter is set to **true**, it necessitates that users are associated with an Economic Unit. If a user lacks this association, a modal will be displayed to prompt them to establish it. Until the user is linked to a unit, their only authorized action is to log out. The default configuration is **false**.
- `LogoutButton.showMPassProvider`: when activated, routes the user to the saml logout page for secure session termination
- `LoginPage.showMPassProvider`: redirects users to the saml login page, facilitating access to mPass-protected resources
- `secondCalendarType`: type of secondary calendar picker (if enabled), default "nepali"
- `secondCalendarLocale`: locale for secondary calendar picker (if enabled), default "nepali_en",
- `Input.disabledVisibilityBoost`: This setting enhances the visibility of disabled input fields (e.g., text/number inputs, date pickers). When set to __true__, the label color changes to `#181716`, and the input value color to `#5E5B50`. The default is __false__.
- `limitMutationLogsQuery`: This config to enalble or disable fetchMutationLogs query mutation in core,

## Main Menu and Submenu Configuration

### Overview

This document provides guidance on how to configure the Main Menu and its Submenus within the OpenIMIS application. It outlines the structure of menu entries, explains key concepts, and lists all possible configurations extracted from the system.

### Key Concepts
1. **Main Menu and Submenu Structure:**
   - Each menu is uniquely identified by an `id`.
   - Submenus are associated with specific Main Menu entries and cannot currently be added dynamically unless linked to predefined frontend logic.
2. **Attributes of Menu Entries:**
   - **`text`:** Label displayed for the menu entry.
   - **`icon`:** Icon displayed alongside the label.
   - **`route`:** Path to navigate when the menu is clicked.
   - **`filter`:** Logic to determine visibility based on user permissions.
3. **Positioning:**
   - The `position` attribute determines the order of menus and submenus in the interface.
4. **Dynamic Linking:**
   - New menus can be created dynamically, but submenus must be linked to existing application logic.
5. **Keeping old approach:**
   - If you want to keep old approach, just leave 'menus' as empty array or do not put this key into configuration file. In that case menu will be populated in a deault, old way based on the order of modules in openimis.json.  

### Table of Configurations

Here’s the complete table with all the submenu configurations extracted, including their `Name of Submenu`, `ID of Submenu`, `Filter`, and `Route`.

| **Name of Submenu**                  | **ID of Submenu**                | **Filter**                                                          | **Route**                           |
|--------------------------------------|----------------------------------|----------------------------------------------------------------------|-------------------------------------|
| Tasks Management View                | `task.tasks`                    | `(rights) => rights.includes(RIGHT_TASKS_MANAGEMENT_SEARCH_ALL)`    | `/tasks`                            |
| Tasks Management All View            | `task.allTasks`                 | `(rights) => rights.includes(RIGHT_TASKS_MANAGEMENT_SEARCH_ALL)`    | `/AllTasks`                         |
| Registers                            | `tools.registers`               | `(rights) => enablers(rights, RIGHT_REGISTERS)`                     | `/tools/registers`                  |
| Extracts                             | `tools.extracts`                | `(rights) => enablers(rights, RIGHT_EXTRACTS)`                      | `/tools/extracts`                   |
| Reports                              | `tools.reports`                 | `(rights) => enablers(rights, RIGHT_REPORTS)`                       | `/tools/reports`                    |
| Social Protection Benefit Plans      | `socialProtection.benefitPlans` | `(rights) => rights.includes(RIGHT_BENEFIT_PLAN_SEARCH)`            | `/benefitPlans`                     |
| My Profile                           | `profile.myProfile`             | None                                                                | `/profile/myProfile`                |
| Change Password                      | `profile.changePassword`        | None                                                                | `/profile/changePassword`           |
| Policies                             | `insuree.policies`              | `(rights) => rights.includes(RIGHT_POLICY)`                         | `/${ROUTE_POLICY_POLICIES}`         |
| Payment Point                        | `legalAndFinance.paymentPoint`  | `(rights) => rights.includes(RIGHT_PAYMENT_POINT_SEARCH)`           | `/${ROUTE_PAYMENT_POINTS}`          |
| Payrolls                             | `legalAndFinance.payrolls`      | `(rights) => rights.includes(RIGHT_PAYROLL_SEARCH)`                 | `/${ROUTE_PAYROLLS}`                |
| Payrolls Pending                     | `legalAndFinance.payrollsPending` | `(rights) => rights.includes(RIGHT_PAYROLL_SEARCH)`              | `/${ROUTE_PAYROLLS_PENDING}`        |
| Payrolls Approved                    | `legalAndFinance.payrollsApproved` | `(rights) => rights.includes(RIGHT_PAYROLL_SEARCH)`            | `/${ROUTE_PAYROLLS_APPROVED}`       |
| Payrolls Reconciled                  | `legalAndFinance.payrollsReconciled` | `(rights) => rights.includes(RIGHT_PAYROLL_SEARCH)`          | `/${ROUTE_PAYROLLS_RECONCILED}`     |
| Payments                             | `insuree.payment`               | `(rights) => rights.includes(RIGHT_PAYMENT)`                        | `/${ROUTE_PAYMENTS}`                |
| Payment Cycles                       | `legalAndFinance.paymentCycles` | `(rights) => rights.includes(RIGHT_PAYMENT_CYCLE_SEARCH)`           | `/${ROUTE_PAYMENT_CYCLES}`          |
| Payers                               | `admin.payers`                  | `(rights) => rights.includes(RIGHT_PAYERS)`                         | `/payer/payers`                     |
| Individual Reports                   | `openSearch.individualReports`  | None                                                                | `/individualReports`                |
| Group Reports                        | `openSearch.groupReports`       | None                                                                | `/groupReports`                     |
| Beneficiary Reports                  | `openSearch.beneficiaryReports` | None                                                                | `/beneficiaryReports`               |
| Invoice Reports                      | `openSearch.invoiceReports`     | None                                                                | `/invoiceReports`                   |
| Payment Reports                      | `openSearch.paymentReports`     | None                                                                | `/paymentReports`                   |
| Grievance Reports                    | `openSearch.grievanceReports`   | None                                                                | `/grievanceReports`                 |
| Data Updates Reports                 | `openSearch.dataUpdatesReports` | None                                                                | `/dataUpdatesReports`               |
| Open Search Config                   | `openSearch.openSearchConfig`   | None                                                                | `/dashboardConfiguration`           |
| Invoices                             | `legalAndFinance.invoices`      | `(rights) => rights.filter((r) => r >= RIGHT_INVOICE_SEARCH && r <= RIGHT_INVOICE_AMEND).length > 0` | `/invoices`                         |
| Bills                                | `legalAndFinance.bills`         | `(rights) => rights.filter((r) => r >= RIGHT_BILL_SEARCH && r <= RIGHT_BILL_AMEND).length > 0`        | `/bills`                            |
| Add Family or Group                  | `insuree.addFamilyOrGroup`      | `(rights) => rights.includes(RIGHT_FAMILY_ADD)`                     | `/${ROUTE_INSUREE_FAMILY}`          |
| Families or Groups                   | `insuree.familiesOrGroups`      | `(rights) => rights.includes(RIGHT_FAMILY)`                         | `/${ROUTE_INSUREE_FAMILIES}`        |
| Insurees                             | `insuree.insurees`              | `(rights) => rights.includes(RIGHT_INSUREE)`                        | `/${ROUTE_INSUREE_INSUREES}`        |
| Individuals                          | `individual.individuals`        | `(rights) => rights.includes(RIGHT_INDIVIDUAL_SEARCH)`              | `/${ROUTE_INDIVIDUALS}`             |
| Groups                               | `individual.groups`              | `(rights) => rights.includes(RIGHT_GROUP_SEARCH)`                    | `/${ROUTE_GROUPS}`                  |
| API Imports                          | `individual.api_imports`         | `(rights) => rights.includes(RIGHT_INDIVIDUAL_SEARCH)`               | `/${ROUTE_API_IMPORTS}`             |
| Grievances                           | `grievance.grievances`           | `(rights) => rights.includes(RIGHT_TICKET_SEARCH)`                   | `/${ROUTE_TICKET_TICKETS}`          |
| Add Grievance                        | `grievance.add`                  | `(rights) => rights.includes(RIGHT_TICKET_ADD)`                      | `/${ROUTE_TICKET_NEW_TICKET}`      |
| Role Management                      | `admin.roleManagement`           | `(rights) => rights.includes(RIGHT_ROLE_SEARCH)`                     | `"/" + ROUTE_ROLES`                 |
| Contribution Plans                   | `admin.contributionPlans`        | `(rights) => rights.includes(RIGHT_CONTRIBUTION_PLAN_SEARCH)`        | `"/" + ROUTE_CONTRIBUTION_PLANS`   |
| Contribution Plan Bundles            | `admin.contributionPlanBundles`  | `(rights) => rights.includes(RIGHT_CONTRIBUTION_PLAN_BUNDLE_SEARCH)` | `"/" + ROUTE_CONTRIBUTION_PLAN_BUNDLES` |
| Payment Plans                        | `legalAndFinance.paymentPlans`   | `(rights) => rights.includes(RIGHT_PAYMENT_PLAN_SEARCH)`            | `"/" + ROUTE_PAYMENT_PLANS`        |
| Contribution                         | `insuree.contribution`           | `(rights) => rights.includes(RIGHT_CONTRIBUTION)`                    | `/${ROUTE_CONTRIBUTION_CONTRIBUTIONS}` |
| Health Facility Claims               | `claim.healthFacilityClaims`     | `(rights) => rights.some((r) => r >= RIGHT_CLAIMREVIEW && r <= RIGHT_PROCESS)` | `/claim/healthFacilities`           |
| Reviews                              | `claim.reviews`                  | `(rights) => rights.some((r) => r >= RIGHT_CLAIMREVIEW && r <= RIGHT_PROCESS)` | `/claim/reviews`                    |
| Claim Batch (Batch Run)              | `claim.claimBatch`               | `(rights) => !!rights.filter(r => r >= RIGHT_PROCESS && r <= RIGHT_PREVIEW).length` | `/${ROUTE_CLAIM_BATCH}`             |
| Products                             | `admin.products`                 | `(rights) => rights.includes(RIGHT_PRODUCTS)`                        | `/admin/products`                   |
| Health Facilities                    | `admin.healthFacilities`         | `(rights) => rights.includes(RIGHT_HEALTHFACILITIES)`                | `/location/healthFacilities`       |
| Medical Services Prices List         | `admin.services`                 | `(rights) => rights.includes(RIGHT_PRICELISTMS)`                     | `/medical/pricelists/services`     |
| Medical Items Prices List            | `admin.items`                    | `(rights) => rights.includes(RIGHT_PRICELISTMI)`                     | `/medical/pricelists/items`        |
| Medical Services                     | `admin.medicalServices`          | `(rights) => rights.includes(RIGHT_MEDICALSERVICES)`                 | `/medical/pricelists/services`     |
| Medical Items                        | `admin.medicalItems`             | `(rights) => rights.includes(RIGHT_MEDICALITEMS)`                    | `/medical/pricelists/items`        |
| Users                                | `admin.users`                    | `(rights) => rights.includes(RIGHT_USERS)`                           | `/admin/users`                      |
| Locations                            | `admin.locations`                | `(rights) => rights.includes(RIGHT_LOCATIONS)`                       | `/location/locations`              |
| Contracts                            | `legalAndFinance.contracts`      | `(rights) => rights.includes(RIGHT_POLICYHOLDERCONTRACT_SEARCH)`     | `"/" + ROUTE_CONTRACTS`             |


### Additional Notes

- **Dynamic Menu Creation:** New menus can be added dynamically by defining them in the configuration.

- **Submenu Restrictions:** Submenus must be linked to predefined frontend logic and cannot currently be added dynamically.

- **Configuration Management:** Use the `id` field to map menus and submenus to their frontend counterparts for consistent functionality.

### Useful links (openIMIS wiki page on Confluence)
- [More detailed instruction of configuration](https://openimis.atlassian.net/wiki/spaces/OP/pages/4209606659/Solution+Building+configuration+of+Main+Menu+and+Submenus)
- [List of possible configurations of submenus items](https://openimis.atlassian.net/wiki/spaces/OP/pages/4209737755/List+of+submenu+entries+available+in+system)
- [Detailed description of technical approach to achieve having menu configurable](https://openimis.atlassian.net/wiki/spaces/OP/pages/4209803280/Technical+Approach+to+have+Menu+Configuration+flexible).