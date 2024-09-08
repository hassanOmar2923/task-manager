import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/database';

const uploadDir = path.join(process.cwd(), 'tmp'); // Ensure tmp directory exists

const form = formidable({
  uploadDir: uploadDir,
  keepExtensions: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

function generateSerialNumber() {
  const lastRegistration = db.prepare('SELECT serialNumber FROM registration6 ORDER BY serialNumber DESC LIMIT 1').get();
  let newSerialNumber = "00000001"; // Default for first entry

  if (lastRegistration && lastRegistration.serialNumber) {
    const lastSerial = parseInt(lastRegistration.serialNumber, 10);
    newSerialNumber = String(lastSerial + 1).padStart(8, '0');
  }

  return newSerialNumber;
}

function clearTemporaryFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const registrations = db.prepare('SELECT * FROM registration6').all();
        // console.log(registrations)
        res.status(200).json(registrations);
      } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: 'Error fetching registrations' });
      }
      break;

    case 'POST':
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ error: 'Error uploading file' });
        }

        try {
          const {
            name,
            gender,
            nationality,
            marital,
            countryOfBirth,
            PlaceOfBirth,
            birthdate,
            status,
            relationship
          } = fields;

          const formattedBirthdate = new Date(birthdate[0]).toISOString().split('T')[0]; 
          const regDate = new Date().toISOString().split('T')[0]; 

          const fingerPrintFile = files.fingerPrint[0].filepath;
          const fingerPrintBuffer = fs.readFileSync(fingerPrintFile);
          
          const imageFile = files.image[0].filepath;
          const imageBuffer = fs.readFileSync(imageFile);

          const newRegistration = {
            // id: uuidv4(),
            serialNumber: generateSerialNumber(),
            name: name[0],
            gender: gender[0],
            nationality: nationality[0],
            marital: marital[0],
            countryOfBirth: countryOfBirth[0],
            PlaceOfBirth: PlaceOfBirth[0],
            birthdate: formattedBirthdate,
            status: status[0],
            fingerPrint: fingerPrintBuffer,
            image: imageBuffer,
            regesterDate:regDate,
            relationship:relationship[0]
          };
          // console.log("hassan data", newRegistration);

          const stmt = db.prepare(`
            INSERT INTO registration6 ( serialNumber, name, gender, nationality, marital, countryOfBirth, PlaceOfBirth, birthdate, status, fingerPrint, image,regesterDate,relationship)
            VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
          `);

          stmt.run(
            // newRegistration.id,
            newRegistration.serialNumber,
            newRegistration.name,
            newRegistration.gender,
            newRegistration.nationality,
            newRegistration.marital,
            newRegistration.countryOfBirth,
            newRegistration.PlaceOfBirth,
            newRegistration.birthdate,
            newRegistration.status,
            newRegistration.fingerPrint,
            newRegistration.image,
            newRegistration.regesterDate,
            newRegistration.relationship
          );

          // Clean up temporary files
          clearTemporaryFiles(uploadDir);

          res.status(201).json({ status: 201, message: "Successfully created" });
        } catch (error) {
          console.error("Database error:", error);
          res.status(500).json({ error: 'Error creating registration' });
        }
      });
      break;




      case 'DELETE':
      try {
        const { id } = req.query;
        console.log(id)
        const stmt = db.prepare('DELETE FROM registration6 WHERE id = ?');
        stmt.run(id);

        res.status(200).json({ status: 200, message: "Successfully deleted" });
      } catch (error) {
        console.error("DELETE Error:", error);
        res.status(500).json({ error: 'Error deleting registration' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
