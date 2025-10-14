# BrokerX Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token. Include it in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## User Routes (`/api/users`)

### 1. Sign Up
**POST** `/api/users/signup`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "country": "United States",
  "currency": "USD",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "country": "United States",
    "balance": 0,
    "walletId": "W1234567890USD",
    "accountStatus": "Pending"
  }
}
```

### 2. Login
**POST** `/api/users/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "balance": 0,
    "profit": 0,
    "totalDeposit": 0,
    "totalWithdrawal": 0,
    "walletId": "W1234567890USD",
    "accountStatus": "Pending",
    "isProfileComplete": false
  }
}
```

---

## Profile Routes (`/api/profile`)
*All routes require authentication*

### 1. Get Profile
**GET** `/api/profile`

**Response:** Returns complete user profile

### 2. Update Profile
**PUT** `/api/profile`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-01",
  "address": "123 Main St",
  "city": "New York",
  "zipCode": "10001",
  "phoneNumber": "+1234567890"
}
```

### 3. Upload Profile Image
**POST** `/api/profile/upload-profile-image`

**Body:** FormData with `profileImage` field

### 4. Upload ID Documents
**POST** `/api/profile/upload-id`

**Body:** FormData with `idFront` and `idBack` fields

### 5. Change Password
**PUT** `/api/profile/change-password`

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### 6. Toggle 2FA
**PUT** `/api/profile/toggle-2fa`

**Response:**
```json
{
  "message": "Two-factor authentication enabled",
  "twoFactorEnabled": true
}
```

---

## Transaction Routes (`/api/transactions`)
*All routes require authentication*

### 1. Get Transactions
**GET** `/api/transactions?type=Deposit&status=Completed&page=1&limit=10`

**Query Parameters:**
- `type`: Deposit, Withdrawal, Trade, Transfer, or All
- `method`: Credit/Debit Card, Bank Transfer, USDT, or All
- `status`: Pending, Completed, Failed, or All
- `startDate`: ISO date string
- `endDate`: ISO date string
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### 2. Get Single Transaction
**GET** `/api/transactions/:id`

### 3. Create Deposit
**POST** `/api/transactions/deposit`

**Body:**
```json
{
  "amount": 1000,
  "method": "Bank Transfer",
  "currency": "USD"
}
```

### 4. Create Withdrawal
**POST** `/api/transactions/withdrawal`

**Body:**
```json
{
  "amount": 500,
  "method": "Bank Transfer",
  "currency": "USD"
}
```

### 5. Get Dashboard Stats
**GET** `/api/transactions/dashboard/stats`

**Response:**
```json
{
  "balance": 5000,
  "profit": 1250,
  "totalDeposit": 5000,
  "totalWithdrawal": 0,
  "transactions": [
    {
      "date": "2025-10-14",
      "id": "TXN123456",
      "type": "Deposit",
      "name": "Deposit via Bank Transfer",
      "value": "USD 1000",
      "status": "Completed"
    }
  ],
  "accountStatus": "Verified"
}
```

---

## Wallet Routes (`/api/wallet`)
*All routes require authentication*

### 1. Get Wallet Info
**GET** `/api/wallet`

**Response:**
```json
{
  "walletId": "W1234567890USD",
  "balance": 5000,
  "currency": "USD",
  "tradingAccount": {
    "accountId": "#519939299",
    "balance": 0,
    "freeMargin": 0,
    "leverage": "1:Unlimited",
    "isActivated": false
  }
}
```

### 2. Transfer Funds
**POST** `/api/wallet/transfer`

**Body:**
```json
{
  "amount": 1000,
  "from": "wallet",
  "to": "trading"
}
```

---

## Admin Routes (`/api/admin`)
*All routes require authentication and admin role*

### 1. Get All Users
**GET** `/api/admin/users?search=john&status=Pending&page=1&limit=20`

### 2. Get User Details
**GET** `/api/admin/users/:id`

### 3. Verify User
**PUT** `/api/admin/users/:id/verify`

### 4. Reject User
**PUT** `/api/admin/users/:id/reject`

**Body:**
```json
{
  "reason": "Invalid documents"
}
```

### 5. Add Funds to User
**POST** `/api/admin/users/:id/add-funds`

**Body:**
```json
{
  "amount": 1000,
  "description": "Bonus credit"
}
```

### 6. Send Email to User
**POST** `/api/admin/users/:id/send-email`

**Body:**
```json
{
  "subject": "Account Verification",
  "message": "Your account has been verified"
}
```

### 7. Delete User
**DELETE** `/api/admin/users/:id`

### 8. Update Transaction Status
**PUT** `/api/admin/transactions/:id/update-status`

**Body:**
```json
{
  "status": "Completed"
}
```

### 9. Get Admin Stats
**GET** `/api/admin/stats`

**Response:**
```json
{
  "users": {
    "total": 100,
    "verified": 75,
    "pending": 25
  },
  "transactions": {
    "total": 500,
    "pending": 10
  },
  "financials": {
    "totalDeposits": 50000,
    "totalWithdrawals": 10000
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "message": "Error description"
}
```

**401 Unauthorized**
```json
{
  "message": "No token provided, authorization denied"
}
```

**403 Forbidden**
```json
{
  "message": "Access denied. Admin only."
}
```

**404 Not Found**
```json
{
  "message": "Resource not found"
}
```

**500 Server Error**
```json
{
  "message": "Server error"
}
```

---

## Notes

1. All timestamps are in ISO 8601 format
2. File uploads accept: JPEG, JPG, PNG, PDF (max 5MB)
3. JWT tokens expire after 7 days
4. Passwords are hashed using bcrypt
5. All monetary amounts are in the user's selected currency (default: USD)
