"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./_editProfile.scss";

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Multan",
  "Faisalabad",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Hyderabad",
];
const maritalStatuses = [
  "Single",
  "Divorced no children",
  "Divorced have children",
  "Widowed no children",
  "Widowed have children",
];
const religions = ["Islam"];
const sects = [
  "Sunni – Hanafi",
  "Sunni – Shafi",
  "Sunni – Maliki",
  "Shia",
  "Other",
];
const tongues = [
  "Urdu",
  "Punjabi",
  "Sindhi",
  "Pashto",
  "Balochi",
  "Saraiki",
  "Other",
];
const educations = [
  "Matric",
  "Intermediate",
  "Bachelor's",
  "Master's",
  "PhD",
  "MBBS",
  "Engineering",
  "Other",
];
const professions = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Business",
  "Student",
  "Government Job",
  "IT Professional",
  "Lawyer",
  "Other",
];

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "",
    city: "",
    country: "Pakistan",
    profession: "",
    education: "",
    marital_status: "",
    religion: "Islam",
    sect: "",
    caste: "",
    mother_tongue: "",
    height: "",
    about: "",
    blur_photo: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setForm({
          full_name: profile.full_name || "",
          age: profile.age || "",
          gender: profile.gender || "",
          city: profile.city || "",
          country: profile.country || "Pakistan",
          profession: profile.profession || "",
          education: profile.education || "",
          marital_status: profile.marital_status || "",
          religion: profile.religion || "Islam",
          sect: profile.sect || "",
          caste: profile.caste || "",
          mother_tongue: profile.mother_tongue || "",
          height: profile.height || "",
          about: profile.about || "",
          blur_photo: profile.blur_photo || false,
        });

        if (profile.image_url) setPhotoPreview(profile.image_url);
      }

      setPageLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.full_name || !form.age || !form.gender || !form.city) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    let image_url = photoPreview && !photoFile ? photoPreview : null;

    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const filePath = `${user.id}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, photoFile, { upsert: true });

      if (uploadError) {
        setError("Photo upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(filePath);

      image_url = urlData.publicUrl;
    }

    const updateData = {
      full_name: form.full_name,
      age: Number(form.age),
      gender: form.gender,
      city: form.city,
      country: form.country,
      profession: form.profession,
      education: form.education,
      marital_status: form.marital_status,
      religion: form.religion,
      sect: form.sect,
      caste: form.caste,
      mother_tongue: form.mother_tongue,
      height: form.height,
      about: form.about,
      blur_photo: form.blur_photo,
    };

    if (image_url) updateData.image_url = image_url;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Profile updated successfully!");
    setTimeout(() => router.push("/members"), 1500);
  };

  if (pageLoading) {
    return <div className="edit-profile__loading">Loading your profile...</div>;
  }

  return (
    <div className="edit-profile">
      <div className="edit-profile__inner">
        <h1 className="edit-profile__title">Edit Your Profile</h1>
        <p className="edit-profile__subtitle">
          Update your details or change your photo anytime.
        </p>

        {error && <p className="edit-profile__error">{error}</p>}
        {success && <p className="edit-profile__success">{success}</p>}

        <div className="edit-profile__form">
          <div className="edit-profile__section">
            <h3 className="edit-profile__section-title">Profile Photo</h3>
            <div className="edit-profile__photo-upload">
              <div
                className={`edit-profile__photo-preview ${form.blur_photo ? "edit-profile__photo-preview--blurred" : ""}`}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" />
                ) : (
                  <div className="edit-profile__photo-placeholder">
                    <span>📷</span>
                    <p>No photo selected</p>
                  </div>
                )}
              </div>

              <div className="edit-profile__photo-actions">
                <label className="edit-profile__photo-btn">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                  />
                </label>

                <label className="edit-profile__blur-toggle">
                  <input
                    type="checkbox"
                    name="blur_photo"
                    checked={form.blur_photo}
                    onChange={handleChange}
                  />
                  <span>Blur my photo for privacy</span>
                </label>
              </div>
            </div>
          </div>

          <div className="edit-profile__section">
            <h3 className="edit-profile__section-title">Basic Information</h3>

            <div className="edit-profile__row">
              <div className="edit-profile__field">
                <label>Full Name *</label>
                <input
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-profile__field">
                <label>Age *</label>
                <input
                  name="age"
                  type="number"
                  min="18"
                  max="80"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="edit-profile__row">
              <div className="edit-profile__field">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="edit-profile__field">
                <label>Height</label>
                <input
                  name="height"
                  type="text"
                  value={form.height}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="edit-profile__row">
              <div className="edit-profile__field">
                <label>City *</label>
                <select name="city" value={form.city} onChange={handleChange}>
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-profile__field">
                <label>Country</label>
                <input
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="edit-profile__section">
            <h3 className="edit-profile__section-title">Education & Career</h3>

            <div className="edit-profile__row">
              <div className="edit-profile__field">
                <label>Profession</label>
                <select
                  name="profession"
                  value={form.profession}
                  onChange={handleChange}
                >
                  <option value="">Select profession</option>
                  {professions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-profile__field">
                <label>Education</label>
                <select
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                >
                  <option value="">Select education</option>
                  {educations.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="edit-profile__section">
            <h3 className="edit-profile__section-title">Family & Background</h3>

            <div className="edit-profile__row">
              <div className="edit-profile__field">
                <label>Marital Status</label>
                <select
                  name="marital_status"
                  value={form.marital_status}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  {maritalStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-profile__field">
                <label>Caste</label>
                <input
                  name="caste"
                  type="text"
                  value={form.caste}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="edit-profile__row">
              <div className="edit-profile__field">
                <label>Religion</label>
                <select
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                >
                  {religions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-profile__field">
                <label>Sect</label>
                <select name="sect" value={form.sect} onChange={handleChange}>
                  <option value="">Select sect</option>
                  {sects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="edit-profile__row">
              <div className="edit-profile__field">
                <label>Mother Tongue</label>
                <select
                  name="mother_tongue"
                  value={form.mother_tongue}
                  onChange={handleChange}
                >
                  <option value="">Select language</option>
                  {tongues.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="edit-profile__section">
            <h3 className="edit-profile__section-title">About Yourself</h3>
            <div className="edit-profile__field edit-profile__field--full">
              <label>About</label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </div>

          <button
            className="edit-profile__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
