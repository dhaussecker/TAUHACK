# TAUlab Design Guidelines

## Design Approach
**System-Based Approach**: Drawing from Material Design and Carbon Design System principles for data-dense enterprise applications. This construction equipment management platform prioritizes clarity, efficiency, and instant data comprehension over visual flair.

## Core Design Principles
1. **Data Transparency**: Spreadsheet-style layouts with clear visual hierarchy
2. **Status-First Design**: Color-coded indicators (Green/Yellow/Red) drive immediate understanding
3. **Efficiency Over Aesthetics**: Every pixel serves functional purpose
4. **Field-Ready**: Touch-friendly targets for tablet use, readable in outdoor lighting

---

## Typography System

**Primary Font**: Inter (Google Fonts) - optimized for data density and screen clarity
**Secondary Font**: JetBrains Mono (Google Fonts) - for equipment IDs, serial numbers, and numeric data

### Type Scale
- **Page Headers**: text-2xl font-semibold (Equipment Management, Maintenance Dashboard)
- **Section Headers**: text-lg font-semibold (Site Overview, Active Jobs)
- **Card Titles/Equipment Names**: text-base font-medium
- **Data Labels**: text-sm font-medium uppercase tracking-wide (STATUS, HOURS, LOCATION)
- **Data Values**: text-base font-normal (regular data display)
- **Monospace Data**: font-mono text-sm (equipment IDs, serial numbers, timestamps)
- **Small Meta**: text-xs (last updated, operator names)

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 3, 4, 6, 8, 12** for consistency
- Component padding: p-4 to p-6
- Card spacing: space-y-4
- Section margins: mb-8 to mb-12
- Table cell padding: px-4 py-3
- Form field spacing: space-y-3

**Container Strategy**:
- Full-width application: No max-w constraints on main dashboard
- Sidebar navigation: w-64 fixed
- Content area: Fluid with min-w-0 for table overflow handling
- Modal dialogs: max-w-2xl to max-w-4xl depending on form complexity

**Grid Patterns**:
- Equipment cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Dashboard widgets: grid-cols-1 lg:grid-cols-3 (for KPIs)
- Data tables: Full-width responsive tables with horizontal scroll on mobile

---

## Component Library

### Navigation
**Sidebar Navigation** (Desktop):
- Fixed left sidebar (w-64)
- Collapsible sections for Equipment, Sites, Maintenance, Reports
- Active state: Deep Indigo background with white text
- Icons: Heroicons outline style

**Top Bar**:
- Site/company selector dropdown (left)
- Search bar (center, w-96)
- User profile and notifications (right)
- Height: h-16

**Mobile Navigation**:
- Bottom tab bar for primary sections
- Hamburger menu for secondary options

### Data Display Components

**Equipment Cards**:
- Rounded corners: rounded-lg
- Shadow: shadow-md with hover:shadow-lg
- Status indicator: Colored vertical border-l-4 (Green/Yellow/Red)
- Content padding: p-5
- Structure: Equipment name (bold), ID (mono), current hours, status badge, last seen timestamp

**Data Tables** (Spreadsheet-Style):
- Alternating row backgrounds for readability
- Sticky header: sticky top-0
- Row height: h-12 to h-14 for touch targets
- Border: border-b on rows
- Sortable columns with arrow indicators
- Color-coded rows based on maintenance status (subtle background tints)

**Status Badges**:
- Pill shape: rounded-full px-3 py-1
- Font: text-xs font-semibold uppercase
- States: Good (Green bg), Maintenance Due (Yellow bg), Critical (Red bg), Idle (Gray bg)

**KPI Cards**:
- Grid layout for dashboard metrics
- Large numeric values: text-3xl to text-4xl font-bold
- Label above: text-sm uppercase tracking-wide
- Icon in corner: w-8 h-8
- Padding: p-6

### Forms & Inputs

**Form Fields**:
- Label: text-sm font-medium mb-2
- Input height: h-11 (touch-friendly)
- Border: border-2 with focus:ring-2 focus:ring-offset-2
- Disabled state: bg-gray-50 with reduced opacity
- Required indicator: Asterisk in Deep Indigo

**Equipment Repair Request (ERR) Form**:
- Multi-step if complex, single column otherwise
- Photo upload zone with drag-and-drop
- Equipment selector with autocomplete
- Priority dropdown (Low/Medium/High/Critical)
- Submit button: Large, full-width on mobile

### Interactive Elements

**Buttons**:
- Primary: Deep Indigo background, h-11, px-6, rounded-md, font-medium
- Secondary: Deep Indigo border and text, bg-white
- Destructive: Red variants for critical actions
- Icon buttons: w-10 h-10 for toolbar actions

**QR Code Display**:
- Centered in modal or card
- Size: 256x256px minimum for scanning
- Equipment ID displayed below
- Download and print buttons

**Maintenance Timeline**:
- Vertical timeline with connecting lines
- Event dots with status colors
- Timestamp on left, description on right
- Expandable details for each entry

### Overlays & Modals

**Equipment Detail Modal**:
- Slide-in from right on desktop (w-1/2 to w-2/3)
- Full-screen on mobile
- Close button: top-right
- Tabs for: Overview, Maintenance History, Usage Stats, Documents
- Scrollable content area

**Notifications Panel**:
- Slide-down from top bar
- List of recent alerts
- Color-coded by severity
- Mark as read functionality
- Max height: h-96 with scroll

---

## Images

**No Hero Images**: This is a data-focused application dashboard, not a marketing site

**Equipment Photos**:
- Display in equipment cards and detail views
- Aspect ratio: 4:3 or 16:9
- Fallback: Equipment type icon if no photo available
- Thumbnail: w-20 h-20 in lists, larger in detail views

**Site Photos**:
- Optional header image in site detail view (h-48)
- Used for site identification in job management

**Document Previews**:
- PDF/image thumbnails in maintenance history
- Click to expand or download

---

## Responsive Breakpoints

- **Mobile First**: Base styles for phones (operators scanning QR codes)
- **Tablet** (md: 768px): Larger touch targets, two-column layouts
- **Desktop** (lg: 1024px): Sidebar navigation, multi-column grids, data tables
- **Large Desktop** (xl: 1280px): 4-column equipment grids, expanded data density

---

## Special Considerations

**Tablet Field Use**:
- Minimum touch target: 44px × 44px
- High contrast for outdoor visibility
- Offline-first UI patterns (loading states, sync indicators)
- QR scanner integration with camera overlay

**Data Export Views**:
- Print-friendly layouts with @media print styles
- CSV export: Simple button with icon
- PDF reports: Preview before download

**Color-Coded Status System** (Applied to borders, badges, row backgrounds):
- Green: Equipment operational, maintenance current
- Yellow: Maintenance approaching, attention needed
- Red: Maintenance overdue, critical issue, offline
- Gray: Idle, deactivated, or archived

**Performance**:
- Virtualized tables for 100+ equipment entries
- Lazy-loaded equipment photos
- Debounced search inputs
- Optimistic UI updates for state changes

This design prioritizes instant comprehension of equipment status, streamlined data entry for field workers, and comprehensive oversight for administrators—all while maintaining the clean, spreadsheet-inspired aesthetic that made Acadia's system effective.