import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  MANUFACTURER: "manufacturer",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.MANUFACTURER),
);
export type Role = Infer<typeof roleValidator>;

// Medicine verification status
export const VERIFICATION_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;

export const verificationStatusValidator = v.union(
  v.literal(VERIFICATION_STATUS.PENDING),
  v.literal(VERIFICATION_STATUS.VERIFIED),
  v.literal(VERIFICATION_STATUS.REJECTED),
  v.literal(VERIFICATION_STATUS.EXPIRED),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Additional fields for manufacturers and users
      companyName: v.optional(v.string()),
      walletAddress: v.optional(v.string()),
      isVerified: v.optional(v.boolean()),
      
      // User profile fields
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      dateOfBirth: v.optional(v.string()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Medicines table - stores NFT medicine data
    medicines: defineTable({
      tokenId: v.string(), // NFT token ID from blockchain (Batch ID)
      medicineName: v.string(),
      manufacturerName: v.string(),
      manufacturerId: v.id("users"),
      batchNumber: v.string(),
      medicineType: v.string(), // tablet, syrup, injection, etc.
      manufacturingDate: v.string(),
      expiryDate: v.string(),
      mrp: v.number(),
      quantity: v.number(),
      qrCodeData: v.string(), // QR code content for the batch
      transactionHash: v.string(), // Blockchain transaction hash
      contractAddress: v.string(), // Smart contract address
      isActive: v.boolean(),
    })
      .index("by_manufacturer", ["manufacturerId"])
      .index("by_batch", ["batchNumber"])
      .index("by_token_id", ["tokenId"])
      .index("by_qr_code", ["qrCodeData"]),

    // Individual Medicine Units
    medicine_units: defineTable({
      medicineId: v.id("medicines"),
      tokenId: v.string(), // Unique Token ID for this unit
      serialNumber: v.number(), // 1 to N
      qrCodeData: v.string(), // Unique QR code content
      isVerified: v.boolean(),
      status: v.optional(v.string()), // "minted", "sold", "consumed"
    })
      .index("by_medicine", ["medicineId"])
      .index("by_token_id", ["tokenId"])
      .index("by_qr_code", ["qrCodeData"]),

    // Scan history - tracks all QR code scans
    medicineScans: defineTable({
      medicineId: v.optional(v.id("medicines")),
      unitId: v.optional(v.id("medicine_units")), // Link to specific unit
      userId: v.optional(v.id("users")),
      imageStorageId: v.id("_storage"),
      scanResult: v.object({
        medicineName: v.optional(v.string()),
        confidence: v.number(),
        detectedText: v.optional(v.string()),
        isVerified: v.boolean(),
        matchedMedicineId: v.optional(v.id("medicines")),
      }),
      scanDate: v.number(),
      location: v.optional(v.string()),
      deviceInfo: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
    })
      .index("by_medicine", ["medicineId"])
      .index("by_user", ["userId"]),

    // Counterfeit reports
    reports: defineTable({
      medicineId: v.optional(v.id("medicines")),
      reporterId: v.optional(v.id("users")),
      qrCodeData: v.optional(v.string()),
      medicineName: v.optional(v.string()),
      batchNumber: v.optional(v.string()),
      reason: v.string(),
      description: v.optional(v.string()),
      location: v.optional(v.string()),
      status: v.string(), // "pending", "reviewed", "resolved"
      reviewedBy: v.optional(v.id("users")),
      reviewNotes: v.optional(v.string()),
    })
      .index("by_status", ["status"])
      .index("by_reporter", ["reporterId"]),

    // Batches - for bulk medicine creation
    batches: defineTable({
      batchNumber: v.string(),
      manufacturerId: v.id("users"),
      medicineCount: v.number(),
      status: v.string(), // "processing", "completed", "failed"
      metadata: v.optional(v.string()), // JSON string with batch details
    })
      .index("by_manufacturer", ["manufacturerId"])
      .index("by_batch_number", ["batchNumber"]),

    // Alerts and Notifications
    alerts: defineTable({
      userId: v.id("users"),
      title: v.string(),
      message: v.string(),
      severity: v.union(v.literal("info"), v.literal("warning"), v.literal("critical")),
      isRead: v.boolean(),
      link: v.optional(v.string()),
      metadata: v.optional(v.any()),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_read", ["userId", "isRead"]),

    // Health Records
    healthRecords: defineTable({
      userId: v.id("users"),
      recordType: v.union(
        v.literal("prescription"),
        v.literal("diagnosis"),
        v.literal("lab_report"),
        v.literal("vaccination"),
        v.literal("allergy")
      ),
      title: v.string(),
      description: v.string(),
      doctorId: v.optional(v.id("users")),
      hospitalId: v.optional(v.id("organizations")), // Note: organizations table not defined yet, using users or string might be safer if orgs not implemented
      date: v.string(),
      medications: v.optional(v.array(v.id("medicines"))),
      isPrivate: v.boolean(),
      fileStorageId: v.optional(v.id("_storage")),
    })
      .index("by_user", ["userId"])
      .index("by_type", ["recordType"]),

    // Prescriptions
    prescriptions: defineTable({
      doctorId: v.id("users"),
      patientId: v.id("users"),
      diagnosis: v.string(),
      medications: v.array(v.object({
        medicineId: v.id("medicines"),
        dosage: v.string(),
        frequency: v.string(),
        duration: v.string(),
        instructions: v.string(),
      })),
      prescriptionDate: v.string(),
      validUntil: v.string(),
      status: v.union(v.literal("active"), v.literal("completed"), v.literal("cancelled")),
      notes: v.optional(v.string()),
      qrCode: v.string(),
    })
      .index("by_patient", ["patientId"])
      .index("by_doctor", ["doctorId"])
      .index("by_status", ["status"])
      .index("by_qr_code", ["qrCode"]),
      
    // Organizations (Hospitals, Pharmacies) - Placeholder if needed
    organizations: defineTable({
      name: v.string(),
      type: v.string(),
      address: v.string(),
      contact: v.string(),
      isVerified: v.boolean(),
    }),
  },
  {
    schemaValidation: false,
  },
);

export default schema;