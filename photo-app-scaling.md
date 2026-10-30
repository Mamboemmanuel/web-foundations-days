# SnapShare System Scaling Plan

## 1. Assumptions & Daily Active Users (DAU)
* **Registered Users:** 10,000,000 users.
* **Active User Ratio:** 10% of total registered users are active daily.
* **Daily Active Users (DAU):** 
  $$\text{DAU} = 10,000,000 \times 0.10 = 1,000,000 \text{ active users/day}$$

---

## 2. Capacity Calculations

### A. Uploads Per Second
* **Total Daily Uploads:** $1,000,000 \text{ DAU} \times 1 \text{ photo/day} = 1,000,000 \text{ uploads/day}$
* **Average Uploads/Sec:** 
  $$\frac{1,000,000 \text{ uploads}}{86,400 \text{ seconds/day}} \approx 11.57 \text{ uploads/sec}$$
* **Peak Uploads/Sec (5× multiplier):** 
  $$11.57 \times 5 \approx 57.87 \text{ uploads/sec}$$

### B. Feed Views Per Second
* **Total Daily Feed Views:** $1,000,000 \text{ DAU} \times 50 \text{ feed pages/day} = 50,000,000 \text{ views/day}$
* **Average Feed Views/Sec:** 
  $$\frac{50,000,000 \text{ views}}{86,400 \text{ seconds/day}} \approx 578.7 \text{ views/sec}$$
* **Peak Feed Views/Sec (5× multiplier):** 
  $$578.7 \times 5 \approx 2,893.5 \text{ views/sec}$$

### C. Storage Per Year
* **Storage per Photo (Original + Thumbnail):** $2.0 \text{ MB} + 0.05 \text{ MB} = 2.05 \text{ MB}$
* **Daily Storage Added:** $1,000,000 \text{ photos/day} \times 2.05 \text{ MB} = 2,050,000 \text{ MB/day} = 2.05 \text{ TB/day}$
* **Annual Storage Required:** 
  $$2.05 \text{ TB/day} \times 365 \text{ days} = 748.25 \text{ TB/year}$$

---

## 3. Workload Profile & Architectural Impact
SnapShare is a **read-heavy system**.

* **Read-to-Write Ratio:** $50 \text{ feed views} : 1 \text{ photo upload} = 50:1$.
* **Design Implications:** Because read requests outnumber write requests by a factor of 50, the architecture must focus heavily on read optimization through aggressive caching strategies (CDN for static photo assets, in-memory caches for database feeds) and database read replication to prevent database bottlenecks.

---

## 4. File Storage Strategy
**Photos must not be stored directly inside the relational database (e.g., as BLOBs).**

Databases are optimized for structured data and fast query indexing; storing large binary objects bloats database size, degrades backup/restore performance, consumes expensive database RAM during reads, and severely limits horizontal scaling. Instead, raw photos and thumbnails should be stored in **cloud object storage** (such as AWS S3 or Google Cloud Storage), while the relational database stores only the metadata and the string URL pointing to the file location in object storage.

---

## 5. Architecture Diagram

[ Client App / Browser ]
|
v
[ Content Delivery Network (CDN) ] <--- Caches Photo Files & Thumbnails
|
+---> (Static Asset Fetch) ---> [ Object Storage (AWS S3) ]
|
v (Dynamic Requests: Uploads / Feed Metadata)
[ Load Balancer ]
|
+-----------------------+
|                       |
v                       v
[ App Server 1 ]       [ App Server 2 ]
|                       |
+-----------+-----------+
|
+-------------+-------------+---------------------+
|                           |                     |
v                           v                     v
[ In-Memory Cache ]      [ Primary Database ]   [ Message Queue ]
(Redis / Memcached)      (Writes / Metadata)       (RabbitMQ / SQS)
|                           |                     |
v                           v                     v
[ Read Replicas ] <--------------+              [ Worker Service ]
(Serves Read Requests)                                 |
v
[ Object Storage (AWS S3) ]


---

## 6. System Component Breakdown

1. **CDN (Content Delivery Network):** Geographically distributes and caches photos and thumbnails near end users to minimize latency and offload bandwidth from origin storage.
2. **Load Balancer:** Evenly distributes incoming HTTPS web traffic across multiple application servers to maximize throughput and ensure high availability.
3. **App Servers:** Executes core application logic, authenticates requests, processes feed queries, and handles photo metadata transactions.
4. **Cache (In-Memory Data Store):** Stores frequently queried feed data, user session state, and metadata in RAM to deliver low-latency responses and reduce database query load.
5. **Primary Database:** Handles all write operations and enforces transactional data integrity for user profiles, photo metadata, and social graphs.
6. **Database Read Replicas:** Asynchronously replicates data from the primary database to serve high volumes of read traffic without impacting write performance.
7. **Object Storage:** Store raw image files and processed thumbnails cost-effectively at scale with durability.
8. **Message Queue:** Buffers asynchronous task events (such as image processing requests) to decouple time-consuming tasks from the client HTTP request cycle.
9. **Worker Service:** Consumes jobs asynchronously from the message queue to download raw uploaded photos, generate optimized 50 KB thumbnails, and upload them back to object storage.

---

## 7. Step-by-Step Upload Flow

1. **Client Request:** The user selects a photo on the client app and submits an HTTP `POST` request containing the image payload and user authorization headers to the system endpoint.
2. **Ingestion & Metadata Save:** The Load Balancer routes the payload to an active App Server, which uploads the raw 2 MB photo file directly into Object Storage, receives a unique storage key/URL back, and writes a metadata record (user ID, timestamp, photo storage URL, pending thumbnail flag) to the Primary Database.
3. **Async Event Queuing:** The App Server publishes an `IMAGE_UPLOADED` event containing the raw photo URL and photo ID to the Message Queue, and immediately returns a `201 Created` response back to the client.
4. **Worker Processing:** A background Worker process dequeues the event, downloads the raw 2 MB photo from Object Storage, processes it in memory to generate a 50 KB thumbnail, and uploads the thumbnail file to Object Storage.
5. **Finalize Metadata:** The Worker updates the photo record in the Primary Database with the new thumbnail URL and marks the processing state as complete, making the thumbnail available to feed readers via the CDN.

---

## 8. Trade-Off Analyses

### Trade-off 1: Asynchronous Thumbnail Processing vs. Synchronous Processing
* **Choice Made:** Asynchronous processing via a Message Queue and background Workers.
* **Trade-off:** Fast upload response times and higher availability for the end user at the expense of temporary eventual consistency (the thumbnail is not immediately visible in feeds for a brief period while the queue job completes).

### Trade-off 2: Database Read Replication vs. Strong Consistency
* **Choice Made:** Primary Database for writes with asynchronous Read Replicas for feed reads.
* **Trade-off:** High read throughput and scalability under heavy load at the expense of a slight replication lag, meaning newly posted photos might take a few seconds to reflect across all followers' feeds.
Step 9: Git Commands to Save & Push
Run the following terminal commands to save, commit, and push your work before Day 8:

Bash
# Navigate to repository root (if not already there)
cd web-foundations-days

# Stage the newly created document
git add day7/photo-app-scaling.md

# Commit with the required commit message
git commit -m "Day 7 assignment"

# Push changes to your remote repository
git push origin main