# Stocky - Personal Stock Options Tracker

## Overview

A Progressive Web App (PWA) for tracking personal stock options vesting schedules and calculating potential gains. Built for personal use without authentication.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18+ with TypeScript |
| UI Library | Mantine UI (latest) |
| Routing | TanStack Router |
| State Management | Zustand |
| Data Persistence | localStorage |
| PWA | Vite PWA plugin |

### Explicitly NOT Using
- Tailwind CSS
- shadcn/ui
- Any authentication system
- Backend/database

---

## Data Model

### StockPlan

```typescript
interface StockPlan {
  id: string;                  // UUID
  name: string;                // Plan name (e.g., "2024 Grant")
  ticker: string;              // Stock ticker (default: "BLSH")
  units: number;               // Total number of units granted
  strikePrice: number;         // Strike price per unit in USD
  startDate: string;           // ISO date string (grant/vesting start date)
  createdAt: string;           // ISO date string
  updatedAt: string;           // ISO date string
}
```

### AppSettings

```typescript
interface AppSettings {
  currentStockPrice: number;   // Manually entered current stock price in USD
  lastUpdated: string;         // When stock price was last updated
}
```

### Zustand Store Structure

```typescript
interface StockyStore {
  // Plans
  plans: StockPlan[];
  addPlan: (plan: Omit<StockPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlan: (id: string, plan: Partial<StockPlan>) => void;
  deletePlan: (id: string) => void;

  // Settings
  currentStockPrice: number;
  setCurrentStockPrice: (price: number) => void;
}
```

---

## Vesting Logic

### Rules

1. **Cliff Period**: 1 year - no vesting occurs until the first anniversary of the start date
2. **Vesting Schedule**: 25% vests on each anniversary (years 1, 2, 3, 4)
3. **Calculation**: Only fully completed years count (no pro-rata/partial vesting)
4. **Maximum**: 100% vested after 4 years

### Vesting Calculation Function

```typescript
function calculateVestedUnits(plan: StockPlan, asOfDate: Date): number {
  const startDate = new Date(plan.startDate);
  const yearsElapsed = Math.floor(
    (asOfDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  if (yearsElapsed < 1) return 0;  // Cliff not reached

  const vestedYears = Math.min(yearsElapsed, 4);
  const vestedPercentage = vestedYears * 0.25;

  return Math.floor(plan.units * vestedPercentage);
}
```

### Vesting Examples

| Start Date | Check Date | Years Elapsed | Vested % | Units (of 1000) |
|------------|------------|---------------|----------|-----------------|
| 2024-01-01 | 2024-06-01 | 0.4 | 0% | 0 |
| 2024-01-01 | 2025-01-01 | 1.0 | 25% | 250 |
| 2024-01-01 | 2025-06-01 | 1.4 | 25% | 250 |
| 2024-01-01 | 2026-01-01 | 2.0 | 50% | 500 |
| 2024-01-01 | 2028-01-01 | 4.0 | 100% | 1000 |
| 2024-01-01 | 2030-01-01 | 6.0 | 100% | 1000 |

---

## Pages & Routes

### Route Structure

```
/                 → Home (Table + Cards)
/calculator       → Gain Calculator
/plan/new         → Add New Plan
/plan/:id/edit    → Edit Plan
```

---

## Page Specifications

### 1. Home Page (`/`)

The main dashboard displaying all stock options data.

#### Layout (Top to Bottom)

1. **Header Section**
   - App title: "Stocky"
   - Current stock price input with label "BLSH Price (USD)"
   - "Add Plan" button (navigates to `/plan/new`)

2. **Vesting Table**
   - Shows projected vesting across years
   - Columns: Plan Name | Current Year | Current Year +1 | Current Year +2
   - Each cell displays:
     - Top: Number of vested units
     - Bottom: Value in USD (units × current stock price)
   - **Total Row** at bottom summing all plans
   - Empty state: "No plans yet. Add your first stock option plan."

3. **Plans Cards Section**
   - Section header: "Your Plans"
   - Cards sorted by start date (oldest first)
   - Each card displays all plan details (see Card Specification below)

#### Vesting Table Specification

```
| Plan Name     | 2026           | 2027           | 2028           |
|---------------|----------------|----------------|----------------|
| 2024 Grant    | 250 units      | 500 units      | 750 units      |
|               | $9,117.50      | $18,235.00     | $27,352.50     |
|---------------|----------------|----------------|----------------|
| 2025 Grant    | 0 units        | 100 units      | 200 units      |
|               | $0.00          | $3,647.00      | $7,294.00      |
|---------------|----------------|----------------|----------------|
| **TOTAL**     | **250 units**  | **600 units**  | **950 units**  |
|               | **$9,117.50**  | **$21,882.00** | **$34,646.50** |
```

