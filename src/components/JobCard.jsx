import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import FancyButton from "./FancyButton";
import InputField from "./InputField";
import API_BASE_URL from "../config";

const JobCard = ({ job }) => {
  const { token, role } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    workExperience: "",
    education: "",
    skills: "",
    coverLetter: null,
    resume: null,
    question1: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast.error("Please fill in all required fields.");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.workExperience || !formData.education || !formData.skills) {
        toast.error("Please fill in all required fields.");
        return false;
      }
    } else if (step === 3) {
      if (!formData.coverLetter || !formData.resume) {
        toast.error("Please upload both a cover letter and resume.");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (role !== "Job Seeker") {
      toast.error("Only Job Seekers can apply for jobs");
      return;
    }

    const data = new FormData();
    data.append("jobId", job._id);
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("linkedin", formData.linkedin);
    data.append("workExperience", formData.workExperience);
    data.append("education", formData.education);
    data.append("skills", formData.skills);
    data.append("coverLetter", formData.coverLetter);
    data.append("resume", formData.resume);
    data.append("question1", formData.question1);

    try {
      await axios.post(`${API_BASE_URL}/api/jobs/apply`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Application submitted successfully!");
      setIsModalOpen(false);
      setStep(1);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        workExperience: "",
        education: "",
        skills: "",
        coverLetter: null,
        resume: null,
        question1: "",
      });
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="relative bg-gray-800/50 dark:bg-gray-700/50 backdrop-blur-md p-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-indigo-500">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      <h3 className="text-2xl font-semibold text-indigo-400 mb-2 relative z-10">{job.title}</h3>
      <p className="text-gray-300 font-medium relative z-10">{job.company}</p>
      <p className="text-gray-400 mt-2 relative z-10">{job.description}</p>
      <div className="mt-4 space-y-1 relative z-10">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-300">Hourly Rate:</span> ${job.hourlyRate}/hr
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-300">Location:</span> {job.location}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-300">Type:</span> {job.jobType}
        </p>
      </div>
      {role === "Job Seeker" && (
        <FancyButton onClick={() => setIsModalOpen(true)} className="mt-4 relative z-10">
          Apply Now
        </FancyButton>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 dark:border-gray-600">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-6">Apply for {job.title}</h3>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className={step >= 1 ? "text-indigo-400 font-semibold" : "text-gray-500"}>
                  Step 1: Basic Info
                </span>
                <span className={step >= 2 ? "text-indigo-400 font-semibold" : "text-gray-500"}>
                  Step 2: Experience
                </span>
                <span className={step >= 3 ? "text-indigo-400 font-semibold" : "text-gray-500"}>
                  Step 3: Documents
                </span>
              </div>
              <div className="w-full bg-gray-700 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              {step === 1 && (
                <>
                  <InputField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    label="LinkedIn Profile URL"
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://www.linkedin.com/in/yourprofile"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Work Experience</label>
                    <textarea
                      name="workExperience"
                      value={formData.workExperience}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800/50 dark:bg-gray-700/50 border border-gray-600 dark:border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      rows="4"
                      placeholder="Describe your relevant work experience..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Education</label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800/50 dark:bg-gray-700/50 border border-gray-600 dark:border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      rows="4"
                      placeholder="List your educational qualifications..."
                      required
                    />
                  </div>
                  <InputField
                    label="Skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., JavaScript, Python, Project Management"
                    required
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Cover Letter</label>
                    <input
                      type="file"
                      name="coverLetter"
                      onChange={handleFileChange}
                      className="w-full p-4 bg-gray-800/50 dark:bg-gray-700/50 border border-gray-600 dark:border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Resume</label>
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      className="w-full p-4 bg-gray-800/50 dark:bg-gray-700/50 border border-gray-600 dark:border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Why do you want to work here? (Optional)
                    </label>
                    <textarea
                      name="question1"
                      value={formData.question1}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800/50 dark:bg-gray-700/50 border border-gray-600 dark:border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      rows="4"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <FancyButton
                    type="button"
                    onClick={handlePrevStep}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Previous
                  </FancyButton>
                )}
                {step < 3 ? (
                  <FancyButton type="button" onClick={handleNextStep}>
                    Next
                  </FancyButton>
                ) : (
                  <FancyButton type="submit">Submit Application</FancyButton>
                )}
                <FancyButton
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </FancyButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;