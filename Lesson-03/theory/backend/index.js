import express from 'express';

const app = express();

app.use(express.json());

app.get('', (req, res) => {
    res.send({
        message: 'Hello MindX-er'
    });
});

app.get('/users', (req, res) => {
    fetch('http://localhost:3000/users').then((rs) => {
        return rs.json()
    }).then((data) => {
        res.send({
            message: 'Hello MindX-er',
            data
        });
    });
});

app.post('/register', (req, res) => {
    try {
        const {userName, email, passWord} = req.body;
        // kiểm tra dữ liệu đầu vào nhận từ body
        if(!userName) throw new Error('userName is required!');
        if(!email) throw new Error('email is required!');
        if(!password) throw new Error('password is required!');
        
        const newUser = users.push({
            userName,
            email,
            passWord
        });
        res.status(201).send({
            data: newUser,
            success: true,
            error: 'Đăng ký tài khoản thành công'
        });
    } catch (error){
        res.status(403).send({
            data: null,
            success: false,
            error: error.message
        });
    }
});

app.listen(8080, () => {
    console.log('Server is running!');
});
