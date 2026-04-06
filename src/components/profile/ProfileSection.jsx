// components/profile/ProfileSection.jsx
export default function ProfileSection({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-2 mb-3 mt-4">
      {children}
    </div>
  );
}