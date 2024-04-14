// const Section = require("../models/Section");
// const Course = require("../models/Course");
// const SubSection = require("../models/SubSection");
// const { default: mongoose } = require("mongoose");

// // create section
// exports.createSection = async (req, res) =>{
//     try{
//         // data fetch
//         const {sectionName, courseId} = req.body;

//         // data validation
//         if(!sectionName || !courseId){
//             return res.status(400).json({
//                 success : false,
//                 message : "All fields are required"
//             });
//         }
        
//         // create secction
//         const newSection = await Section.create({sectionName});

//         // update course with section Objectid
//         const updatedCourseDetails = await Course.findByIdAndUpdate(
//             courseId, {$push : {courseContent : newSection._id}},{new:true}
//         )
//         .populate({
//             path: "courseContent",
//             populate: {
//                 path: "subSection",
//                 model : "SubSection"
//             }
//         })
//         .exec();
//         //to populate both sections and subsection use:- .populate({path:"courseContent", populate : {path: "subSection", model: "SubSection"}}).exec();
        
//         // return response
//         res.status(200).json({
//             success : true,
//             message : "Section created successfully",
//             data : updatedCourseDetails
//         });
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success : false,
//             message : "Something went wrong while crating section"
//         });
//     }
// }

// // update section
// exports.updateSection = async (req, res) => {
//     try{
//         // fetch data
//         const {sectionName, sectionId, courseId} = req.body;

//         // data validation
//         if(!sectionName || !sectionId){
//             return res.status(400).json({
//                 success : false,
//                 message : "All fields are required"
//             });
//         }

//         // update data
//         const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new : true});

//         const course = await Course.findById(courseId).populate({
//             path : "courseContent",
//             populate : {
//                 path : "subSection"
//             }
//         }).exec();

//         // return response
//         return res.status(200).json({
//             success : true,
//             message : "Section updated successfully",
//             data : course
//         });
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success : false,
//             message : "Something went wrong while updating section"
//         });
//     }
// }

// // delete section
// exports.deleteSection = async (req, res) => {
// 	try {

// 		const { sectionId, courseId }  = req.body;
//         console.log("Section : ",sectionId, "Course : " , courseId);
// 		await Course.findByIdAndUpdate(courseId, {
// 			$pull: {
// 				courseContent: sectionId
// 			}
// 		})
// 		const section = await Section.findById(sectionId);
		
// 		if(!section) {
// 			return res.status(404).json({
// 				success:false,
// 				message:"Section not Found",
// 			})
// 		}

// 		//delete sub section
// 		await SubSection.deleteMany({_id: {$in: section.subSection}});

// 		await Section.findByIdAndDelete(sectionId);

// 		//find the updated course and return 
// 		const course = await Course.findById(courseId).populate({
// 			path:"courseContent",
// 			populate: {
// 				path: "subSection"
// 			}
// 		})
// 		.exec();

// 		res.status(200).json({
// 			success:true,
// 			message:"Section deleted",
// 			data:course
// 		});
// 	} catch (error) {
// 		console.error("Error deleting section:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 		});
// 	}
// };   

const Section = require("../models/Section");
const Course = require("../models/Course");

// ================ create Section ================
exports.createSection = async (req, res) => {
    try {
        // extract data 
        const { sectionName, courseId } = req.body;
        // console.log('sectionName, courseId = ', sectionName, ",  = ", courseId)

        // validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // create entry in DB
        const newSection = await Section.create({ sectionName });

        // link - section id to current course 
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            { new: true }
        );

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }

            })

        // above -- populate remaining 

        res.status(200).json({
            success: true,
            updatedCourseDetails,
            message: 'Section created successfully'
        })
    }

    catch (error) {
        console.log('Error while creating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating section'
        })
    }
}


// ================ update Section ================
exports.updateSection = async (req, res) => {
    try {
        // extract data
        const { sectionName, sectionId, courseId } = req.body;

        // validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // update section name in DB
        await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })

        res.status(200).json({
            success: true,
            data:updatedCourseDetails,
            message: 'Section updated successfully'
        });
    }
    catch (error) {
        console.log('Error while updating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating section'
        })
    }
}



// ================ Delete Section ================
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;
        // console.log('sectionId = ', sectionId);

        // delete section by id from DB
        await Section.findByIdAndDelete(sectionId);

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })

        res.status(200).json({
            success: true,
            data: updatedCourseDetails,
            message: 'Section deleted successfully'
        })
    }
    catch (error) {
        console.log('Error while deleting section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while deleting section'
        })
    }
}
