import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(

    {
        username: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          required: true,
          trim: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "user", "editor"], // Define los posibles roles
          default: "user", // Rol por defecto
        },
        
      },
      {
        timestamps: true,
      }
    );
    
    export default mongoose.model("User", UserSchema);