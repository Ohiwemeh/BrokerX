# Debug Real-Time Notifications 🔍

## I've added extensive logging to help debug the issue.

---

## Step-by-Step Testing:

### 1. Restart Backend
```bash
cd server
npm run dev
```

**Watch for:**
```
✅ MongoDB database connection established successfully
Server is running on port 5000
Socket.IO is running
```

---

### 2. Restart Frontend
```bash
cd client
npm run dev
```

---

### 3. Login as Admin

Open browser console (F12) and watch for these logs:

**Expected logs when admin logs in:**
```
✅ Socket connected: [socket-id]
👤 Current user: {id: "...", name: "...", role: "admin", ...}
✅ Admin joined admin room. User ID: [user-id]
```

**If you see:**
```
⚠️ User is not admin or not logged in. Role: undefined
```
**Problem:** User data not in localStorage or role is not 'admin'

**Fix:** Check localStorage in browser console:
```javascript
localStorage.getItem('user')
```

Should show:
```json
{"id":"...","name":"...","role":"admin",...}
```

---

### 4. Open Admin Panel

**Expected logs:**
```
✅ Setting up socket listener for new-user-signup
```

**If you see:**
```
❌ Socket not available in NotificationBell
```
**Problem:** SocketProvider not wrapping the app properly

---

### 5. Sign Up New User (Incognito Window)

Open incognito window, go to signup page, create new user.

---

### 6. Check Backend Console

**Expected logs:**
```
✅ Admin notifications created: 1
✅ Socket event emitted to admin-room: {userId: "...", name: "...", ...}
```

**If you see:**
```
❌ Failed to create admin notifications: [error]
```
**Problem:** No admin users in database or notification creation failed

**If you see:**
```
❌ Socket.IO not available
```
**Problem:** Socket.IO not initialized properly

---

### 7. Check Frontend Console (Admin Panel)

**Expected logs:**
```
🔔 New user signup notification received: {userId: "...", name: "...", ...}
✅ Sound played
🔄 Refreshing notifications...
✅ Browser notification shown
```

**If nothing appears:**
- Socket not connected
- Admin not in admin-room
- Event not being emitted
- Event listener not set up

---

## Common Issues & Fixes:

### Issue 1: User role is not 'admin'

**Check:**
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('user'));
console.log('Role:', user.role);
```

**Should be:** `"admin"`

**If not admin:**
1. Check database - user document should have `role: 'admin'`
2. Re-login to refresh localStorage

---

### Issue 2: No admin users in database

**Check backend console when user signs up:**
```
✅ Admin notifications created: 0
```

**Fix:** Create an admin user in database:
```javascript
// In MongoDB or via API
{
  name: "Admin",
  email: "admin@brokerx.com",
  role: "admin",
  // ... other fields
}
```

---

### Issue 3: Socket not connecting

**Check frontend console:**
```
Socket connection error: [error]
```

**Fix:**
1. Verify backend is running on port 5000
2. Check `client/.env` has: `VITE_API_URL=http://localhost:5000`
3. Restart both servers

---

### Issue 4: Admin not joining room

**Check frontend console:**
```
⚠️ User is not admin or not logged in. Role: undefined
```

**Fix:**
1. Ensure user is logged in
2. Check localStorage has user data
3. Verify user.role === 'admin'

---

### Issue 5: Event not received

**Backend shows:**
```
✅ Socket event emitted to admin-room
```

**But frontend shows nothing**

**Fix:**
1. Check admin joined admin-room (see logs)
2. Verify socket listener is set up (see logs)
3. Check socket is connected

---

## Manual Test Commands:

### Test 1: Check if admin exists
```javascript
// In backend terminal or MongoDB
db.users.find({ role: 'admin' })
```

Should return at least one admin user.

---

### Test 2: Check socket connection
```javascript
// In frontend console (admin panel)
console.log('Socket:', window.socket);
console.log('Connected:', window.socket?.connected);
```

---

### Test 3: Manually emit event (backend)
```javascript
// In server/index.js temporarily add:
io.to('admin-room').emit('test-event', { message: 'Test' });
```

Then in frontend console, listen:
```javascript
socket.on('test-event', (data) => console.log('Test received:', data));
```

---

## Expected Full Flow:

### Backend Console:
```
✅ Client connected: abc123
Admin 507f1f77bcf86cd799439011 joined admin room
✅ Admin notifications created: 1
✅ Socket event emitted to admin-room: {...}
```

### Frontend Console (Admin):
```
✅ Socket connected: abc123
👤 Current user: {id: "507f...", role: "admin"}
✅ Admin joined admin room. User ID: 507f...
✅ Setting up socket listener for new-user-signup
🔔 New user signup notification received: {...}
✅ Sound played
🔄 Refreshing notifications...
✅ Browser notification shown
```

---

## Quick Checklist:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Admin user exists in database
- [ ] Admin logged in
- [ ] Socket connected (check console)
- [ ] Admin joined admin-room (check console)
- [ ] Socket listener set up (check console)
- [ ] New user signs up
- [ ] Backend logs show notification created
- [ ] Backend logs show socket event emitted
- [ ] Frontend logs show event received
- [ ] Sound plays
- [ ] Notification appears

---

## Next Steps:

1. **Restart both servers**
2. **Login as admin**
3. **Check all console logs**
4. **Sign up new user**
5. **Watch for logs**
6. **Report which log is missing**

The logs will tell us exactly where the problem is! 🔍