**Table Logic:**
- "Current Year" = January 1st of the current calendar year
- Calculate vested units as of Dec 31st of each displayed year
- Value = Vested Units × Current Stock Price

#### Plan Card Specification

Each card displays:
- **Plan Name** (header)
- **Ticker**: BLSH
- **Total Units**: X,XXX
- **Strike Price**: $XX.XX
- **Start Date**: MMM DD, YYYY
- **Vesting Progress**: Visual progress bar + "X of 4 years vested"
- **Currently Vested**: XXX units (XX%)
- **Actions**: Edit button, Delete button (with confirmation)

---

### 2. Add/Edit Plan Page (`/plan/new`, `/plan/:id/edit`)

A form for creating or editing stock option plans.

#### Form Fields

| Field | Type | Validation | Default |
|-------|------|------------|---------|
| Plan Name | Text input | Required, non-empty | "" |
| Stock Ticker | Text input | Required | "BLSH" |
| Number of Units | Number input | Required, positive integer | "" |
| Strike Price (USD) | Number input | Required, positive number, 2 decimals | "" |
| Start Date | Date picker | Required | Today |

#### Buttons
- **Save** - Validates and saves, navigates to home
- **Cancel** - Navigates back to home without saving

#### Edit Mode Additional Features
- Pre-populate all fields with existing data
- Page title: "Edit Plan" instead of "Add Plan"

---

### 3. Calculator Page (`/calculator`)

Calculate potential gains from selling vested stock options.

#### Layout

1. **Header**
   - Title: "Gain Calculator"
   - Subtitle: "Calculate your potential profit from selling vested options"

2. **Input Section**
   - **Sale Date**: Date picker
     - Default: First day of next month
   - **Expected Stock Price (USD)**: Number input
     - Autofocus on page load
     - Allow decimals (2 decimal places)
     - Placeholder: "Enter expected price"

3. **Results Section** (updates in real-time as inputs change)

#### Results Display

Show the following values in a clear, card-based layout:

| Label | Calculation | Format |
|-------|-------------|--------|
| **Vested Units** | Sum of vested units across all plans at sale date | X,XXX units |
| **Total Sale Value** | Vested Units × Expected Price | $XXX,XXX.XX |
| **Strike Price Cost** | Sum of (Vested Units per plan × Strike Price per plan) | $XXX,XXX.XX |
| **Gross Profit** | Total Sale Value - Strike Price Cost | $XXX,XXX.XX |
| **Tax (24%)** | Gross Profit × 0.24 | $XXX,XXX.XX |
| **Net Profit (USD)** | Gross Profit - Tax | $XXX,XXX.XX |
| **Net Profit (SGD)** | Net Profit × USD/SGD rate | S$XXX,XXX.XX |

#### Breakdown Table

Show per-plan breakdown:

```
| Plan Name    | Vested Units | Strike Cost | Sale Value | Profit    |
|--------------|--------------|-------------|------------|-----------|
| 2024 Grant   | 500          | $5,000.00   | $18,235.00 | $13,235.00|
| 2025 Grant   | 100          | $1,200.00   | $3,647.00  | $2,447.00 |
|--------------|--------------|-------------|------------|-----------|
| **TOTAL**    | **600**      | **$6,200**  | **$21,882**| **$15,682**|
```

#### Currency Conversion

