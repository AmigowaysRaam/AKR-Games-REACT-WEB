// components/profile/ProfileHeader.jsx
export default function ProfileHeader() {
  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl mb-3 shadow-sm">
      <img
        src="https://i.pravatar.cc/100"
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />

      <div>
        <p className="text-sm font-semibold text-gray-800">
          Player***851
        </p>
      </div>
    </div>
  );
}