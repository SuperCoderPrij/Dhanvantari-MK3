mkdir -p src/pages/consumer
mv src/pages/Dashboard.tsx src/pages/consumer/Layout.tsx
mv src/pages/MedicineScan.tsx src/pages/consumer/MedicineScan.tsx
mv src/pages/Medicines.tsx src/pages/consumer/Medicines.tsx
mv src/pages/HealthRecords.tsx src/pages/consumer/HealthRecords.tsx
mv src/pages/Prescriptions.tsx src/pages/consumer/Prescriptions.tsx
mv src/pages/Alerts.tsx src/pages/consumer/Alerts.tsx
mv src/pages/Settings.tsx src/pages/consumer/Settings.tsx
rm src/pages/DashboardHome.tsx
rm -rf temp_dhanvantari_2
