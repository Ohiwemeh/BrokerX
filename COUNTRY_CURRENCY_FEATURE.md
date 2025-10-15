# Country Selection with Automatic Currency Assignment

## Overview
Implemented a comprehensive country selector in the signup page that automatically assigns the appropriate currency based on the selected country. The user's currency is then used throughout their dashboard.

## Changes Made

### 1. Frontend Changes

#### Created New Files:
- **`client/src/data/countries.js`**
  - Contains a comprehensive list of 195+ countries with their respective currency codes
  - Each country is mapped to its official currency (e.g., United States → USD, United Kingdom → GBP, Nigeria → NGN)

- **`client/src/utils/currency.js`**
  - Currency utility functions for formatting amounts with proper symbols
  - `getCurrencySymbol()`: Returns the currency symbol for a given currency code
  - `formatCurrency()`: Formats amounts with the appropriate currency symbol and locale formatting

#### Updated Files:
- **`client/src/pages/Auth/Signup.jsx`**
  - Imported the `countriesWithCurrency` data
  - Added `currency` field to form state
  - Updated `handleCountryChange()` to automatically set the currency when a country is selected
  - Replaced hardcoded country list with dynamic list from `countries.js`
  - Country dropdown now shows: "Country Name (CURRENCY_CODE)"

- **`client/src/pages/Dashboard.jsx`**
  - Imported `formatCurrency` utility
  - Added `userCurrency` variable to get currency from user profile
  - Updated all currency displays (Deposit, Profit, Total Withdrawal) to use `formatCurrency()` with user's currency

### 2. Backend Changes

#### Updated Files:
- **`server/routes/user.routes.js`**
  - Updated signup response to include `currency` field in user object
  - Updated login response to include `currency` field in user object
  - Backend already had currency support in the User model and was accepting it in signup

## How It Works

### Signup Flow:
1. User selects their country from a dropdown containing all 195+ countries
2. The system automatically finds the corresponding currency for that country
3. Both `country` and `currency` are saved to the user's profile
4. User is redirected to dashboard with their currency preference set

### Dashboard Display:
1. Dashboard fetches user profile which includes the `currency` field
2. All monetary values (balance, deposit, profit, withdrawal) are formatted using the user's currency
3. Proper currency symbols are displayed (e.g., $, €, £, ₹, ¥, etc.)

## Supported Currencies
The system supports 40+ major currency symbols including:
- USD ($), EUR (€), GBP (£), JPY (¥), CNY (¥)
- INR (₹), AUD (A$), CAD (C$), CHF (CHF), NZD (NZ$)
- ZAR (R), BRL (R$), RUB (₽), KRW (₩), MXN ($)
- SGD (S$), HKD (HK$), SEK (kr), NOK (kr), DKK (kr)
- PLN (zł), TRY (₺), AED (د.إ), SAR (﷼), THB (฿)
- MYR (RM), IDR (Rp), PHP (₱), VND (₫), EGP (E£)
- NGN (₦), PKR (₨), BDT (৳)
- And many more...

For currencies without a specific symbol, the currency code itself is displayed.

## Testing
To test the feature:
1. Go to the signup page
2. Select any country from the dropdown
3. Notice the currency code displayed next to the country name
4. Complete signup
5. Login and view the dashboard
6. Verify that all monetary values display with the correct currency symbol

## Future Enhancements
- Currency conversion for multi-currency transactions
- Allow users to change their preferred display currency
- Real-time exchange rates integration
- Support for cryptocurrency display preferences
