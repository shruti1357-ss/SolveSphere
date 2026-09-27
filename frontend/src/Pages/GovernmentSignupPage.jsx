import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  User,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const GovernmentSignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState({
    idCard: "",
    designationProof: "",
    organizationDocument: "",
  });

  const [form, setForm] = useState({
    fullName: "",
    designation: "",
    department: "",
    organization: "",
    officialEmail: "",
    contactNumber: "",
    level: "STATE", // "STATE" or "DISTRICT"
    district: "",
    password: "",
    confirmPassword: "",
    additionalInfo: "",
    agreed: false,
  });

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "level" && value === "STATE" ? { district: "" } : {}),
    }));
    if (error) setError("");
  };

  const handleFile = (name, e) => {
    const file = e.target.files?.[0];
    if (file) setFiles((prev) => ({ ...prev, [name]: file.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.designation.trim() || !form.department.trim() || !form.organization.trim() || !form.officialEmail.trim() || !form.contactNumber.trim() || !form.level || !form.password || !form.confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.level === "DISTRICT" && !form.district.trim()) {
      setError("Please select your District.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agreed) {
      setError("Please accept the Terms & Conditions and Privacy Policy.");
      return;
    }

    try {
      setIsLoading(true);
      await signup(form.fullName, form.officialEmail, form.password, "Government", {
        level: form.level,
        government_level: form.level,
        district: form.level === "DISTRICT" ? form.district.trim() : "",
        designation: form.designation.trim(),
        department: form.department.trim(),
        organization: form.organization.trim(),
        phone: form.contactNumber.trim(),
        contactNumber: form.contactNumber.trim(),
        additionalInfo: form.additionalInfo.trim(),
        governmentDocuments: files,
        accountType: form.level === "STATE" ? "State Government Official" : "District Government Administrator",
      });

      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setIsLoading(false);
      if (err?.code === "ACCOUNT_ALREADY_EXISTS") {
        setError("An account with this official email already exists. Please login instead.");
      } else {
        setError(err?.message || "Unable to create the government account. Please try again.");
      }
    }
  };

  const uploadCard = (key, title, subtitle) => (
    <label className="group block cursor-pointer rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue-300 hover:bg-blue-50/20">
      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFile(key, e)} />
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <FileText size={17} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-800">{title}</p>
          <p className="text-[9px] text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex min-h-[58px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-2 text-center">
        <UploadCloud size={18} className="mb-1 text-slate-500" />
        <span className="text-[10px] font-semibold text-slate-600 truncate max-w-full px-2">
          {files[key] || "Click to upload"}
        </span>
        {!files[key] && <span className="text-[8px] text-slate-400">PDF, JPG, PNG · Max 5MB</span>}
      </div>
    </label>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-[#eef5fb] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-[0_25px_80px_rgba(30,64,175,0.12)]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={38} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Registration Submitted Successfully</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your government account has been saved. Please use the same official email and password on Government Login to continue.
          </p>
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-semibold text-blue-700">
            Redirecting to Government Login…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef5fb] px-0 py-0 font-sans">
      <div className="min-h-screen bg-white shadow-2xl md:grid md:grid-cols-[285px_1fr]">
        {/* LEFT GOVERNMENT PANEL */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-b from-[#eaf6ff] via-[#f5fbff] to-[#dcefff] md:flex md:flex-col md:justify-between p-7 lg:p-8">
          <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f4c81] text-white font-black">S</div>
              <span className="text-lg font-extrabold text-[#143d68]">Solve<span className="text-[#1e75bd]">Sphere</span></span>
            </Link>

            <div className="mb-8">
              <Landmark className="mb-3 text-[#143d68]" size={38} strokeWidth={1.7} />
              <h2 className="text-4xl font-extrabold leading-tight text-[#173f68]">Government<br />Registration</h2>
              <p className="mt-4 max-w-[220px] text-sm leading-6 text-slate-600">Join hands in building a smarter, more sustainable Jharkhand.</p>
            </div>

            <div className="space-y-7">
              {[
                [ShieldCheck, "Verify & Validate", "Ensure authentic government participation and secure access."],
                [Users, "Review Reports", "Analyze citizen reports and AI recommendations."],
                [Sparkles, "Assign Universities", "Connect problems with the right academic experts."],
                [CheckCircle2, "Build a Better Tomorrow", "Together for a sustainable and developed Jharkhand."],
              ].map(([Icon, title, text]) => (
                <div key={title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100/80 text-[#155b91]"><Icon size={19} /></div>
                  <div>
                    <p className="text-xs font-extrabold text-[#193e64]">{title}</p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-10 overflow-hidden rounded-2xl border border-blue-100 bg-white/55 p-4">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-100" />
            <div className="relative flex items-end gap-1.5 h-24 justify-center opacity-80">
              {[28, 45, 65, 84, 55, 72, 38].map((height, i) => <div key={i} className="w-5 rounded-t-md bg-[#2f78b7]/40" style={{ height }} />)}
            </div>
            <p className="mt-2 text-center text-[12px] font-bold italic text-[#234e73]">Good Governance for a Brighter Jharkhand</p>
          </div>
        </aside>

        {/* RIGHT FORM */}
        <main className="min-w-0 overflow-y-auto bg-[#f8fbfe] px-4 py-5 sm:px-7 lg:px-8">
          <div className="mx-auto max-w-[1000px]">
            <div className="mb-4 flex items-start gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0f5d9c] text-white shadow-md"><Landmark size={28} /></div>
              <div>
                <div className="flex items-center gap-2 sm:hidden mb-1 text-[#0f5d9c]"><Landmark size={21} /><span className="font-bold">SolveSphere</span></div>
                <h1 className="text-2xl font-extrabold text-[#173d65] sm:text-[28px]">Government Registration</h1>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">Register your official account to review citizen reports, verify information and manage university assignments.</p>
              </div>
            </div>

            {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SECTION 1 */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-[#173d65]"><User size={18} /><h2 className="text-sm font-extrabold">1. Personal &amp; Official Details</h2></div>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    ["fullName", "Full Name", "Enter your full name", User],
                    ["designation", "Designation", "e.g. District Magistrate, Officer", BriefcaseIcon],
                    ["department", "Department", "e.g. Higher & Technical Education", Building2],
                    ["organization", "Government Organization / Office", "e.g. Government of Jharkhand", Landmark],
                    ["officialEmail", "Official Email Address", "name@nic.in", Mail],
                    ["contactNumber", "Contact Number", "+91 98765 43210", Phone],
                  ].map(([name, label, placeholder, Icon]) => (
                    <div key={name}>
                      <label className="mb-1.5 block text-[10px] font-bold text-slate-700">{label} <span className="text-red-500">*</span></label>
                      <div className="relative"><Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name={name} value={form[name]} onChange={updateField} type={name === "officialEmail" ? "email" : "text"} placeholder={placeholder} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-9 pr-3 text-[11px] text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50" /></div>
                    </div>
                  ))}
                </div>

                {/* GOVERNMENT LEVEL & CONDITIONAL DISTRICT SELECTION */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="mb-2 block text-[11px] font-extrabold text-[#173d65]">
                    Government Level <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${form.level === "STATE" ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20" : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60"}`}>
                      <input type="radio" name="level" value="STATE" checked={form.level === "STATE"} onChange={updateField} className="accent-blue-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">State Level</p>
                        <p className="text-[9px] text-slate-500">State Government Official (All Districts)</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${form.level === "DISTRICT" ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20" : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60"}`}>
                      <input type="radio" name="level" value="DISTRICT" checked={form.level === "DISTRICT"} onChange={updateField} className="accent-blue-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">District Level</p>
                        <p className="text-[9px] text-slate-500">District Administration Officer</p>
                      </div>
                    </label>
                  </div>

                  {form.level === "DISTRICT" && (
                    <div className="mt-3.5 max-w-sm">
                      <label className="mb-1.5 block text-[10px] font-bold text-slate-700">
                        District <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          name="district"
                          value={form.district}
                          onChange={updateField}
                          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-9 pr-3 text-[11px] text-slate-900 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        >
                          <option value="">-- Select District --</option>
                          {["Ranchi", "Dhanbad", "East Singhbhum", "West Singhbhum", "Bokaro", "Khunti", "Giridih", "Garhwa", "Palamu", "Chatra", "Deoghar", "Dumka", "Godda", "Hazaribagh", "Jamtara", "Koderma", "Latehar", "Lohardaga", "Pakur", "Ramgarh", "Sahibganj", "Saraikela-Kharsawan", "Simdega"].map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION 2 */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-[#173d65]"><LockKeyhole size={18} /><h2 className="text-sm font-extrabold">2. Account Security</h2></div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[["password", "Password", "Create a strong password", showPassword, setShowPassword], ["confirmPassword", "Confirm Password", "Confirm your password", showConfirmPassword, setShowConfirmPassword]].map(([name, label, placeholder, shown, toggle]) => (
                    <div key={name}>
                      <label className="mb-1.5 block text-[10px] font-bold text-slate-700">{label} <span className="text-red-500">*</span></label>
                      <div className="relative"><LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input name={name} value={form[name]} onChange={updateField} type={shown ? "text" : "password"} placeholder={placeholder} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-9 pr-10 text-[11px] text-slate-900 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50" /><button type="button" onClick={() => toggle((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{shown ? <EyeOff size={15} /> : <Eye size={15} />}</button></div>
                      <p className="mt-1 text-[8px] text-slate-400">Minimum 6 characters with a number and letter recommended</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 3 */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-center gap-2 text-[#173d65]"><FileText size={18} /><h2 className="text-sm font-extrabold">3. Official Documents <span className="font-medium text-slate-400">(Optional for Verification)</span></h2></div>
                <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-[10px] leading-4 text-blue-700"><strong>Please upload relevant documents to verify your identity and official position.</strong><br />(For prototype, you can upload sample files.)</div>
                <div className="grid gap-3 md:grid-cols-3">
                  {uploadCard("idCard", "Official ID Card", "e.g. Employee ID, Government ID")}
                  {uploadCard("designationProof", "Designation Proof", "e.g. Appointment Letter")}
                  {uploadCard("organizationDocument", "Organization Document", "e.g. Office Letterhead")}
                </div>
              </section>

              {/* SECTION 4 */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-center gap-2 text-[#173d65]"><Building2 size={18} /><h2 className="text-sm font-extrabold">4. Additional Information</h2></div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-700">About your department and role <span className="font-normal text-slate-400">(Optional)</span></label>
                <textarea name="additionalInfo" value={form.additionalInfo} onChange={updateField} maxLength={500} rows={3} placeholder="Share any additional details about your work, responsibilities or areas of focus..." className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-[11px] outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50" />
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-start gap-2 text-[9px] text-slate-500"><input type="checkbox" name="agreed" checked={form.agreed} onChange={updateField} className="mt-0.5 accent-blue-600" /> <span>I agree to the <span className="font-bold text-blue-600">Terms &amp; Conditions</span> and <span className="font-bold text-blue-600">Privacy Policy</span>.</span></label>
                  <button type="submit" disabled={isLoading} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2f80df] px-7 text-xs font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-[#2674cf] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Submitting..." : "Submit Registration"}<ArrowRight size={16} /></button>
                </div>
              </section>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

const BriefcaseIcon = ({ size = 16, className = "" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M2 12h20"/></svg>;

export default GovernmentSignupPage;
