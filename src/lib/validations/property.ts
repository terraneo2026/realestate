import { z } from "zod";

export const propertySchema = z.object({
  // Basic Info
  projectType: z.enum(["existing", "new"]),
  projectId: z.string().optional(),
  newProjectName: z.string().min(3, "Project name must be at least 3 characters").optional(),
  builderName: z.string().min(3, "Builder name must be at least 3 characters").optional(),
  
  category: z.string().min(1, "Category is required"),
  propertyType: z.string().min(1, "Property type is required"),
  ownerName: z.string().min(3, "Owner name must be at least 3 characters"),
  ownerMobile: z.string().regex(/^\d{10}$/, "Invalid contact number (10 digits)"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  budget: z.coerce.number().positive("Budget must be a positive number"),
  type: z.enum(["rent", "lease"]),
  
  // Possession Logic
  possessionType: z.enum(["1m", "3m", "6m", "custom"]),
  possessionDate: z.string().optional(),
  duration: z.coerce.number().optional(),

  // Property Configuration
  furnishing: z.enum(["furnished", "semi-furnished", "unfurnished"]),
  floors: z.coerce.number().min(1, "Number of floors is required"),
  totalBedrooms: z.coerce.number().min(0).default(0),
  bedroomsWithAttachedBath: z.coerce.number().min(0).default(0),
  bedroomsWithoutAttachedBath: z.coerce.number().min(0).default(0),
  kitchens: z.coerce.number().min(0).default(1),
  halls: z.coerce.number().min(0).default(1),
  commonBathrooms: z.coerce.number().min(0).default(0),
  poojaRooms: z.coerce.number().min(0).default(0),
  drawingRooms: z.coerce.number().min(0).default(0),
  customParameters: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1)
  })).optional(),
  
  bedrooms: z.array(z.object({
    type: z.enum([
      "Master Bedroom", 
      "Children’s Bedroom", 
      "Guest Bedroom", 
      "Secondary Bedroom", 
      "Study / Home Office", 
      "Servant Room / Utility Room", 
      "Common Bedroom"
    ]),
    size: z.string().min(1, "Room size is required"),
    flooring: z.string().min(1, "Flooring type is required"),
    wallFinish: z.string().min(1, "Wall finish is required"),
    amenities: z.array(z.string()),
    hasBathroom: z.boolean(),
    bathroom: z.object({
      type: z.enum(["western", "indian"]),
      features: z.array(z.string())
    }).optional()
  })).min(1, "At least one bedroom configuration is required"),

  // Location
  location: z.object({
    doorNo: z.string().min(1, "Door No is required"),
    flatNo: z.string().optional(),
    block: z.string().optional(),
    street: z.string().min(1, "Street is required"),
    area: z.string().min(1, "Area is required"),
    city: z.string().min(1, "City is required"),
    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
    state: z.string().min(1, "State is required"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),

  // Project Level Details
  projectDetails: z.object({
    park: z.boolean().default(false),
    playArea: z.boolean().default(false),
    communityHall: z.boolean().default(false),
    gym: z.boolean().default(false),
    security: z.boolean().default(false),
    lift: z.boolean().default(false),
    powerBackup: z.boolean().default(false),
    waterSupply: z.boolean().default(false),
    totalUnits: z.coerce.number().optional(),
    buildYear: z.coerce.number().optional(),
  }),

  description: z.string().min(50, "Description must be at least 50 characters").max(2000, "Description cannot exceed 2000 characters"),
  
  images: z.array(z.string()).min(4, "Minimum 4 images are mandatory"),
  coverImage: z.string().min(1, "Please select a cover image"),
  amenities: z.array(z.string()).default([]),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const propertyValidationSchema = propertySchema.refine((data) => {
  if (data.type === "rent" && data.duration && data.duration > 11) {
    return false;
  }
  return true;
}, {
  message: "Maximum duration for rent is 11 months",
  path: ["duration"]
}).refine((data) => {
  if (data.projectType === "new" && !data.newProjectName) {
    return false;
  }
  return true;
}, {
  message: "New project name is required",
  path: ["newProjectName"]
});
