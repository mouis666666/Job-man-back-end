import  Router  from 'express';
import * as Job_service from "./services/Job_service.js"
import { error_handler_middleware } from './../../middlewares/error_handler_middleware.js';
import { authentication_middleware, authorization_middleware } from '../../middlewares/auth_middleware.js';
// import { system_role } from '../../constants/constants.js';
const Job_controller = Router()


// const { USER ,  ADMIN  }  = system_role

Job_controller.use(authentication_middleware())




// 1. Add Job
Job_controller.post("/jobs", error_handler_middleware(Job_service.addJob));

// 2. Update Job
Job_controller.patch("/jobs/:jobId", error_handler_middleware(Job_service.updateJob));

// 3. Delete Job
Job_controller.delete("/jobs/:jobId", error_handler_middleware(Job_service.deleteJob));

// 4. Get all Jobs or a specific one for a specific company
Job_controller.get("/companies/:companyId/jobs", error_handler_middleware(Job_service.getJobsForCompany));

// 5. Get all Jobs with filters
Job_controller.get("/jobs", error_handler_middleware(Job_service.getJobsWithFilters));

// 6. Get all applications for a specific Job
Job_controller.get("/jobs/:jobId/applications", error_handler_middleware(Job_service.getApplicationsForJob));

// 7. Apply to Job
Job_controller.post("/jobs/:jobId/apply", error_handler_middleware(Job_service.applyToJob));

// 8. Accept or Reject an Applicant
Job_controller.patch("/applications/:applicationId", error_handler_middleware(Job_service.acceptOrRejectApplicant));

export default Job_controller

