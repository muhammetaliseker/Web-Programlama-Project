import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  rentedAt: {
    type: Date,
    default: Date.now,
  },
  returnedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'returned'],
    default: 'active',
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('Rental', rentalSchema); 