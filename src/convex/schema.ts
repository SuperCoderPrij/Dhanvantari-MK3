import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  DOCTOR: "doctor",
  PHARMACIST: "pharmacist",
  MANUFACTURER: "manufacturer",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.DOCTOR),
  v.literal(ROLES.PHARMACIST),
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
      
      // Additional user fields
      phone: v.optional(v.string()),
      dateOfBirth: v.optional(v.string()),
      address: v.optional(v.string()),
      licenseNumber: v.optional(v.string()), // for doctors/pharmacists
      organizationId: v.optional(v.id("organizations")),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Organizations (hospitals, pharmacies, manufacturers)
    organizations: defineTable({
      name: v.string(),
      type: v.union(v.literal("hospital"), v.literal("pharmacy"), v.literal("manufacturer")),
      address: v.string(),
      phone: v.string(),
      email: v.string(),
      licenseNumber: v.string(),
      verificationStatus: verificationStatusValidator,
      createdBy: v.id("users"),
    }).index("by_type", ["type"])
      .index("by_verification_status", ["verificationStatus"]),

    // Medicines database
    medicines: defineTable({
      name: v.string(),
      genericName: v.string(),
      manufacturer: v.string(),
      manufacturerId: v.optional(v.id("organizations")),
      batchNumber: v.string(),
      manufacturingDate: v.string(),
      expiryDate: v.string(),
      composition: v.string(),
      dosageForm: v.string(), // tablet, capsule, syrup, etc.
      strength: v.string(),
      price: v.number(),
      description: v.string(),
      sideEffects: v.optional(v.string()),
      contraindications: v.optional(v.string()),
      storageConditions: v.optional(v.string()),
      qrCode: v.string(), // unique QR code for verification
      blockchainHash: v.optional(v.string()), // blockchain transaction hash
      imageUrl: v.optional(v.string()),
      verificationStatus: verificationStatusValidator,
      isRecalled: v.boolean(),
    }).index("by_batch_number", ["batchNumber"])
      .index("by_manufacturer", ["manufacturerId"])
      .index("by_qr_code", ["qrCode"])
      .index("by_verification_status", ["verificationStatus"]),

    // Medicine scans (AI-powered scanning history)
    medicineScans: defineTable({
      userId: v.id("users"),
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
    }).index("by_user", ["userId"]),

    // Health records
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
      hospitalId: v.optional(v.id("organizations")),
      date: v.string(),
      attachments: v.optional(v.array(v.id("_storage"))),
      medications: v.optional(v.array(v.id("medicines"))),
      isPrivate: v.boolean(),
    }).index("by_user", ["userId"])
      .index("by_doctor", ["doctorId"])
      .index("by_record_type", ["recordType"]),

    // Prescriptions
    prescriptions: defineTable({
      patientId: v.id("users"),
      doctorId: v.id("users"),
      hospitalId: v.optional(v.id("organizations")),
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
      qrCode: v.string(), // for verification at pharmacy
    }).index("by_patient", ["patientId"])
      .index("by_doctor", ["doctorId"])
      .index("by_status", ["status"])
      .index("by_qr_code", ["qrCode"]),

    // Pharmacy orders
    pharmacyOrders: defineTable({
      prescriptionId: v.id("prescriptions"),
      patientId: v.id("users"),
      pharmacyId: v.id("organizations"),
      medications: v.array(v.object({
        medicineId: v.id("medicines"),
        quantity: v.number(),
        price: v.number(),
        batchNumber: v.string(),
      })),
      totalAmount: v.number(),
      orderDate: v.number(),
      status: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("ready"),
        v.literal("completed"),
        v.literal("cancelled")
      ),
      verificationCode: v.string(),
    }).index("by_patient", ["patientId"])
      .index("by_pharmacy", ["pharmacyId"])
      .index("by_prescription", ["prescriptionId"])
      .index("by_status", ["status"]),

    // Verification logs (blockchain audit trail)
    verificationLogs: defineTable({
      entityType: v.union(v.literal("medicine"), v.literal("prescription"), v.literal("organization")),
      entityId: v.string(),
      action: v.string(),
      performedBy: v.id("users"),
      timestamp: v.number(),
      blockchainHash: v.optional(v.string()),
      details: v.string(),
      ipAddress: v.optional(v.string()),
    }).index("by_entity", ["entityType", "entityId"])
      .index("by_user", ["performedBy"]),

    // Alerts and notifications
    alerts: defineTable({
      userId: v.id("users"),
      type: v.union(
        v.literal("medicine_recall"),
        v.literal("expiry_warning"),
        v.literal("prescription_reminder"),
        v.literal("verification_alert")
      ),
      title: v.string(),
      message: v.string(),
      severity: v.union(v.literal("info"), v.literal("warning"), v.literal("critical")),
      isRead: v.boolean(),
      relatedEntityId: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_user", ["userId"])
      .index("by_user_and_read", ["userId", "isRead"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;