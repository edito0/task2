var mongoose = require('mongoose');
var Schema = mongoose.Schema;

contactSchema = new Schema( {
	
	name: String,
	email: String,
	Phone: String,
	InquiryType: String,
	message: String
}),
User = mongoose.model('Contact', contactSchema);

module.exports = User;