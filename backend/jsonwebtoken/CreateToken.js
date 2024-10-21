import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken'
configDotenv()
export const CreateToken = async({id}) => {
    const payload = {id:id};
    const secretkey = process.env.secretkey;
    const options= {expiresIn:'1d'};
    const token = jwt.sign(payload,secretkey,options);
    return token;
}
