import mongoose from "mongoose";

const testsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'People',
    },
    date: {
        type: String,
        required: true,
    },
    docnumber: {
        type: String,
        default: ""
    },
    names:
    {
        type: String,
        default: ""
    },
    company: {
        type: String,
        default: ""
    },
    dominanthand: {
        type: String,
        default: ""
    },
    mineplacementtime1: {
        type: String,
        default: ""
    },
    mineplacementtime2: {
        type: String,
        default: ""
    },
    mineplacementtotal: {
        type: String,
        default: ""
    },
    mineplacementscale: {
        type: String,
        default: ""
    },
    minerotationtime1: {
        type: String,
        default: ""
    },
    minerotationtime2: {
        type: String,
        default: ""
    },
    minerotationtotal: {
        type: String,
        default: ""
    },
    minerotationscale: {
        type: String,
        default: ""
    },
    minedisplacementtime1: {
        type: String,
        default: ""
    },
    minedisplacementtime2: {
        type: String,
        default: ""
    },
    minedisplacementtotal: {
        type: String,
        default: ""
    },
    minedisplacementscale: {
        type: String,
        default: ""
    },
    mineobservations: {
        type: String,
        default: ""
    },
    purdedominanthand: {
        type: String,
        default: ""
    },
    purdedominanthandscale: {
        type: String,
        default: ""
    },
    purdenodominanthand: {
        type: String,
        default: ""
    },
    purdenodominanthandscale: {
        type: String,
        default: ""
    },
    purdebothhands: {
        type: String,
        default: ""
    },
    purdebothhandsscale: {
        type: String,
        default: ""
    },
    purdeassemble: {
        type: String,
        default: ""
    },
    purdeassemblescale: {
        type: String,
        default: ""
    },
    purdeobservations: {
        type: String,
        default: ""
    },
    activityjtest: {
        type: String,
        default: ""
    },
    activityjtestscale: {
        type: String,
        default: ""
    },
    activityjtestobservations: {
        type: String,
        default: ""
    },
    reaction1: {
        type: String,
        default: ""
    },
    reaction1scale: {
        type: String,
        default: ""
    },
    reaction2: {
        type: String,
        default: ""
    },
    reaction2scale: {
        type: String,
        default: ""
    },
    reactionobservations: {
        type: String,
        default: ""
    },
    fingers: {
        type: String,
        default: ""
    },
    fingersscale: {
        type: String,
        default: ""
    },
    fingersobservations: {
        type: String,
        default: ""
    },
    ishinormalvision: {
        type: String,
        default: ""
    },
    ishideuteranopia: {
        type: String,
        default: ""
    },
    ishiportanopia: {
        type: String,
        default: ""
    },
    ishidaltonism: {
        type: String,
        default: ""
    },
    ishiobservations: {
        type: String,
        default: ""
    },
    startime: {
        type: String,
        default: ""
    },
    starTimeOne: {
        type: String,
        default: ""
    },
    startoucherrors: {
        type: String,
        default: ""
    },
    starTouchErrorsOne: {
        type: String,
        default: ""
    },
    wireGameTime: {
        type: String,
        default: ""
    },
    wireGameError: {
        type: String,
        default: ""
    }, 
    wireGameLevel: {
        type: String,
        default: ""
    },
    visualAcuity: {
        type: String,
        default: ""
    }, 
    visualAcuityLevel: {
        type: String,
        default: ""
    }
}, {
    timestamps: false
});

export default mongoose.model("Tests", testsSchema);