// const SubSection = require("../models/SubSection");
// const Section = require("../models/Section");
// const Course = require("../models/Course");
// const {uploadImageToCloudinary} = require("../utils/imageUploader");
// require("dotenv").config();

// // create SubSection
// exports.createSubSection = async (req, res) => {
//     try{
//         // fetch data
//         const {sectionId, title , timeDuration, description} = req.body;

//         // extract video files
//         const video = req.files.videoFile;

//         // validation
//         if(!sectionId || !title || !description || !video){
//             return res.status(400).json({
//                 success : false,
//                 message : "All fields are required"
//             });
//         }

//         // upload video to cloudinary 
//         const uploadDetais = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

//         // create subsection
//         const subSectionDetails = await SubSection.create({
//             title:title,
//             description : description,
//             timeDuration : timeDuration,
//             videoUrl : uploadDetais.secure_url
//         });

//         // update section with it subsection id
//         const updatedSection = await Section.findByIdAndUpdate({_id :  sectionId}, {$push : {subSection : subSectionDetails._id}}, {new : true}).populate("subSection");
//         // HW : lof updated section here, ater adding populate query 
//         // return response
//         return res.status(200).json({
//             success : true,
//             message : "SubSection created successfully",
//             data : updatedSection
//         });
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success : false,
//             message : "Something went wrong while creating SubSection"
//         });
//     }
// };

// // HW - update SubSection
// exports.updateSubSection = async (req, res) => {
//     try{
//         // fetch data
//         const updates = req.body;
//         const subSectionId = updates.subSectionId;
//         const sectionId = updates.sectionId;
//         const subSection = await SubSection.findById(subSectionId);

//         if(!subSection){
//           return res.status(404).json({
//             success : false,
//             message : "No Sub Section found!"
//           })
//         }

//         // fetch video file
//         if(req.files){
//           console.log(req.files)
//           const video = req.files.videoFile;
//           const videoUrl = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
//           subSection.videoUrl = videoUrl.secure_url;
//         }

//         // validation
//         // if(!video || !title || !timeDuration || !description || !subSectionId) {
//         //     return res.status(404).json({
//         //         success : false,
//         //         message : "All fields are required"
//         //     });
//         // }

//         // find id and update
//         for(const key in updates) {
//           if(updates.hasOwnProperty(key)){
//             subSection[key] = updates[key]
//           }
//         }

//         await subSection.save();

//         const updatedSection = await Section.findById(sectionId).populate("subSection");

//         // return response
//         return res.status(200).json({
//             success : true,
//             message : "SubSection created successfully",
//             data : updatedSection
//         })
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success : false,
//             message : "Something went wrong while updating Section details"
//         });
//     }
// };

// // HW - delete Subsection
// exports.deleteSubSection = async (req, res) => {
//     try {
//       const { subSectionId, sectionId, courseId } = req.body
//       console.log(subSectionId, sectionId, courseId )
//       await Section.findByIdAndUpdate(
//         { _id: sectionId },
//         {
//           $pull: {
//             subSection: subSectionId,
//           },
//         },
//         {new: true}
//       )
//       await SubSection.findByIdAndDelete({ _id: subSectionId }, {new : true})
      
  
//       // find updated section and return it
//       const updatedSection = await Section.findById(sectionId).populate(
//         "subSection"
//       ).exec();

//       const updatedCourse = await Course.findById({_id : courseId})
//                             .populate({path : "courseContent", 
//                                       populate : {
//                                         path : "subSection"
//                                       }})
//                             .populate({path : "instructor",
//                           populate : {
//                             path : "additionalDetails"
//                           }})
//                           .populate("ratingAndReviews")
//                           .exec();
  
//       return res.status(200).json({
//         success: true,
//         message: "SubSection deleted successfully",
//         // data: updatedCourse,
//         data : updatedSection
//       })
//     } catch (error) {
//       console.error(error)
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while deleting the SubSection",
//       })
//     }
//   }

const SubSection = require("../models/SubSection");
const Section = require("../models/Section");

const { uploadImageToCloudinary } = require('../utils/imageUploader');



// ================ create SubSection ================
exports.createSubSection = async (req, res) => {
    try {
        // extract data
        const { title, description, sectionId } = req.body;

        // extract video file
        const videoFile = req.files.video
        // console.log('videoFile ', videoFile)

        // validation
        if (!title || !description || !videoFile || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // upload video to cloudinary
        const videoFileDetails = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);

        // create entry in DB
        const SubSectionDetails = await SubSection.create(
            { title, timeDuration: videoFileDetails.duration, description, videoUrl: videoFileDetails.secure_url })

        // link subsection id to section
        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
        ).populate("subSection")

        // return response
        res.status(200).json({
            success: true,
            data: updatedSection,
            message: 'SubSection created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating SubSection');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating SubSection'
        })
    }
}



// ================ Update SubSection ================
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;

        // validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'subSection ID is required to update'
            });
        }

        // find in DB
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        // add data
        if (title) {
            subSection.title = title;
        }

        if (description) {
            subSection.description = description;
        }

        // upload video to cloudinary
        if (req.files && req.files.videoFile !== undefined) {
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = uploadDetails.duration;
        }

        // save data to DB
        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        });
    }
    catch (error) {
        console.error('Error while updating the section')
        console.error(error)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while updating the section",
        })
    }
}



// ================ Delete SubSection ================
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )

        // delete from DB
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        const updatedSection = await Section.findById(sectionId).populate('subSection')

        // In frontned we have to take care - when subsection is deleted we are sending ,
        // only section data not full course details as we do in others 

        // success response
        return res.json({
            success: true,
            data: updatedSection,
            message: "SubSection deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,

            error: error.message,
            message: "An error occurred while deleting the SubSection",
        })
    }
}