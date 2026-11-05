# Project Architecture Decisions

- Keep UniCourses Assistant knowledge in a central local data module and matching logic in a separate utility; this avoids external AI/API dependencies and keeps content editable without changing the UI.