- Fetch USD to SGD rate from: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`
- Cache the rate for the session (avoid repeated calls)
- Show "Exchange rate: 1 USD = X.XX SGD" below the SGD value
- Fallback: If API fails, hide the SGD conversion and show only USD values

#### Edge Cases
- No plans exist: Show message "Add some stock option plans first to use the calculator"
- No vested units at selected date: Show "No units will be vested by this date"
- Zero or negative expected price: Disable calculation, show validation error

---

## PWA Configuration

### Requirements
- Full PWA support for iOS installation
- Offline capability (app shell + cached data)
- Add to Home Screen support

### Manifest (`manifest.json`)

```json
{
  "name": "Stocky - Stock Options Tracker",
  "short_name": "Stocky",
  "description": "Personal stock options vesting tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#228be6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### Required Meta Tags

```html
<!-- PWA Meta Tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Stocky">
<link rel="apple-touch-icon" href="/icon-192.png">

<!-- Prevent iOS zoom on input focus (font-size < 16px fix) -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

### Service Worker
- Use Vite PWA plugin with `registerType: 'autoUpdate'`
- Cache app shell and static assets
- localStorage handles data persistence (no need to cache API responses except currency)

---

## UI/UX Guidelines

### Mantine Configuration

```typescript
// theme.ts
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  components: {
    // Ensure inputs have 16px font to prevent iOS zoom
    TextInput: {
      styles: { input: { fontSize: '16px' } }
    },
    NumberInput: {
      styles: { input: { fontSize: '16px' } }
    },
    DateInput: {
      styles: { input: { fontSize: '16px' } }
    }
  }
});
```

### Navigation
- Use Mantine `AppShell` with bottom navigation for mobile
- Two nav items: "Home" (icon: home) and "Calculator" (icon: calculator)
- Highlight active route

### Responsive Design
- Mobile-first approach
- Cards stack vertically on mobile
- Table horizontally scrollable on small screens

### Number Formatting
- USD: `$X,XXX.XX` (Intl.NumberFormat with USD)
- SGD: `S$X,XXX.XX` (Intl.NumberFormat with SGD)
- Units: `X,XXX` (comma-separated integers)
- Percentages: `XX%`

### Delete Confirmation
- Use Mantine Modal for delete confirmation
- Message: "Are you sure you want to delete '{plan name}'? This action cannot be undone."
- Buttons: "Cancel" (secondary), "Delete" (red/danger)

---

## File Structure

```
src/
├── main.tsx                  # App entry point
├── App.tsx                   # Root component with providers
├── theme.ts                  # Mantine theme configuration
├── vite-env.d.ts
├── components/
│   ├── Layout.tsx            # AppShell with navigation
│   ├── PlanCard.tsx          # Individual plan card
│   ├── VestingTable.tsx      # Vesting projection table
│   ├── PlanForm.tsx          # Add/Edit plan form
│   ├── CalculatorResults.tsx # Calculator results display
│   └── StockPriceInput.tsx   # Stock price input with label
├── pages/
│   ├── HomePage.tsx          # Main dashboard
│   ├── CalculatorPage.tsx    # Gain calculator
│   ├── AddPlanPage.tsx       # New plan form
│   └── EditPlanPage.tsx      # Edit plan form
├── store/
│   └── useStore.ts           # Zustand store with persistence
├── utils/
│   ├── vesting.ts            # Vesting calculation functions
│   ├── formatting.ts         # Number/date formatting utilities
│   └── currency.ts           # Currency conversion API helper
├── hooks/
│   └── useCurrencyRate.ts    # Hook for fetching USD/SGD rate
├── routes/
│   └── index.tsx             # TanStack Router configuration
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## localStorage Schema

```typescript
// Key: 'stocky-storage'
interface PersistedState {
  state: {
    plans: StockPlan[];
    currentStockPrice: number;
  };
  version: number;
}
```

Use Zustand's `persist` middleware with localStorage.

---

## Error Handling

### Form Validation
- Show inline error messages below invalid fields
- Use Mantine's built-in form validation with `useForm` hook
- Validate on blur and on submit

### API Errors (Currency)
- Silently fail and hide SGD conversion
- Log error to console for debugging
- Do not show error toast to user (non-critical feature)

### Empty States
- Home page with no plans: Friendly message + prominent "Add Plan" button
- Calculator with no plans: Message directing user to add plans first

---

## Implementation Notes

### Date Handling
- Store dates as ISO strings in localStorage
- Use native Date or `dayjs` for calculations
- Be careful with timezone handling - use start of day for comparisons

### Performance
- Memoize vesting calculations when inputs haven't changed
- Debounce stock price input updates (300ms)
- Currency rate fetched once per session, cached in memory

### Accessibility
- All form inputs must have labels
- Color is not the only indicator of state
- Keyboard navigation support
- Sufficient color contrast (Mantine defaults are compliant)

---

## Future Considerations (Out of Scope)

These features are explicitly NOT included in this version:
- Multiple stock tickers with different prices
- Data export/import
- Stock price API integration
- Historical tracking/charts
- Multiple tax jurisdictions
- RSU support (different vesting rules)
- Notifications/reminders

---

## Summary

| Feature | Included |
|---------|----------|
| Add/Edit/Delete stock option plans | Yes |
| 1-year cliff + annual vesting (25%/year) | Yes |
| Manual stock price entry | Yes |
| Vesting projection table (3 years) | Yes |
| Plan cards with full details | Yes |
| Gain calculator with tax calculation | Yes |
| SGD conversion (via free API) | Yes |
| PWA with iOS support | Yes |
| Offline capability | Yes |
| Data persistence (localStorage) | Yes |
| Authentication | No (not needed) |
| Backend/Database | No (not needed) |
