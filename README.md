# ISDS Project

## 📋 Requirement Analysis

### 👥 User Management
- **Role Based Access Control (RBAC)**
  - Roles: **Contributors**, **Viewers**, and **Admins (Mods)**
- **User Authentication**
- **User Verification**
- **Users can request to admins for Contributor role

### 📄 File Upload and Changes Management
- Users can access all the approved transcriptions
- Contributors can upload **Markdown** text and files
- **Admin approval** required for submissions
- **Admin can update documents before or after approval**
- **Data validation** for all inputs
- **History tracking** for all versions
- **Draft status** for each upload, update, or reupload
- **Update handling** only updating if changes happened and confirm before updating
- Checking if the video already exists (in  approved)
- A list of video links that have been already transcribed
- Only Contributors and Admins will have a dashboard to see their stats
- Contributors can make updates to their uploaded documents until they are approved, but not after approval

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

(Contributor → Markdown Editor → API Routes → MongoDB {pending}),
(Admin UI Interface → API Routes → MongoDB {approved}),
(User → API Routes → MongoDB → UI),
(User → Searches → Mongodb → UI )



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
- **axios**
- **tanstackquery**
- **NextAuth**
- **Shadcn** | **DaisyUI** (?)

---

## 🌐 Plans for Future
- Translation Projects

---

## Api Routes:
- transcription- http://localhost:3000/api/transcription


## Atlas Search Index:
-```{
  mappings: {
    dynamic: false,
    fields: {
      title: {
        type: "string",
        analyzer: "lucene.english",
      },
      markdown: {
        type: "string",
        analyzer: "lucene.english",
      },
    },
  },
}```

## (focusing on the backend rn)
