# School Database Design

## Table Explanations
- **`students`**: Stores individual student profiles, including a unique auto-incrementing ID, full name, and a unique email address.
- **`courses`**: Stores available school courses, including a unique identifier, course title, and unique course code.
- **`enrolments`**: A join table that maps students to courses and tracks the performance metric (`grade`) for that specific pairing.

## Relationships & Join Table
- **Students to Courses (Many-to-Many)**: A single student can enrol in multiple courses, and a single course can have many students. Relational databases cannot handle direct many-to-many links, so a **join table (`enrolments`)** is required.
- The `enrolments` table connects the two entities by breaking the relationship down into two one-to-many relationships (`students` to `enrolments` and `courses` to `enrolments`). It utilizes a **composite primary key** `(student_id, course_id)` which inherently enforces the business rule that a student cannot enrol in the exact same course more than once.

## Recommended Index
- **Index on `enrolments(course_id)`**: While SQLite automatically indexes primary key combinations starting with `student_id`, looking up all students enrolled in a specific course (such as in Query 2 and Query 3) requires scanning the join table. Adding an index on `course_id` optimizes these reverse lookups and prevents full table scans as the dataset grows.

## SQL vs. NoSQL
For a school management system tracking students, courses, grades, and enrolments, **SQL (Relational Database)** is the ideal choice. Relational databases excel at maintaining strict data integrity, referential constraints, and ACID compliance, which are vital when recording academic records and grades. Furthermore, SQL handles complex multi-table queries (`JOIN` operations and aggregations like `GROUP BY`) natively and efficiently, whereas a NoSQL document database would require complex application-side joins or data duplication for relational data structures.