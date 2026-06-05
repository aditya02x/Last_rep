import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/Profile.js";
import {
  User,
  Ruler,
  Weight,
  Target,
  Activity,
  Pencil,
  Save,
} from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const profile = data.user || data;

        setUser(profile);
        setFormData(profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await updateProfile(formData);

      setUser(response.user);
      setFormData(response.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      console.log(error.response);
    console.log(error.response?.data);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "bg-[#111827] text-white px-3 py-2 rounded-xl border border-white/10 outline-none focus:border-[#a3e635] w-28 text-right";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0a0f1c] px-4 pt-6 pb-28"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      <div className="mb-6">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
          Your
        </p>
        <h1 className="text-white text-3xl font-bold">Profile</h1>
      </div>

      <div className="bg-[#1c2333] rounded-3xl p-6 border border-white/[0.05] mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center">
            <User size={30} className="text-[#a3e635]" />
          </div>

          <div>
            <h2 className="text-white text-xl font-bold">
              {user?.name || "User"}
            </h2>

            <p className="text-gray-400 text-sm">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1c2333] rounded-3xl p-5 border border-white/[0.05] mb-4">
        <h3 className="text-white font-bold text-lg mb-4">
          Physical Stats
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <User size={16} />
              <span>Age</span>
            </div>

            {isEditing ? (
              <input
                type="number"
                value={formData.age || ""}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className={inputStyle}
              />
            ) : (
              <span className="text-white">{user?.age || "--"}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Ruler size={16} />
              <span>Height</span>
            </div>

            {isEditing ? (
              <input
                type="number"
                value={formData.height || ""}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                className={inputStyle}
              />
            ) : (
              <span className="text-white">
                {user?.height ? `${user.height} cm` : "--"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Weight size={16} />
              <span>Current Weight</span>
            </div>

            {isEditing ? (
              <input
                type="number"
                value={formData.currentWeight || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentWeight: e.target.value,
                  })
                }
                className={inputStyle}
              />
            ) : (
              <span className="text-white">
                {user?.currentWeight
                  ? `${user.currentWeight} kg`
                  : "--"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Target size={16} />
              <span>Goal Weight</span>
            </div>

            {isEditing ? (
              <input
                type="number"
                value={formData.goalWeight || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    goalWeight: e.target.value,
                  })
                }
                className={inputStyle}
              />
            ) : (
              <span className="text-white">
                {user?.goalWeight
                  ? `${user.goalWeight} kg`
                  : "--"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#1c2333] rounded-3xl p-5 border border-white/[0.05] mb-6">
        <h3 className="text-white font-bold text-lg mb-4">
          Fitness Goal
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Goal</span>

            {isEditing ? (
              <select
                value={formData.goal || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    goal: e.target.value,
                  })
                }
                className="bg-[#111827] text-white px-3 py-2 rounded-xl border border-white/10"
              >
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="maintenance">Maintenance</option>
              </select>
            ) : (
              <span className="text-white capitalize">
                {user?.goal?.replace("_", " ") || "--"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity size={16} />
              <span>Activity Level</span>
            </div>

            {isEditing ? (
              <select
                value={formData.activityLevel || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    activityLevel: e.target.value,
                  })
                }
                className="bg-[#111827] text-white px-3 py-2 rounded-xl border border-white/10"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            ) : (
              <span className="text-white capitalize">
                {user?.activityLevel || "--"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Gender</span>

            {isEditing ? (
              <select
                value={formData.gender || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value,
                  })
                }
                className="bg-[#111827] text-white px-3 py-2 rounded-xl border border-white/10"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span className="text-white">
                {user?.gender || "--"}
              </span>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#a3e635] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full bg-[#a3e635] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
        >
          <Pencil size={18} />
          Edit Profile
        </button>
      )}
    </div>
  );
};
export default ProfilePage;