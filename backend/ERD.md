# Entity Relationship Diagram

```mermaid
erDiagram
    User {
        String id PK
        String name
        String email UK
        String password
        String role
        DateTime createdAt
    }
    Event {
        String id PK
        String title
        String description
        String date
        String time
        String location
        String category
        String image
        Float price
        Int capacity
        String status
        String organizer
        DateTime createdAt
    }
    
    User }o--o{ Event : "Registers For"
```
