// const Category = require("../models/Category");
// const mongoose = require("mongoose");

// function getRandomInt(max) {
//     return Math.floor(Math.random() * max)
// }

// // Create Category handler function
// exports.createCategory = async (req, res) => {
//     try{
//         // Fetch data from req body
//         const {name, description} = req.body;
//         // Validation
//         if(!name){
//             return res.status(400).json({
//                 success : false,
//                 message : "All fields are required"
//             });
//         }

//         // create entry in db
//         const categoryDetails = await Category.create({
//             name : name,
//             description : description
//         });
//         console.log(categoryDetails);

//         // return response
//         return res.status(200).json({
//             success : true,
//             message : "Category created successfullly"
//         });
//     }catch{
//         return res.status(500).json({
//             success : false,
//             message : "Error whaile creating Category",
//             error : error.message
//         });
//     }
// };

// // Get all Categories
// exports.showAllCategories = async (req, res) =>{
//     try{
//         const allCategories = await Category.find(
//             {}, 
//             {name : true, description: true}
//             );
//         res.status(200).json({
//             success : true,
//             message : "All Categories returned successfully",
//             data : allCategories
//         });
//     }catch(error){
//         return res.status(500).json({
//             success : false,
//             message : "Something went wrong while showing Categories",
//             error : error.message
//         });
//     }
// };

// // Category page details
// exports.categoryPageDetails = async (req, res) => {
//     try{
//         // get category id
//         const {categoryId} = req.body;
//         // console.log("At server", categoryId);

//         if( !categoryId ) {
//             return res.status(404).json({
//                 success : false,
//                 message : "CategoryId is undefined",
//                 error : error.message
//             })
//         }

//         // get courses for specified category id
//         const selectedCategory = await Category.findById(categoryId)
//         .populate({
//           path: "courses",
//         //   match: { status: "Published" },
//           populate: "ratingAndReviews",
//           populate: {
//             path: "instructor",
//         },
//         }).exec();
//         console.log("Selected Category",selectedCategory.courses)
//         console.log("Selected category length",selectedCategory.courses.length);

//         // validation
//         if(!selectedCategory){
//             return res.status(404).json({
//                 success : false,
//                 message : "Data not found"
//             })
//         }

//         // Handle the case when there are no courses
//         if (selectedCategory.courses.length === 0) {
//             console.log("No courses found for the selected category.")
//             return res.status(404).json({
//               success: false,
//               message: "No courses found for the selected category.",
//             })
//         }

//         // get courses for different category
//         const categoriesExceptSelected = await Category.find(
//             {
//                 _id :{$ne : categoryId}
//             });
        
//         let differentCategory = await Category.findOne(
//             categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
//         )
//         .populate({
//             path: "courses",
//             // match: { status: "Published" },
//             populate: {
//                 path: "instructor",
//             },
//         })
//         .exec();

//         // get top 10 selling courses -HW
//         const allCategories = await Category.find()
//         .populate({
//           path: "courses",
//         //   match: { status: "Published" },
//           populate: {
//             path: "instructor",
//         },
//         })
//         .exec();

//         const allCourses = allCategories.flatMap((category) => category.courses)
//         const mostSellingCourses = allCourses.sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length).slice(0, 10)
        
//         // return response
//         return res.status(200).json({
//             success : true,
//             data : {
//                 selectedCategory,
//                 differentCategory,
//                 mostSellingCourses,
//             }
//         });
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success : false,
//             message : error.message
//         });
//     }
// }

const Category = require("../models/Category");

// get Random Integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// ================ create Category ================
exports.createCategory = async (req, res) => {
    try {
        // extract data
        const { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const categoryDetails = await Category.create({
            name: name, description: description
        });

        res.status(200).json({
            success: true,
            message: 'Category created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Category',
            error: error.message
        })
    }
}


// ================ get All Category ================
exports.showAllCategories = async (req, res) => {
    try {
        // get all category from DB
        const allCategories = await Category.find({}, { name: true, description: true });

        // return response
        res.status(200).json({
            success: true,
            data: allCategories,
            message: 'All allCategories fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching all allCategories');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all allCategories'
        })
    }
}



// ================ Get Category Page Details ================
exports.getCategoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        console.log("PRINTING CATEGORY ID: ", categoryId);

        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec()

        // console.log('selectedCategory = ', selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
            // console.log("Category not found.")
            return res.status(404).json({ success: false, message: "Category not found" })
        }



        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            // console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                data: null,
                message: "No courses found for the selected category.",
            })
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec()

        //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}