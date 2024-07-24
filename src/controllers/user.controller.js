import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // Get user details from frontend
    // Validation of user details - not empty
    // Check if user already exists: username, email
    // Check for images, check for avatar
    // Upload images to cloudinary, avatar.
    // Create User Object - create entry in db
    // Remove password and refresh token field from response
    // Check for User Creation 
    // Return Response

     const {fullname, email, username, password} = req.body
     console.log("email", email)

    if (
        [fullname, email, username, password].some((field) => field?.trim()==="")
    ) {
        throw new ApiError(
            "All fields are required",
            400
        )
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(
            "User with email or username already exists",
            409
        )
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar is needed"
        )
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar is needed"
        )
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }
    
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created sucessfully")
    )
})


export { registerUser }