const express = require('express');
const router = express.Router(); //Bunch of routes or set of routes  with diffrent prefix
const taskSchema = require('../schema/task.schema');
const authMiddleware = require('../middleware/auth');

// Creating a Task
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const taskInfo = req.body;
        const user = req.user;
        taskInfo.userId = user._id;
        const task = new taskSchema(taskInfo);
        // console.log(task)
        task.save().then(() => {
            res.status(200).json(task);
        }
        ).catch((e) => {
            next(e);
        });
    }
    catch (e) {
        res.status(400).json({ message: 'Error creating task' });
        next(e);
    }
});

// Route to get all tasks
router.get('/', async (req, res, next) => {
    try {
        const tasks = await taskSchema.find(); // Retrieves all tasks from the collection
        res.json(tasks); // Sends the tasks as a JSON response
    } catch (error) {
        next(error); // Passes the error to the error handling middleware
    }
});

// Get Specified task
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const task = await taskSchema.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'task not found' });
        }
        res.json(task);
    }
    catch (e) {
        next(e);
    }
});


//Update the task
router.patch("/:id", authMiddleware, async (req, res, next) => {
    try {
        const id = req.params.id; 
        const task = await taskSchema.findById(id);


        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const taskCreator = task.userId.toString();
        console.log("taskCreator",taskCreator)
        const user = req.user._id.toString();
        console.log("user",user)
        
        if (taskCreator !== user) {  // check if the user is the creator of the task
            return res.status(403).json({ message: 'You are not authorized to delete this task' });
        }

        const taskInfo = req.body;
        // console.log(taskInfo)

        // Update the task and handle potential validation errors
        const updatedTask = await taskSchema.findByIdAndUpdate(id, taskInfo, {
            runValidators: true,
            new: true
        });

        if (!updatedTask) {
            return res.status(400).json({ message: 'Failed to update task' });
        }

        res.status(200).json(updatedTask);
    } catch (e) {
        console.error("Error updating task:", e.message, e); // Logs detailed error
        return res.status(500).json({ message: e.message || 'Server error' });
    }
});


// Deleting a task
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        console.log(req.user)
        const id = req.params.id;
        const task = await taskSchema.findById(id);
        // console.log(task)
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const taskCreator = task.userId.toString();
        console.log("taskCreator",taskCreator)
        const user = req.user._id.toString();
        console.log("user",user)
        
        if (taskCreator !== user) {  // check if the user is the creator of the task
            return res.status(403).json({ message: 'You are not authorized to delete this task' });
        }
        
        await taskSchema.findByIdAndDelete(id);
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (e) {
        next(e);
    }
});


module.exports = router;




// Update task // Chat gpt
// exports.updateTask = async (req, res) => {
//   const task = await Task.findById(req.params.id);

//   if (task) {
//     task.title = req.body.title || task.title;
//     task.status = req.body.status || task.status;
//     task.priority = req.body.priority || task.priority;
//     task.dueDate = req.body.dueDate || task.dueDate;

//     const updatedTask = await task.save();
//     res.json(updatedTask);
//   } else {
//     res.status(404).json({ message: 'Task not found' });
//   }
// };

// // filter 
// // 1. no filter 
// // 2. filter by skills 
// // 3. filter by keywords 

// //To test pass this route: http://localhost:3000/v1/job?skills=python,react&keywords=developer
// router.get('', async (req, res, next) => {
//     try {
//         const { skills } = req.query;  // send paramaters like skills filter or keywords query //
//         const filter = {};
//         if (skills) {
//             const skillsArray = skills.split(',').map(skill => skill.trim());
//             filter.skills = { $in: skillsArray };  // $in means that find jobs that have at least one of the skills in the skillsArray
//         }
//         // if (keywords) {
//         //     filter.title = { $search: keywords };  // find jobs that have a title that contains the keywords
//         // }
//         const jobs = await jobSchema.find(filter);
//         res.json(jobs);
//     }
//     catch (e) {
//         next(e);
//     }
// })

