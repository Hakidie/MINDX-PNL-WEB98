import bcrypt from 'bcrypt';
import CustomersModel from '../models/customers.js';
import { generateApiKey } from '../controllers/customerController.js';

export const registerCustomer = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;

    // Check fields
    if (!name || !email || !age || !password) {
      return res.status(400).json({ message: "Name, email, age and password are required" });
    }

    // Check email unique
    const existedEmail = await CustomersModel.findOne({ email: email })
    if (existedEmail) {
        return res.status(409).json({ message: "Email existed" });
    }

    // Generate new Id
    const lastCustomer = await CustomersModel.findOne().sort({ _id: -1 });
    const lastId = lastCustomer ? parseInt(lastCustomer._id.replace('c', '')) : 0;
    const newId = `c${String(lastId + 1).padStart(3, '0')}`;


    // Create random string
    const salt = bcrypt.genSaltSync(10);
    // Hashing
    const hash = bcrypt.hashSync(password, salt);

    const newCustomer = await CustomersModel.create({
        _id: newId,
        name: name,
        email: email,
        age: age,
        password: hash,
        salt: salt
    });

    res.status(201).send({
      message: 'Register with hash password!',
      data: { _id: newCustomer._id, name: newCustomer.name, email: newCustomer.email },
      success: true
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false
    });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    // tìm thông tin user | tài khoản với email được gửi lên
    const currentCustomer = await CustomersModel.findOne({ email: email });
    if (!currentCustomer) throw new Error("Wrong email or password!");

    const hashingPasswordLogin = bcrypt.hashSync(password, currentCustomer.salt);
    // compare password
    if (hashingPasswordLogin !== currentCustomer.password) throw new Error("Wrong email or password");

    const apiKey = await generateApiKey(currentCustomer);

    res.status(200).send({
      message: 'Login successfully!',
      email,
      name: currentCustomer.name,
      apiKey: apiKey,
      success: true
    });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};
