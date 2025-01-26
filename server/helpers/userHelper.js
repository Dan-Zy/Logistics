import bcrypt from "bcrypt";

const hashPassword = async (passsword) => {

    try {
        const saltedRounds = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(passsword , saltedRounds);
        return hashPassword;
    }

    catch (error) {
        console.log(`ERROR: ${error}`);
    }

};


const comparePassword = async (passsword , hashPassword) => {
    return bcrypt.compare(passsword, hashPassword);
};

export {hashPassword , comparePassword };