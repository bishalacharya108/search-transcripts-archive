# ISDS Project

## 📋 Requirement Analysis

### 👥 User Management
- **Role Based Access Control (RBAC)**
  - Roles: **Contributors**, **Viewers**, and **Admins (Mods)**
- **User Authentication**

### 📄 File Upload and Changes Management
- Users can upload **Markdown** text
- **Admin approval** required for submissions
- **Data validation** for all inputs
- **History tracking** for all versions
- **Draft status** for each upload, update, or reupload

### 🔍 Searching Mechanism
- Text search over all **approved** transcriptions
- Basic search filters
- Highlighting of searched terms
- Efficient text indexing for better search performance
- Database must be **optimized** for text search
- Result **sorting**
- **Fuzzy search / search-as-you-type** capabilities

---

## 🔁 Data Flow

(User / Contributor → Markdown Editor → API Routes → MongoDB)
(Admin UI Interface → API Routes → MongoDB)
(User → API Routes → MongoDB → UI)


---

## 🛠️ Technologies

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Markdown Editor Component**
- **Next.js API Routes**
- **MongoDB Atlas**
- **Mongoose**
- **Vercel**
- **Auth0**
- **zod**
- _Prisma?_ (consideration)

---

## 🌐 Plans for Future
- Translation Projects
