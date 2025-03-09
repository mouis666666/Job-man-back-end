

import company_model from "../../../DB/models/company_model.js";
import user_model from "../../../DB/models/user_model.js";
import job_opportunity_model from "../../../DB/models/Job_opportunity_model.js";
import application_model from './../../../DB/models/Application_model.js';

/**
 * 1. Add Job 
    - created by company HR or company owner
2. Update Job
    - ensure that only the owner can perform this
3. Delete Job
    - ensure that only the company HR related to the job company
4. Get all Jobs or a specific one for a specific company. 
    - using merge params and optional params
    - use pagination (skip , limit , sort (ex. by createdAt) and total count )
    - user can search for company by it’s name
5. Get all Jobs that match the following filters and if no filters apply then get all jobs (👀)
    - use pagination (skip , limit , sort (ex. by createdAt) and total count )
    - allow user to filter with workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
6. Get all applications for specific Job.
    - use virtual populate
    - Each company Owner or company hr can take a look at the applications
    - use pagination (skip , limit , sort (ex. by createdAt) and total count )
    - Return each application with the user data, not the userId
7. Apply to Job (Job application) ( socit io mo66 )
    - apply authorization with the role ( User )
    - Emit a socket event to notify the HR that a new application has been submitted
8. Accept or Reject an Applicant
    - HR can accept or reject a candidate.
    - If the application is accepted, send an acceptance email to the applicant.
    - If the application is rejected, send an rejection email to the applicant.
 * */ 


    
    // 1. Add Job
    export const addJob = async (req, res) => {
      const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId } = req.body;
      const userId = req.user._id;
    
      try {
        const company = await company_model.findOne({ _id: companyId, approvedByAdmin: true, bannedAt: null });
        if (!company) {
          return res.status(404).send({ message: "Company not found or not approved or banned" });
        }
    
        const user = await user_model.findOne({ _id: userId, bannedAt: null });
        if (!user) {
          return res.status(404).send({ message: "User not found or banned" });
        }
    
        if (!company.HRs.includes(userId) && company.createdBy.toString() !== userId.toString()) {
          return res.status(403).send({ message: "Only company HR or owner can add a job" });
        }
    
        const newJob = new job_opportunity_model({
          jobTitle,
          jobLocation,
          workingTime,
          seniorityLevel,
          jobDescription,
          technicalSkills,
          softSkills,
          addedBy: userId,
          companyId,
        });
    
        await newJob.save();
        res.status(201).send({ message: "Job added successfully", job: newJob });
      } catch (error) {
        res.status(500).send({ message: "Error adding job", error: error.message });
      }
    };
    
    // 2. Update Job
    export const updateJob = async (req, res) => {
      const { jobId } = req.params;
      const updates = req.body;
      const userId = req.user._id;
    
      try {
        const job = await job_opportunity_model.findById(jobId);
        if (!job) {
          return res.status(404).send({ message: "Job not found" });
        }
    
        const company = await company_model.findOne({ _id: job.companyId, approvedByAdmin: true, bannedAt: null });
        if (!company) {
          return res.status(404).send({ message: "Company not found or not approved or banned" });
        }
    
        if (company.createdBy.toString() !== userId.toString()) {
          return res.status(403).send({ message: "Only the company owner can update the job" });
        }
    
        Object.assign(job, updates);
        await job.save();
        res.status(200).send({ message: "Job updated successfully", job });
      } catch (error) {
        res.status(500).send({ message: "Error updating job", error: error.message });
      }
    };
    
    // 3. Delete Job
    export const deleteJob = async (req, res) => {
      const { jobId } = req.params;
      const userId = req.user._id;
    
      try {
        const job = await job_opportunity_model.findById(jobId);
        if (!job) {
          return res.status(404).send({ message: "Job not found" });
        }
    
        const company = await company_model.findOne({ _id: job.companyId, approvedByAdmin: true, bannedAt: null });
        if (!company) {
          return res.status(404).send({ message: "Company not found or not approved or banned" });
        }
    
        if (!company.HRs.includes(userId)) {
          return res.status(403).send({ message: "Only company HR can delete the job" });
        }
    
        await job.remove();
        res.status(200).send({ message: "Job deleted successfully" });
      } catch (error) {
        res.status(500).send({ message: "Error deleting job", error: error.message });
      }
    };
    
    // 4. Get all Jobs or a specific one for a specific company
    export const getJobsForCompany = async (req, res) => {
      const { companyId } = req.params;
      const { skip = 0, limit = 10, sort = "-createdAt", search } = req.query;
    
      try {
        const company = await company_model.findOne({ _id: companyId, approvedByAdmin: true, bannedAt: null });
        if (!company) {
          return res.status(404).send({ message: "Company not found or not approved or banned" });
        }
    
        const query = { companyId };
        if (search) {
          query.jobTitle = { $regex: search, $options: "i" };
        }
    
        const jobs = await job_opportunity_model.find(query)
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .sort(sort);
    
        const totalCount = await job_opportunity_model.countDocuments(query);
        res.status(200).send({ jobs, totalCount });
      } catch (error) {
        res.status(500).send({ message: "Error fetching jobs", error: error.message });
      }
    };
    
    // 5. Get all Jobs with filters
    export const getJobsWithFilters = async (req, res) => {
      const { skip = 0, limit = 10, sort = "-createdAt", workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;
    
      try {
        const query = {};
        if (workingTime) query.workingTime = workingTime;
        if (jobLocation) query.jobLocation = jobLocation;
        if (seniorityLevel) query.seniorityLevel = seniorityLevel;
        if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: "i" };
        if (technicalSkills) query.technicalSkills = { $in: technicalSkills.split(",") };
    
        const jobs = await job_opportunity_model.find(query)
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .sort(sort);
    
        const totalCount = await job_opportunity_model.countDocuments(query);
        res.status(200).send({ jobs, totalCount });
      } catch (error) {
        res.status(500).send({ message: "Error fetching jobs", error: error.message });
      }
    };
    
    // 6. Get all applications for a specific Job
    export const getApplicationsForJob = async (req, res) => {
      const { jobId } = req.params;
      const { skip = 0, limit = 10, sort = "-createdAt" } = req.query;
      const userId = req.user._id;
    
      try {
        const job = await job_opportunity_model.findById(jobId);
        if (!job) {
          return res.status(404).send({ message: "Job not found" });
        }
    
        const company = await company_model.findOne({ _id: job.companyId, approvedByAdmin: true, bannedAt: null });
        if (!company) {
          return res.status(404).send({ message: "Company not found or not approved or banned" });
        }
    
        if (!company.HRs.includes(userId) && company.createdBy.toString() !== userId.toString()) {
          return res.status(403).send({ message: "Only company HR or owner can view applications" });
        }
    
        const applications = await Application.find({ jobId })
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .sort(sort)
          .populate("userId", "firstName lastName email profilePic");
    
        const totalCount = await Application.countDocuments({ jobId });
        res.status(200).send({ applications, totalCount });
      } catch (error) {
        res.status(500).send({ message: "Error fetching applications", error: error.message });
      }
    };
    
    // 7. Apply to Job
    export const applyToJob = async (req, res) => {
      const { jobId } = req.params;
      const { userCV } = req.body;
      const userId = req.user._id;
    
      try {
        const job = await Job.findById(jobId);
        if (!job) {
          return res.status(404).send({ message: "Job not found" });
        }
    
        const company = await Company.findOne({ _id: job.companyId, approvedByAdmin: true, bannedAt: null });
        if (!company) {
          return res.status(404).send({ message: "Company not found or not approved or banned" });
        }
    
        const user = await User.findOne({ _id: userId, bannedAt: null });
        if (!user) {
          return res.status(404).send({ message: "User not found or banned" });
        }
    
        if (user.role !== "User") {
          return res.status(403).send({ message: "Only users can apply to jobs" });
        }
    
        const newApplication = new Application({
          jobId,
          userId,
          userCV,
        });
    
        await newApplication.save();
    
        
    
        res.status(201).send({ message: "Application submitted successfully", application: newApplication });
      } catch (error) {
        res.status(500).send({ message: "Error submitting application", error: error.message });
      }
    };
    
    // 8. Accept or Reject an Applicant
    export const acceptOrRejectApplicant = async (req, res) => {
      const { applicationId } = req.params;
      const { status } = req.body;
      const userId = req.user._id;
    
        const application = await application_model.findById(applicationId).populate("jobId");
        if (!application) {
          return res.status(404).send({ message: "Application not found" });
        }
    
        const company = await company_model.findOne({ _id: application.jobId.companyId, approvedByAdmin: true, bannedAt: null });
        if (!company) {
          return res.status(404).send({ message: "Company not found or not approved or banned" });
        }
    
        if (!company.HRs.includes(userId)) {
          return res.status(403).send({ message: "Only company HR can accept or reject applications" });
        }
    
        application.status = status;
        await application.save();
    
        const user = await user_model.findById(application.userId);
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
    
        
    
        res.status(200).send({ message:` Application ${status} successfully `, application });

    };