// server/routes/notification.routes.js

const router = require('express').Router();
const Notification = require('../models/notification.model');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply authentication to all routes
router.use(verifyToken);

// @route   GET /api/notifications
// @desc    Get user's notifications
router.get('/', async (req, res) => {
  try {
    const { status = 'all', limit = 20, page = 1 } = req.query;

    const query = { recipient: req.user._id };
    
    if (status === 'unread') {
      query.isRead = false;
    } else if (status === 'read') {
      query.isRead = true;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    res.json({
      notifications,
      total,
      unreadCount,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get count of unread notifications
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    res.json({ count });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
router.put('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/clear-all
// @desc    Clear all read notifications
router.delete('/clear-all', async (req, res) => {
  try {
    await Notification.deleteMany({
      recipient: req.user._id,
      isRead: true
    });

    res.json({ message: 'All read notifications cleared' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
