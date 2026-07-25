// components/resume/ResumeUpload.jsx
import { useRef, useState } from "react";
import { uploadResume } from "../../api/resumeApi";

export default function ResumeUpload({ onUploaded }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file) {
    if (!file || file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("resume_name", file.name.replace(/\.pdf$/i, ""));
      formData.append("category", "General");

      const res = await uploadResume(formData);
      if (res.success) {
        onUploaded(res.resume);
      } else {
        setError(res.message || "Upload failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl py-10 text-center cursor-pointer transition ${
          dragActive ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
        }`}
      >
        <p className="text-muted text-sm">
          {uploading
            ? "Uploading..."
            : "Drag & drop a PDF, or click to upload a new resume version"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {error && <p className="text-coral text-xs mt-2">{error}</p>}
    </div>
  );
}