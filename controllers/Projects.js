import Projects from '../models/ProjectModel.js';
import Users from '../models/UserModel.js';
import path from 'path';
import fs from 'fs';

export const getProjects = async (req, res) => {
    try {
        const response = await Projects.findAll({
            attributes: ['uuid', 'name', 'src', 'url'],
            include: [
                {
                    model: Users,
                    attributes: ['name', 'email'],
                },
            ],
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const getProjectById = async (req, res) => {
    try {
        const response = await Projects.findOne({
            attributes: ['uuid', 'name', 'src', 'url'],
            where: {
                uuid: req.params.id,
            },
            include: [
                {
                    model: Users,
                    attributes: ['name', 'email'],
                },
            ],
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const createProject = (req, res) => {
    if (req.files === null)
        return res.status(400).json({ msg: 'No File Uploaded' });
    const name = req.body.title;
    const url = req.body.url;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const src = `${req.protocol}://${req.get('host')}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: 'Invalid Images' });
    if (fileSize > 10000000)
        return res.status(422).json({ msg: 'Image must be less than 10 MB' });

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Projects.create({
                name: name,
                url: url,
                image: fileName,
                src: src,
                userId: req.userId,
            });
            res.status(201).json({ msg: 'Product Created Successfully' });
        } catch (error) {
            console.log(error.message);
        }
    });
};

export const updateProject = async (req, res) => {
    const project = await Projects.findOne({
        where: {
            uuid: req.params.id,
        },
    });
    if (!project) return res.status(404).json({ msg: 'No Data Found' });

    let fileName = '';
    if (req.files === null) {
        fileName = Projects.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase()))
            return res.status(422).json({ msg: 'Invalid Images' });
        if (fileSize > 10000000)
            return res
                .status(422)
                .json({ msg: 'Image must be less than 10 MB' });

        const filepath = `./public/images/${project.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    const name = req.body.title;
    const url = req.body.url;
    const src = `${req.protocol}://${req.get('host')}/images/${fileName}`;

    try {
        await Projects.update(
            {
                name: name,
                url: url,
                image: fileName,
                src: src,
            },
            {
                where: {
                    uuid: req.params.id,
                },
            }
        );

        res.status(200).json({ msg: 'Projects Updated Succesfully' });
    } catch (error) {
        console.log(error.message);
    }
};

export const deleteProject = async (req, res) => {
    const project = await Projects.findOne({
        where: {
            uuid: req.params.id,
        },
    });
    if (!project) return res.status(404).json({ msg: 'No Data Found' });

    try {
        const filepath = `./public/images/${project.image}`;
        fs.unlinkSync(filepath);
        await Projects.destroy({
            where: {
                uuid: req.params.id,
            },
        });
        res.status(200).json({ msg: 'Project Deleted Successfully' });
    } catch (error) {
        console.log(error.message);
    }
};
