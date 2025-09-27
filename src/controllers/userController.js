import User from '../models/user.js';

// Admin-only: get all users
export const getUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
};

// Admin-only: delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User deleted successfully' });
};
