# Teacher Grading Server with Express

A simple RESTful API built using **Node.js ** with the **TypeScript**, and **Express**.

---

## **How to Use the App**

1. **Run the App Locally**  
   To run the app on your local machine:  
   - Clone this repository:  
     ```bash
     git clone https://github.com/agsriyanto/teacher-grading-server
     ```  
   - Create a .env file from .env-sample and update the environment variables accordingly:
     ```bash
     cp .env-sample .env
     ```  
     Edit the .env file with your specific configurations before running the app.
   - Install dependencies:  
     ```bash
     npm install
     ```  
   - Set up the database and migrate Prisma schema: 
     ```bash
     npx prisma migrate dev --name init
     ```  
   - Start the development server:  
     ```bash
     npm run dev
     ```  

---

## **Technology Stack**

- **Framework**: Node.js, Typescript & Express
- **Database**: Postgresql & Prisma ORM


---
