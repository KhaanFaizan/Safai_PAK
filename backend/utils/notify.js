const Notification = require('../models/Notification');

/**
 * Create a new notification
 * @param {string} recipientId - User ID of the recipient
 * @param {string} type - 'booking_create', 'booking_accept', 'booking_cancel', 'booking_complete', 'system', 'verification'
 * @param {string} title - Bold header text
 * @param {string} message - Detailed message body
 * @param {string} relatedId - Optional: Booking ID, etc.
 * @param {string} senderId - Optional: User ID of the sender
 */
const notify = async (recipientId, type, title, message, relatedId = null, senderId = null) => {
    try {
        await Notification.create({
            recipient: recipientId,
            type,
            title,
            message,
            relatedId,
            sender: senderId
        });
    } catch (error) {
        console.error('Notification Error:', error);
        // Don't crash the main flow if notification fails
    }
};

module.exports = notify;
