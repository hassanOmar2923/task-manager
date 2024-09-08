import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Expecting user ID from query params
console.log(id)
  switch (method) {
    // GET - Retrieve all users or a specific user by ID
    case 'GET':
      try {
        if (id) {
          const user = await prisma.user.findUnique({
            where: { id: Number(id) },
          });
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(404).json({ error: 'User not found' });
          }
        } else {
          const users = await prisma.user.findMany();
          res.status(200).json(users);
        }
      } catch (error) {
        res.status(500).json({ error: 'Error retrieving users' });
      }
      break;

    // POST - Create a new user
    case 'POST':
      const { name, phone } = req.body;
      try {
        const newUser = await prisma.user.create({
          data: { name, phone },
        });
        res.status(200).json(newUser);
      } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
      }
      break;

    // PUT - Update an existing user
    case 'PUT':
      try {
        if (!id) {
          return res.status(400).json({ error: 'User ID is required' });
        }
        const { name, phone } = req.body;
        const updatedUser = await prisma.user.update({
          where: { id: id },
          data: { name, phone },
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ error: error.message});
      }
      break;

    // DELETE - Delete an existing user
    case 'DELETE':
      try {
        if (!id) {
          return res.status(400).json({ error: 'User ID is required' });
        }
        const deletedUser = await prisma.user.delete({
          where: { id: id },
        });
        res.status(200).json(deletedUser);
      } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
      }
      break;

    // Handle unsupported methods
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
