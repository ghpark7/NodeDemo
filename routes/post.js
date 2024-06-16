const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');
const { Post } = require('../models');

const router = express.Router();

try {
    fs.accessSync('uploads');
} catch (error) {
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// POST /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

// GET /post/:id/delete
router.get('/:id/delete', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});
        if (post) {
            // 게시글의 작성자와 현재 로그인한 사용자가 같은지 확인하는 로직 제거
            await post.destroy();
            res.status(204).send('게시글이 성공적으로 삭제되었습니다.');
        } else {
            res.status(404).send('해당 ID의 게시글이 존재하지 않습니다.');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;