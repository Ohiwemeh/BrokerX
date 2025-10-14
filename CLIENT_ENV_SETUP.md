# Client .env Setup

## Create `client/.env` file

Add this content to `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

This tells the Socket.IO client where to connect.

## That's it!

Now restart your frontend server:

```bash
cd client
npm run dev
```

The socket will automatically connect to your backend!
