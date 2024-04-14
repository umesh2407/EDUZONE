const express = require("express")
const router = express.Router()

const { auth, isInstructor } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getUserDetails,
  updateUserProfileImage,
  getEnrolledCourses,
  instructorDashboard
} = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateUserProfileImage)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router