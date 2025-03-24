import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

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
    question1: "", // Example question: "Why do you want to work here?"
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
      await axios.post("http://localhost:5000/api/jobs/apply", data, {
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
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-primary">
      <h3 className="text-2xl font-semibold text-primary mb-2">{job.title}</h3>
      <p className="text-gray-700 font-medium">{job.company}</p>
      <p className="text-gray-600 mt-2">{job.description}</p>
      <div className="mt-4 space-y-1">
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Hourly Rate:</span> ${job.hourlyRate}/hr
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Location:</span> {job.location}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Type:</span> {job.jobType}
        </p>
      </div>
      {role === "Job Seeker" && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:shadow-lg transition duration-300"
        >
          Apply Now
        </button>
      )}

      {/* Modal for Job Application */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
            <h3 className="text-2xl font-semibold text-primary mb-6">Apply for {job.title}</h3>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className={step >= 1 ? "text-primary font-semibold" : "text-gray-500"}>
                  Step 1: Basic Info
                </span>
                <span className={step >= 2 ? "text-primary font-semibold" : "text-gray-500"}>
                  Step 2: Documents
                </span>
                <span className={step >= 3 ? "text-primary font-semibold" : "text-gray-500"}>
                  Step 3: Additional Info
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://www.linkedin.com/in/yourprofile"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Work Experience</label>
                    <textarea
                      name="workExperience"
                      value={formData.workExperience}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows="4"
                      placeholder="Describe your relevant work experience..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Education</label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows="4"
                      placeholder="List your educational qualifications..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., JavaScript, Python, Project Management"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                    <input
                      type="file"
                      name="coverLetter"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Resume</label>
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Why do you want to work here? (Optional)
                    </label>
                    <textarea
                      name="question1"
                      value={formData.question1}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows="4"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                  >
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:shadow-lg transition duration-300"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:shadow-lg transition duration-300"
                  >
                    Submit Application
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;