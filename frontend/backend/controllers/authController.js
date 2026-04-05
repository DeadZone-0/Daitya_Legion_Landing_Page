import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    res.json({ token, email });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
