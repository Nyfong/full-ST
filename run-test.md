This project simulates a professional Quality Engineering lifecycle. You will move from discovering
unknown risks through investigative testing to verifying internal code logic and infrastructure
limits.
1. Project Paths
Choose one of the following paths for your group:
• Path A: The Integrator (Standard) Adopt an existing "RealWorld" implementation. You
must choose one Frontend and one Backend repository from the RealWorld repository
list (e.g., React Frontend + Go Backend).
• Path B: The Creator (Custom) Use a web application developed by your group previously
(e.g., for another course). The app must include a Frontend, a Backend, and a Database.
2. Phase 1: Exploration & Test Design
This phase focuses on identifying functional requirements and discovering unknown risks.
Part A: Functional Verification (Test Cases)
Design a suite of formal test cases using black-box techniques.
• Deliverable: A Test Case Suite documenting inputs, actions, and expected results.
o Quantity: minimum 10 test cases including both happy path and sad path.
o Technique Requirement: Use as many as black box or exploratory techniques
o Template: "Test Case Standard Template" is provided at the last section
Part B: Investigative Testing (Test Charters)
Apply investigative testing tactics to hunt for risks that standard scripts often miss, such as
concurrency issues, data corruption, or resilience failures.
• Requirement: Conduct Session-Based Test Management (SBTM) with a minimum of 3
Charters.
• Deliverable:
pg. 1
o Minimum 3 Completed Charter Logs documenting your mission, findings, and
time spent.
o Template: "Charter" template will be provided in session 3 separately.
Part C: Defect Documentation (Bug Reports)
Any failure found during Part A or Part B must be formally documented.
• Deliverable: A Bug Tracking Log containing detailed reports (Steps to Reproduce,
Severity, Priority, and Evidence).
3. Phase 2: White-Box & API
In this phase, you will verify the internal logic and the communication layer of your application.
• Logic Verification (Unit Testing): Identify a critical business logic component in the
backend. Write Unit Tests to cover multiple logical branches and use all the techniques
learned from session 4. Minimum 10 test cases including both happy path and sad path.
• Integration Validation (API): Build a Postman Collection for all backend endpoints. Use
Environment Variables for tokens and URLs. Minimum 10 requests covering a full CRUD
Wlow (Create, Read, Update, Delete). Every request must have at least 2 assertion (Status
Code and JSON responses validation).
• UI Automation Test: Minimum 2 End-to-End (E2E) Rlows (e.g., "User Login" and "Create a
Post").
4. Phase 3: Infrastructure Analysis (Performance)
Determine the "Breaking Point" of your application and analyze its behavior under pressure.
• Load & Stress Testing: Use JMeter or K6 to establish a baseline (1 user) and then simulate
a load of at least 50 concurrent users. Increase traffic until the system fails to identify the
primary bottleneck (e.g., database timeout or CPU spike).
• Expected Deliverables: Performance Analysis Report with graphs of Response Time vs.
User Load and a summary of the system's operational limits.
5. Extra Credit: Observability (Optional)
Groups can earn additional credit by implementing a monitoring solution.
• Task: Connect your backend to Logz.io (or your preferred tools).
pg. 2
• Requirement: During your final demo, show a live dashboard that captures errors or
performance spikes triggered during your JMeter tests.
6. Final Checklist
Software Quality Engineering Report:
1. Black-Box Test Suite: Formal test cases for functional verification.
2. The Charter: Minimum 5 Charters documented using the SBTM approach.
3. The Technical Report: Evidence of Unit Tests (White-box) and the Postman API collection.
4. The Performance Report: Results and analysis.
5. GitHub Repository Link: The softw