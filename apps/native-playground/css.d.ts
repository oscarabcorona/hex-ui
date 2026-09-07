/**
 * `global.css` is consumed by Metro through NativeWind's transformer, not by
 * TypeScript. Declaring it keeps the side-effect import in `app/_layout.tsx`
 * type-checkable without pulling a CSS-modules plugin into the app.
 */
declare module "*.css";
