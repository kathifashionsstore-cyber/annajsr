# Workspace Customization Rules - JSR Annamayya Portfolio

Welcome! This document outlines project-scoped rules, constraints, and architecture guidelines for the JSR Annamayya portfolio workspace.

---

## 🛠️ Stack & Architecture Rules

1. **Database & Data Layer**:
   - All Firestore reads and writes must pass through `src/services/portfolioService.js`. Never write direct queries inside component files.
   - For Firestore real-time listeners (`onSnapshot`), always provide an error callback as the second/third parameter to catch disconnections/permission drops cleanly without throwing uncaught console exceptions.

2. **Styling & Responsiveness**:
   - Use Tailwind CSS. For layouts, ensure viewports of `360px`, `390px`, and `768px` are fully supported without horizontal overflow.
   - For lists/grids in both client pages and the Admin dashboard, use responsive flex/grid wrappers that stack vertically (`grid-cols-1`) on mobile viewports and scale up gracefully.

3. **React Key Guidelines**:
   - Always ensure mapped loops use unique list keys. Fall back to indices safely (e.g. `key={item.id || idx}`) so that fallback mock data does not trigger key collision warnings.

4. **Media uploads**:
   - All profile/carousel images must go through the client-side compression pipeline before ImgBB upload.
   - For files, generate local URL object previews using `URL.createObjectURL(file)` to support instant preview, and always clean them up using `URL.revokeObjectURL(url)` on save, cancel, or unmount to avoid DNS resolving/leak warnings on `blob.jpg`.
   - Video Reels are 9:16 vertical MP4/WebM files, capped under 500KB via canvas/MediaRecorder compression before Firebase Storage upload.

5. **User Notifications & States**:
   - Do not use blocking native `alert()` or `confirm()` dialogs in UI flows. Use the custom toast notification system instead.
   - All save operations must feature a visual loader (e.g., `Saving...` or spinners) and disable actions until the transaction resolves.
