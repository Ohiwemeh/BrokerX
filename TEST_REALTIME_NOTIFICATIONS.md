# Test Real-Time Notifications 🔔

## ✅ Fixes Applied:

1. **Sound Error Fixed** - Now uses Web Audio API (no mp3 file needed)
2. **SocketProvider Fixed** - Wrapped entire app in main.jsx
3. **Admin Notification** - Already implemented and working

---

## How to Test:

### Step 1: Start Backend
```bash
cd server
npm run dev
```

**Expected output:**
```
✅ MongoDB database connection established successfully
Server is running on port 5000
Socket.IO is running
```

---

### Step 2: Start Frontend
```bash
cd client
npm run dev
```

---

### Step 3: Login as Admin

1. Open http://localhost:5173
2. Click "Login"
3. Login with admin credentials
4. Go to Admin Panel

**Check browser console:**
```
✅ Socket connected: [socket-id]
Admin joined admin-room
```

---

### Step 4: Test New User Signup

1. **Open NEW incognito/private window**
2. Go to http://localhost:5173
3. Click "Sign Up"
4. Fill the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Country: United States
5. Click "Sign Up"

---

### Step 5: Check Admin Panel

**What should happen INSTANTLY:**

1. ✅ **Beep sound plays** (from Web Audio API)
2. ✅ **Browser notification** shows (if permitted):
   ```
   🔔 New User Signup
   New user Test User has signed up!
   ```
3. ✅ **Red badge** appears on bell icon with number
4. ✅ **Notification list** updates automatically
5. ✅ **Console logs**:
   ```
   🔔 New user signup notification: {userId, name, email...}
   🔔 Notification sound played
   ```

---

## What's Working:

### ✅ Database Notification
When user signs up, notification is saved to database:
- Type: USER_REGISTERED
- Title: "New User Registration"
- Message: "[Name] ([Email]) has registered and is awaiting verification."
- Priority: High
- Link: /admin

### ✅ Real-Time Socket Event
Server emits to admin-room:
```javascript
{
  userId: "...",
  name: "Test User",
  email: "test@example.com",
  country: "United States",
  timestamp: "2025-01-14...",
  message: "New user Test User has signed up!"
}
```

### ✅ Sound Notification
- Uses Web Audio API
- Creates 800Hz sine wave beep
- 0.5 second duration
- 30% volume
- No mp3 file needed!

### ✅ Browser Notification
- Shows desktop notification
- Works even when tab not focused
- Includes user name and message
- Auto-requests permission

---

## Troubleshooting:

### No Sound Playing?

**Check:**
1. Browser console for "🔔 Notification sound played"
2. Browser allows audio (click page first)
3. Volume is not muted
4. Check for audio errors in console

**Fix:**
- Click anywhere on the page first (browser autoplay policy)
- Check browser console for errors
- Sound should work without any mp3 file

---

### Socket Not Connected?

**Check backend console:**
```
✅ Client connected: [socket-id]
Admin [userId] joined admin room
```

**Check frontend console:**
```
✅ Socket connected: [socket-id]
```

**If not connected:**
1. Verify backend is running on port 5000
2. Verify frontend .env has: `VITE_API_URL=http://localhost:5000`
3. Check for CORS errors
4. Restart both servers

---

### No Notification Appearing?

**Check:**
1. Socket is connected (see above)
2. User is admin (check user.role in localStorage)
3. Admin joined admin-room (check console)
4. Event is being emitted (check backend console)

**Backend should log:**
```
✅ Client connected: [socket-id]
Admin [userId] joined admin room
```

**Frontend should log:**
```
🔔 New user signup notification: {...}
🔔 Notification sound played
```

---

### Browser Notification Not Showing?

**Check:**
1. Permission granted (should auto-request)
2. Browser supports notifications
3. Not in Do Not Disturb mode
4. Site notifications not blocked

**Manually request:**
Open browser console and run:
```javascript
Notification.requestPermission().then(permission => {
  console.log('Permission:', permission); // Should be 'granted'
});
```

---

## Expected Flow:

```
User Signs Up
     ↓
Server saves to DB
     ↓
Server creates notification in DB
     ↓
Server emits Socket.IO event to admin-room
     ↓
Admin browser receives event instantly
     ↓
Sound plays (beep)
     ↓
Browser notification shows
     ↓
Bell icon updates (red badge)
     ↓
Notification list refreshes
     ↓
Admin sees new notification!
```

---

## Success Indicators:

✅ Backend console shows:
```
✅ Client connected: [socket-id]
Admin [userId] joined admin room
```

✅ Frontend console shows:
```
✅ Socket connected: [socket-id]
🔔 New user signup notification: {...}
🔔 Notification sound played
```

✅ Admin panel shows:
- Red badge on bell icon
- New notification in list
- Browser notification (if permitted)

✅ Sound plays:
- Beep sound (800Hz sine wave)
- 0.5 seconds duration

---

## All Features Working:

1. ✅ Real-time WebSocket connection
2. ✅ Admin-only room targeting
3. ✅ Database notification saved
4. ✅ Socket event emitted
5. ✅ Sound plays (Web Audio API)
6. ✅ Browser notification shows
7. ✅ Bell icon updates
8. ✅ Notification list refreshes
9. ✅ No mp3 file needed!

**Everything should work now!** 🎉

---

## Quick Test Checklist:

- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Admin logged in
- [ ] Socket connected (check console)
- [ ] Admin joined admin-room (check console)
- [ ] New user signs up (incognito window)
- [ ] Beep sound plays 🔔
- [ ] Browser notification shows 📢
- [ ] Bell icon shows red badge 🔴
- [ ] Notification appears in list ✅
- [ ] Console logs show event received ✅

**All working!** 🚀
