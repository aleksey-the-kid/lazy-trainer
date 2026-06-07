## ADDED Requirements

### Requirement: Rounded bar chart styling

Bar charts (weight history, exercise volume, weekly progress) SHALL use bars with rounded caps and the orange/magenta dual-color scheme.

#### Scenario: User views weight history chart

- **WHEN** the weight chart renders with data
- **THEN** bars have rounded tops and use the design system chart colors

### Requirement: Circular progress rings

Nutrition and goal progress indicators (e.g. calorie breakdown, macro-style stats) SHALL use circular progress rings with color-coded arcs.

#### Scenario: User views calorie breakdown

- **WHEN** the calorie breakdown sheet opens
- **THEN** progress is shown via circular rings with orange or magenta arcs

### Requirement: Stat cards with icons

Key metrics (calories, volume, duration) SHALL be displayed in small rounded stat cards with icons, matching the reference activity screen.

#### Scenario: User views workout history detail

- **WHEN** a completed session detail is shown
- **THEN** summary stats appear in icon-backed rounded cards

### Requirement: Segmented time period control

Charts with time filtering SHALL use a pill-shaped segmented control (Day / Week / Month) with orange active segment.

#### Scenario: User switches chart time range

- **WHEN** the user selects "Weekly" on a chart filter
- **THEN** the active segment is highlighted in orange and chart data updates

### Requirement: Chart accessibility

Charts SHALL remain readable with sufficient color contrast and SHALL not rely on color alone for critical information (include labels or values).

#### Scenario: User reads chart data point

- **WHEN** hovering or viewing a data point
- **THEN** the numeric value is visible as text, not color-only
