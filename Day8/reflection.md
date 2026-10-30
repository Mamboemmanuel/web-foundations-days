# Day 8 Reflection

The most difficult concept in the course was understanding how to design for concurrency while keeping data correct. It was easy to think that checking whether a seat was available and then updating it would be enough. I learned that two requests can perform that check at almost the same time. I overcame this by revisiting the lessons on database transactions, row-level locks, conditional updates, and unique constraints, then applying them to the seat-hold workflow.

Based on the feedback on my capstone, I would improve the explanation of how the system behaves under heavy load. I would make the assumptions behind traffic estimates clearer, add more realistic load-test results, and show how the API responds when the database or payment provider becomes slow. I would also test the seat-hold process with many simultaneous users to demonstrate that the design prevents double-booking.

Next, I want to learn more about cloud deployment, load testing, database performance tuning, and monitoring distributed systems. I would like to deploy a small version of TicketHub, simulate a high-demand ticket sale, measure its performance, and use the results to improve the architecture.
