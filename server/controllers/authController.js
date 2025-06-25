import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// For Register api
export const registerController = async (req, res) => {

    try {
        const { name, email, password, phone, address, answer } = req.body;
        // validations
        if (!name) {
            return res.send({ message: 'Name is required' })
        }
        if (!email) {
            return res.send({ message: 'Email is required' })
        }
        if (!password) {
            return res.send({ message: 'Password is required' })
        }
        if (!address) {
            return res.send({ message: 'Address is required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone is required' })
        }
        if (!answer) {
            return res.send({ message: 'Answer is required' })
        }
        // Check users
        const existingUser = await userModel.findOne({ email });
        // Existing users
        if (existingUser) {
            return res.status(200).send({ success: false, message: 'Already Register please login', })
        }
        // Register user
        const hashedPassword = await hashPassword(password);
        // Save 
        const user = await new userModel({ name, email, address, phone, password: hashedPassword, answer }).save();
        res.status(201).send({ success: true, message: "User register successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Error in Registation", error })
    }
}

// Login api

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validations 
        if (!email || !password) {
            return res.status(404).send({ success: false, message: "Invalid email or password" });
        }
        // check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, message: "Email is not registered" });
        }
        // compare and match the password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({ success: false, message: "Invalid password" });
        }
        // token 
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({
            success: true, message: 'Login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }, token,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}

// forgot password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: 'Email is required' })
        }
        if (!answer) {
            res.status(400).send({ message: 'Answer is required' })
        }
        if (!newPassword) {
            res.status(400).send({ message: 'NewPassword is required' })
        }

        // check user 
        const user = await userModel.findOne({ email, answer });
        // validation 
        if (!user) {
            return res.status(404).send({ success: false, message: 'Wrong email or answer' });
        }
        // hashed new password 
        const hashed = await hashPassword(newPassword);
        // update password 
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({ success: true, message: 'Password Reset Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Something went wrong', error })
    }
}

// testController
export const testController = async (req, res) => {
    res.send("Protected route");
}


// // Update profile 
// export const updateProfileController = async (req, res) => {
//     try {
//         const { name, email, password, address, phone } = req.body;
//         const user = await userModel.findById(req.user._id);
//         // password 
//         if (password && password.length < 6) {
//             return res.json({ error: "Password is required and 6 character long" });
//         }
//         const hashPassword = password ? await hashPassword(password) : undefined
//         const updatedUser = await userModel.findByIdAndUpdate(user._id, {
//             name: name || user.name,
//             password: hashPassword || user.password,
//             phone: phone || user.phone,
//             address: address || user.address
//         }, { new: true });
//         res.status(200).send({ success: true, message: 'User Updated successfully', updatedUser });
//     } catch (error) {
//         console.log(error);
//         res.send(500).send({ success: true, message: 'Update Profile Successfully', error });
//     }
// }

// Update profile 
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        const user = await userModel.findById(req.user._id);

        // Validate password
        if (password && password.length < 6) {
            return res.json({ error: "Password is required and must be at least 6 characters long" });
        }

        // Hash new password if provided
        const hashPasswordValue = password ? await hashPassword(password) : undefined;

        // Update user
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            {
                name: name || user.name,
                password: hashPasswordValue || user.password,
                phone: phone || user.phone,
                address: address || user.address
            },
            { new: true }
        );

        // Generate new token
        const token = await jwt.sign(
            { _id: updatedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Respond with updated user and token
        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            updatedUser,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error updating profile', error });
    }
};
