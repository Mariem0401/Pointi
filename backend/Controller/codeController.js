const User = require('../Model/User');
const CodeLog = require('../Model/CodeLog');
const { sendCodeEmail } = require('../utils/emailSender');
const crypto = require('crypto');

module.exports = {
  sendDailyCodes: async () => {
    const users = await User.find({ role: 'employe' });
    const results = [];

    for (const user of users) {
      try {
        const pinCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        
        await sendCodeEmail(user, pinCode);
        
        user.pinCode = pinCode;
        await user.save();
        
        await CodeLog.create({
          userId: user._id,
          pinCode,
          status: 'sent'
        });
        
        results.push({ userId: user._id, status: 'success' });
      } catch (error) {
        results.push({ 
          userId: user._id, 
          status: 'failed',
          error: error.message
        });
      }
    }

    return results;
  }
};