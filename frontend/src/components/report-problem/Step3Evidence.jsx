import React, { useState, useRef } from "react";
import { Camera, Video, Upload, Trash2, X, Image as ImageIcon, Film } from "lucide-react";

let mediaCounter = 0;
const createMediaId = (prefix) => `${prefix}_${++mediaCounter}`;
import { useLanguage } from "../../context/LanguageContext";
import { citizenText } from "../../i18n/citizenUi";

const Step3Evidence = ({ formData, updateFormData, onNext, onBack, error }) => {
  const { language } = useLanguage();
  const rt = (key, values) => citizenText(language, key, values);
  // Media state
  const photos = formData.photos || [];
  const videos = formData.videos || [];

  // Webcam Photo Modal State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoStream, setPhotoStream] = useState(null);
  const videoRef = useRef(null);

  // Webcam Video Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoRecorder, setVideoRecorder] = useState(null);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoTimer, setVideoTimer] = useState(0);
  const videoTimerRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // PHOTO HANDLERS
  const startCamera = async () => {
    setShowPhotoModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPhotoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied/failed:", err);
      setTimeout(() => {
        captureFallbackPhoto();
      }, 1000);
    }
  };

  const stopCamera = () => {
    if (photoStream) {
      photoStream.getTracks().forEach((track) => track.stop());
    }
    setPhotoStream(null);
    setShowPhotoModal(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      
      const photoId = createMediaId("photo");
      const newPhotos = [...photos, { id: photoId, url: dataUrl, name: `Photo_${photos.length + 1}.jpg` }];
      updateFormData({ photos: newPhotos });
      stopCamera();
    } else {
      captureFallbackPhoto();
    }
  };

  const captureFallbackPhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Captured Photo Evidence", 150, 180);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText(`Captured Evidence Photo #${photos.length + 1}`, 160, 220);
    const dataUrl = canvas.toDataURL("image/jpeg");

    const photoId = createMediaId("photo");
    const newPhotos = [...photos, { id: photoId, url: dataUrl, name: `Photo_${photos.length + 1}.jpg` }];
    updateFormData({ photos: newPhotos });
    stopCamera();
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const url = evt.target.result;
        if (type === "photo") {
          const updated = [...(formData.photos || []), { id: createMediaId("upload_photo"), url, name: file.name }];
          updateFormData({ photos: updated });
        } else if (type === "video") {
          const updated = [...(formData.videos || []), { id: createMediaId("upload_video"), url, name: file.name }];
          updateFormData({ videos: updated });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const deletePhoto = (id) => {
    const updated = photos.filter((p) => p.id !== id);
    updateFormData({ photos: updated });
  };

  // VIDEO HANDLERS
  const startVideoRecorder = async () => {
    setShowVideoModal(true);
    recordedChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const updated = [...(formData.videos || []), { id: createMediaId("video"), url, name: `Video_${(formData.videos || []).length + 1}.webm` }];
        updateFormData({ videos: updated });
        stream.getTracks().forEach((track) => track.stop());
      };
      setVideoRecorder(mediaRecorder);
    } catch (err) {
      console.warn("Video recorder camera error:", err);
    }
  };

  const toggleVideoRecording = () => {
    if (!isVideoRecording) {
      if (videoRecorder) videoRecorder.start();
      setIsVideoRecording(true);
      setVideoTimer(0);
      videoTimerRef.current = setInterval(() => setVideoTimer((t) => t + 1), 1000);
    } else {
      if (videoRecorder) videoRecorder.stop();
      setIsVideoRecording(false);
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
      setShowVideoModal(false);
    }
  };

  const deleteVideo = (id) => {
    const updated = videos.filter((v) => v.id !== id);
    updateFormData({ videos: updated });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Validation Error */}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs font-bold text-red-300">
          {error}
        </div>
      )}

      {/* Evidence Summary Count Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <span>{rt("uploadedEvidence")}:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Camera className="h-3.5 w-3.5" /> Photos: {photos.length}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            <Film className="h-3.5 w-3.5" /> Video: {videos.length}
          </span>
        </div>
      </div>

      <p className="text-xs text-emerald-400 font-semibold">
        * Please upload or capture at least one photo or video before continuing.
      </p>

      {/* 1. PHOTO SECTION */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">{rt("photoEvidence")}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition"
            >
              <Camera className="h-3.5 w-3.5" /> {rt("takePhoto")}
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition">
              <Upload className="h-3.5 w-3.5" /> {rt("uploadPhotos")}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, "photo")}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-8 text-center">
            <Camera className="h-8 w-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-400">{rt("noPhotos")}</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {photos.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                <img src={p.url} alt={p.name} className="h-28 w-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => deletePhoto(p.id)}
                    className="rounded-lg bg-red-500/80 p-1.5 text-white hover:bg-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. VIDEO SECTION */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">{rt("videoEvidence")}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startVideoRecorder}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/20 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-500/30 transition"
            >
              <Video className="h-3.5 w-3.5" /> {rt("recordVideo")}
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition">
              <Upload className="h-3.5 w-3.5" /> {rt("uploadVideo")}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, "video")}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-8 text-center">
            <Video className="h-8 w-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-400">{rt("noVideos")}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {videos.map((v) => (
              <div key={v.id} className="relative rounded-xl border border-slate-800 bg-slate-900 p-2">
                <video src={v.url} controls className="h-36 w-full rounded-lg bg-black object-cover" />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-300 truncate max-w-[200px]">{v.name}</span>
                  <button
                    type="button"
                    onClick={() => deleteVideo(v.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    {rt("delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WEBCAM CAMERA MODAL */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="h-5 w-5 text-emerald-400" /> Take Photo Evidence
              </h3>
              <button type="button" onClick={stopCamera} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-black h-64 mb-4 flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                {rt("cancel")}
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
              >
                {rt("snapPhoto")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEBCAM VIDEO MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-400" /> Record Video Evidence
              </h3>
              <button type="button" onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-black h-64 mb-4 flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              {isVideoRecording && (
                <div className="absolute top-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white flex items-center gap-2 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white" /> REC {formatTimer(videoTimer)}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                {rt("cancel")}
              </button>
              <button
                type="button"
                onClick={toggleVideoRecording}
                className={`rounded-xl px-5 py-2 text-xs font-bold text-white shadow-lg ${
                  isVideoRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-400"
                }`}
              >
                {isVideoRecording ? "Stop & Save Video" : "Start Recording"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
          {rt("previous")}
        </button>
        <button type="button" onClick={onNext} className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400">
          {rt("next")}
        </button>
      </div>
    </div>
  );
};

export default Step3Evidence;
