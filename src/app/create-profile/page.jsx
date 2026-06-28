"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./_createProfile.scss";

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

export default function CreateProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
      }
    });
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

    let image_url = null;

    // upload photo if selected
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

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
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
      image_url,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Profile created successfully!");
    setTimeout(() => router.push("/browse"), 1500);
  };

  return (
    <div className="create-profile">
      <div className="create-profile__inner">
        <h1 className="create-profile__title">Complete Your Profile</h1>
        <p className="create-profile__subtitle">
          Fill in your details so others can find you. Fields marked with * are
          required.
        </p>

        {error && <p className="create-profile__error">{error}</p>}
        {success && <p className="create-profile__success">{success}</p>}

        <div className="create-profile__form">
          {/* ── Photo Upload ── */}
          <div className="create-profile__section">
            <h3 className="create-profile__section-title">Profile Photo</h3>

            <div className="create-profile__photo-upload">
              <div
                className={`create-profile__photo-preview ${form.blur_photo ? "create-profile__photo-preview--blurred" : ""}`}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" />
                ) : (
                  <div className="create-profile__photo-placeholder">
                    <span>📷</span>
                    <p>No photo selected</p>
                  </div>
                )}
              </div>

              <div className="create-profile__photo-actions">
                <label className="create-profile__photo-btn">
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                  />
                </label>

                <label className="create-profile__blur-toggle">
                  <input
                    type="checkbox"
                    name="blur_photo"
                    checked={form.blur_photo}
                    onChange={handleChange}
                  />
                  <span>Blur my photo for privacy</span>
                </label>
                <p className="create-profile__blur-hint">
                  If enabled, your photo will appear blurred to others until you
                  accept their interest request.
                </p>
              </div>
            </div>
          </div>

          {/* ── Basic Info ── */}
          <div className="create-profile__section">
            <h3 className="create-profile__section-title">Basic Information</h3>

            <div className="create-profile__row">
              <div className="create-profile__field">
                <label>Full Name *</label>
                <input
                  name="full_name"
                  type="text"
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </div>
              <div className="create-profile__field">
                <label>Age *</label>
                <input
                  name="age"
                  type="number"
                  placeholder="Your age"
                  min="18"
                  max="80"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="create-profile__row">
              <div className="create-profile__field">
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
              <div className="create-profile__field">
                <label>Height</label>
                <input
                  name="height"
                  type="text"
                  placeholder="e.g. 5'6&quot;"
                  value={form.height}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="create-profile__row">
              <div className="create-profile__field">
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
              <div className="create-profile__field">
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

          {/* ── Education & Career ── */}
          <div className="create-profile__section">
            <h3 className="create-profile__section-title">
              Education & Career
            </h3>

            <div className="create-profile__row">
              <div className="create-profile__field">
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
              <div className="create-profile__field">
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

          {/* ── Family & Background ── */}
          <div className="create-profile__section">
            <h3 className="create-profile__section-title">
              Family & Background
            </h3>

            <div className="create-profile__row">
              <div className="create-profile__field">
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
              <div className="create-profile__field">
                <label>Caste</label>
                <input
                  name="caste"
                  type="text"
                  placeholder="Your caste"
                  value={form.caste}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="create-profile__row">
              <div className="create-profile__field">
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
              <div className="create-profile__field">
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

            <div className="create-profile__row">
              <div className="create-profile__field">
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

          {/* ── About ── */}
          <div className="create-profile__section">
            <h3 className="create-profile__section-title">About Yourself</h3>
            <div className="create-profile__field create-profile__field--full">
              <label>About</label>
              <textarea
                name="about"
                placeholder="Write a few lines about yourself, your values, and what you are looking for..."
                value={form.about}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </div>

          <button
            className="create-profile__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
