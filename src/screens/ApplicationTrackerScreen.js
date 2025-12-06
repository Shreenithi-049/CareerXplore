import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
  Modal,
  Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import ScreenHeader from "../components/ScreenHeader";
import ApplicationTrackerService from "../services/applicationTrackerService";

const STATUSES = ["saved", "applied", "interview", "offer", "joined", "rejected"];

const STATUS_CONFIG = {
  saved: { label: "Saved", icon: "bookmark", color: "#6B7280" },
  applied: { label: "Applied", icon: "send", color: "#3B82F6" },
  interview: { label: "Interview", icon: "event", color: "#F59E0B" },
  offer: { label: "Offer", icon: "card-giftcard", color: "#10B981" },
  joined: { label: "Joined", icon: "check-circle", color: "#059669" },
  rejected: { label: "Rejected", icon: "cancel", color: "#EF4444" }
};

export default function ApplicationTrackerScreen() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const unsubscribe = ApplicationTrackerService.listenToApplications((apps) => {
      setApplications(apps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    });
    return unsubscribe;
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    const result = await ApplicationTrackerService.updateStatus(appId, newStatus);
    if (!result.success) {
      Alert.alert("Error", result.message);
    }
  };

  const handleSaveDetails = async () => {
    if (!selectedApp) return;

    if (notes !== selectedApp.notes) {
      await ApplicationTrackerService.updateNotes(selectedApp.id, notes);
    }
    if (deadline !== selectedApp.deadline) {
      await ApplicationTrackerService.updateDeadline(selectedApp.id, deadline);
    }

    setShowModal(false);
    setSelectedApp(null);
  };

  const handleDelete = async (appId) => {
    console.log("Delete button pressed for app:", appId);
    
    if (window.confirm("Are you sure you want to delete this application?")) {
      console.log("Deleting application:", appId);
      const result = await ApplicationTrackerService.removeApplication(appId);
      console.log("Delete result:", result);
      
      if (result.success) {
        window.alert("Application deleted successfully!");
      } else {
        window.alert("Error: " + (result.message || "Failed to delete application"));
      }
    }
  };

  const openDetailsModal = (app) => {
    setSelectedApp(app);
    setNotes(app.notes || "");
    setDeadline(app.deadline || "");
    setShowModal(true);
  };

  const getFilteredApps = () => {
    if (filterStatus === "all") return applications;
    return applications.filter(app => app.status === filterStatus);
  };

  const getStatusStats = () => {
    const stats = {};
    STATUSES.forEach(status => {
      stats[status] = applications.filter(app => app.status === status).length;
    });
    return stats;
  };

  const stats = getStatusStats();
  const filteredApps = getFilteredApps();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Application Tracker" subtitle="Track your internship journey" />

      {/* Stats Overview */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
        <TouchableOpacity
          style={[styles.statCard, filterStatus === "all" && styles.statCardActive]}
          onPress={() => setFilterStatus("all")}
        >
          <Text style={styles.statNumber}>{applications.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </TouchableOpacity>
        {STATUSES.map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.statCard, filterStatus === status && styles.statCardActive]}
            onPress={() => setFilterStatus(status)}
          >
            <MaterialIcons name={STATUS_CONFIG[status].icon} size={20} color={STATUS_CONFIG[status].color} />
            <Text style={styles.statNumber}>{stats[status]}</Text>
            <Text style={styles.statLabel}>{STATUS_CONFIG[status].label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Applications List */}
      <ScrollView style={styles.list}>
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <View key={app.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <MaterialIcons name="work" size={20} color={colors.primary} />
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{app.title}</Text>
                    <Text style={styles.cardCompany}>{app.company}</Text>
                  </View>
                </View>
              </View>

              {/* Timeline */}
              <View style={styles.timeline}>
                {STATUSES.filter(s => s !== "rejected").map((status, idx) => {
                  const isActive = STATUSES.indexOf(app.status) >= idx;
                  const isCurrent = app.status === status;
                  return (
                    <TouchableOpacity
                      key={status}
                      style={styles.timelineItem}
                      onPress={() => handleStatusChange(app.id, status)}
                    >
                      <View style={[styles.timelineDot, isActive && styles.timelineDotActive, isCurrent && styles.timelineDotCurrent]}>
                        <MaterialIcons
                          name={STATUS_CONFIG[status].icon}
                          size={12}
                          color={isActive ? "#fff" : "#9CA3AF"}
                        />
                      </View>
                      {idx < STATUSES.length - 2 && (
                        <View style={[styles.timelineLine, isActive && styles.timelineLineActive]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.statusRow}>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_CONFIG[app.status].color + "20" }]}>
                  <MaterialIcons name={STATUS_CONFIG[app.status].icon} size={14} color={STATUS_CONFIG[app.status].color} />
                  <Text style={[styles.statusText, { color: STATUS_CONFIG[app.status].color }]}>
                    {STATUS_CONFIG[app.status].label}
                  </Text>
                </View>
                {app.deadline && (
                  <View style={styles.deadlineContainer}>
                    <MaterialIcons name="schedule" size={12} color="#F59E0B" />
                    <Text style={styles.deadlineText}>{app.deadline}</Text>
                  </View>
                )}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.detailsButton} onPress={() => openDetailsModal(app)}>
                  <MaterialIcons name="edit-note" size={16} color={colors.primary} />
                  <Text style={styles.detailsButtonText}>Add Notes & Details</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButtonNew} 
                  onPress={() => handleDelete(app.id)}
                >
                  <MaterialIcons name="delete" size={16} color="#EF4444" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>
            {filterStatus === "all" 
              ? "No applications tracked yet. Save internships from the Internships tab!"
              : `No applications in ${STATUS_CONFIG[filterStatus].label} status`}
          </Text>
        )}
      </ScrollView>

      {/* Details Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Application Details</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedApp && (
              <>
                <Text style={styles.modalSubtitle}>{selectedApp.title} - {selectedApp.company}</Text>

                <Text style={styles.label}>Deadline</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 2024-12-31"
                  value={deadline}
                  onChangeText={setDeadline}
                />

                <Text style={styles.label}>Interview Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add interview questions, feedback, or any notes..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={6}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveDetails}>
                  <Text style={styles.saveButtonText}>Save Details</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  statsRow: { flexDirection: "row", marginBottom: 16, maxHeight: 90 },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grayBorder
  },
  statCardActive: { borderColor: colors.primary, borderWidth: 2 },
  statNumber: { fontSize: 18, fontWeight: "700", color: colors.text, marginTop: 4 },
  statLabel: { fontSize: 10, color: colors.textLight, marginTop: 2 },
  list: { flex: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.grayBorder
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, alignItems: "center" },
  cardHeaderLeft: { flexDirection: "row", gap: 8, flex: 1 },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  cardCompany: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  timeline: { flexDirection: "row", marginBottom: 12, paddingHorizontal: 8 },
  timelineItem: { flex: 1, alignItems: "center", position: "relative" },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2
  },
  timelineDotActive: { backgroundColor: colors.primary },
  timelineDotCurrent: { backgroundColor: colors.accent, transform: [{ scale: 1.1 }] },
  timelineLine: {
    position: "absolute",
    top: 14,
    left: "50%",
    right: "-50%",
    height: 2,
    backgroundColor: "#E5E7EB",
    zIndex: 1
  },
  timelineLineActive: { backgroundColor: colors.primary },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "600" },
  deadlineContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  deadlineText: { fontSize: 11, color: "#F59E0B", fontWeight: "500" },
  actionButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, gap: 8 },
  detailsButton: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  detailsButtonText: { fontSize: 12, color: colors.primary, fontWeight: "500" },
  deleteButtonNew: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8 },
  deleteButtonText: { fontSize: 12, color: "#EF4444", fontWeight: "500" },
  noData: { textAlign: "center", color: colors.textLight, marginTop: 40, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "80%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  modalSubtitle: { fontSize: 14, color: colors.textLight, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: colors.text, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13
  },
  textArea: { height: 120, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 20
  },
  saveButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" }
});
