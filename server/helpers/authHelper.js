import bcrypt from 'bcrypt';

//For password hash
export const hashPassword = async (password) => {
    try {
        const setRounds = 10;
        const hashPassword = await bcrypt.hash(password, setRounds);
        return hashPassword;
    } catch (error) {
        console.log(error);
    }
}

// For password compare 

export const comparePassword = async (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
}

