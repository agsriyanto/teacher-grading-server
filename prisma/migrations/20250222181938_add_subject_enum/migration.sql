/*
  Warnings:

  - You are about to alter the column `grade` on the `grades` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Changed the type of `subject` on the `assignments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('ENGLISH_WRITING', 'MATH_HOMEWORK');

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- AlterTable
ALTER TABLE "grades" ALTER COLUMN "grade" SET DATA TYPE INTEGER;
