const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true, default: "TODO"},
    priority: { type: String, enum: ['low', 'moderate', 'high'], required: true },
    assign: { type: String, default: "" },
    // checklist: { type: [{ item: String, completed: Boolean }], default: [] },
    checklist: [{ item: { type: String, required: true }, completed: { type: Boolean, default: false } }],
    dueDate: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: { type: Date, default: Date.now}
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     // priority: { type: String, enum: ['low', 'moderate', 'high'], required: true },
//     priority: { type: String, enum: ['low', 'moderate', 'high'], required: true},
//     assign : { type: String},
//     checklist : {type: Object},
//     dueDate: { type: Date },
//     // assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Task', taskSchema);
