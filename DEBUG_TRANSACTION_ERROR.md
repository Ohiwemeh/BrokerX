# Debug Transaction Rejection Error 🔍

## Error:
```
500 Internal Server Error
Failed to update transaction
```

---

## Steps to Debug:

### 1. Restart Backend Server
```bash
cd server
npm run dev
```

### 2. Try to Reject Transaction Again

Go to `/admin/transactions` and click ❌ Reject on a transaction.

---

### 3. Check Backend Console

**Look for these logs:**

```
📝 Updating transaction: [id] to status: Failed
📦 Transaction found: [transactionId] Type: [Deposit/Withdrawal]
👤 User found: [name] [email]
```

**If you see an error after these logs, that's where the problem is!**

---

## Possible Issues:

### Issue 1: User Not Populated
**Error:** `User not found for transaction`

**Fix:** Transaction doesn't have userId populated
```javascript
// Check in MongoDB
db.transactions.findOne({ _id: "[transaction-id]" })
```

---

### Issue 2: NotificationService Error
**Error:** After "👤 User found" log

**Cause:** `notifyTransactionRejected` method might have an issue

**Check:** Does the notification get created?

---

### Issue 3: Socket.IO Not Available
**Error:** `Cannot read property 'to' of undefined`

**Cause:** Socket.IO not initialized

**Fix:** Check if `io` is set in app:
```javascript
const io = req.app.get('io');
console.log('Socket.IO available:', !!io);
```

---

## Quick Fix:

If the error is in the notification/socket part, wrap it in try-catch:

```javascript
// If rejecting a transaction
if (status === 'Failed' && oldStatus !== 'Failed') {
  try {
    // Notify user of rejection
    await NotificationService.notifyTransactionRejected(
      user, 
      transaction.type, 
      transaction.amount, 
      transaction.transactionId
    );
  } catch (notifError) {
    console.error('Failed to create notification:', notifError);
    // Continue anyway
  }

  try {
    // Emit real-time notification to user
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${user._id}`).emit('transaction-rejected', {
        transactionId: transaction.transactionId,
        type: transaction.type,
        amount: transaction.amount,
        message: `Your ${transaction.type.toLowerCase()} request has been rejected.`
      });
    }
  } catch (socketError) {
    console.error('Failed to emit socket event:', socketError);
    // Continue anyway
  }
}
```

---

## Test Again:

1. Restart backend
2. Try to reject transaction
3. Check backend console for logs
4. Check frontend console for error details
5. Report which log appears last before error

---

## Expected Flow:

```
📝 Updating transaction: 67... to status: Failed
📦 Transaction found: TXN123... Type: Deposit
👤 User found: John Doe john@example.com
✅ Transaction status updated successfully
```

If you see all these logs, the transaction should update successfully!
