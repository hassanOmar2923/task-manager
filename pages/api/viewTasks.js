import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { userId:id,from, to,phone } = req.query; // Expecting user ID from query params
  switch (method) {
    // GET - Retrieve all users or a specific user by ID
    case 'GET':
  try {
    // if (id) {
      // Fetch a single task by ID
      const task = await prisma.Task.findMany({
        where: {
          assignedTo: {
            phone: phone, // Replace this with the actual phone number or a variable
          },
        },
      });
      const user = await prisma.user.findUnique({
        where: { phone: phone },
      });
      console.log(phone)
      
      if (user) {
        res.status(200).json({user,task});
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    // } 
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving tasks' });
  }
  break;


    // POST - Create a new user
    case 'POST':
      // console.log(req.body)
      // req.body.submittedAt=new Date()
      // req.body.requestedAt=new Date()
      // const { name, phone } = req.body;
      try {
        const newUser = await prisma.Task.create({
          data: req.body,
        });
        res.status(200).json(newUser);
      } catch (error) {
        console.log( error.message )
        res.status(500).json({ error:  error.message });
      }
      break;

    // PUT - Update an existing user
    case 'PUT':
      try {
        if (!id) {
          return res.status(400).json({ error: 'User ID is required' });
        }
        // const { name, phone } = req.body;
        const updatedUser = await prisma.Task.update({
          where: { id: id },
          data: {
            submittedAt:req.body.submittedAt,
            status:req.body.status
          },
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
        const deletedUser = await prisma.Task.delete({
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
