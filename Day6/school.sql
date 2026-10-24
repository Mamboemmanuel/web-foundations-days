
-- ==========================================
-- 1. CREATE TABLES
-- ==========================================

CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE
);

CREATE TABLE enrolments (
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  grade TEXT,
  PRIMARY KEY (student_id, course_id), -- Prevents duplicate enrolments for the same student & course
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ==========================================
-- 2. INSERT SAMPLE DATA
-- ==========================================

-- Insert students (at least 3, plus one with no enrolments to test LEFT JOIN)
INSERT INTO students (id, name, email) VALUES 
(1, 'Alice Smith', 'alice@example.com'),
(2, 'Bob Jones', 'bob@example.com'),
(3, 'Charlie Brown', 'charlie@example.com'),
(4, 'Diana Prince', 'diana@example.com');

-- Insert courses (at least 3)
INSERT INTO courses (id, title, code) VALUES 
(1, 'Database Systems', 'CS101'),
(2, 'Web Development', 'CS102'),
(3, 'Data Structures', 'CS103');

-- Insert enrolments (at least 5 mappings with grades)
INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'B+'),
(2, 3, 'A-'),
(3, 2, 'C');

-- ==========================================
-- 3. FIVE REQUIRED QUERIES
-- ==========================================

-- Query 1: All courses for one student (by name)
SELECT courses.title, courses.code, enrolments.grade
FROM courses
JOIN enrolments ON enrolments.course_id = courses.id
JOIN students ON students.id = enrolments.student_id
WHERE students.name = 'Alice Smith';

-- Query 2: All students on one course
SELECT students.name, students.email, enrolments.grade
FROM students
JOIN enrolments ON enrolments.student_id = students.id
JOIN courses ON courses.id = enrolments.course_id
WHERE courses.title = 'Database Systems';

-- Query 3: The number of students per course
SELECT courses.title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON enrolments.course_id = courses.id
GROUP BY courses.id, courses.title;

-- Query 4: Students who have no enrolments
SELECT students.name, students.email
FROM students
LEFT JOIN enrolments ON enrolments.student_id = students.id
WHERE enrolments.course_id IS NULL;

-- Query 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 1;