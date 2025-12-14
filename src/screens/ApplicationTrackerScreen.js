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
  Alert,
  Linking
} from "react-native";
import { useResponsive } from "../utils/useResponsive";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import ScreenHeader from "../components/ScreenHeader";
import ApplicationTrackerService from "../services/applicationTrackerService";
import { awardXP } from "../services/gamificationService";

const STATUSES = ["saved", "applied", "interview", "offer", "joined", "rejected"];

const STATUS_CONFIG = {
  saved: { label: "Saved", icon: "bookmark", color: "#6B7280" },
  applied: { label: "Applied", icon: "send", color: "#3B82F6" },
  interview: { label: "Interview", icon: "event", color: "#F59E0B" },
  offer: { label: "Offer", icon: "card-giftcard", color: "#10B981" },
  joined: { label: "Joined", icon: "check-circle", color: "#059669" },
  rejected: { label: "Rejected", icon: "cancel", color: "#EF4444" }
};

const STATUS_ORDER = ["saved", "applied", "interview", "offer", "joined", "rejected"];

export default function ApplicationTrackerScreen({ showHamburger, onToggleSidebar }) {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  useEffect(() => {
    const unsubscribe = ApplicationTrackerService.listenToApplications((apps) => {
      setApplications(apps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    });
    return unsubscribe;
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    // Optimistic or waiting for result?
    // User requested "Update ONLY currentStatus".
    const result = await ApplicationTrackerService.updateStatus(appId, newStatus);
    if (!result.success) {
      Alert.alert("Error", result.message);
    } else {
      setToastMsg(`Status updated for your reference`);
      if (newStatus === "applied") {
        awardXP("APPLY_INTERNSHIP");
      }
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
    if (window.confirm("Are you sure you want to delete this application?")) {
      const result = await ApplicationTrackerService.removeApplication(appId);
      if (result.success) {
        setToastMsg("Application deleted");
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

  const statusIndex = (status) => STATUS_ORDER.indexOf(status?.toLowerCase());

  const getStatusStats = () => {
    // SINGLE SOURCE OF TRUTH: Computed on render
    return {
      saved: applications.filter(e => statusIndex(e.status) >= 0).length,
      applied: applications.filter(e => statusIndex(e.status) >= 1).length,
      interview: applications.filter(e => statusIndex(e.status) >= 2).length,
      offer: applications.filter(e => statusIndex(e.status) >= 3).length,
      joined: applications.filter(e => e.status === "joined").length,
      rejected: applications.filter(e => e.status === "rejected").length,
    };
  };

  const stats = getStatusStats();
  const filteredApps = getFilteredApps();

  // Empty State Logic
  if (applications.length === 0) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <ScreenHeader
          title="Application Tracker"
          subtitle="Track your internship journey"
          showHamburger={showHamburger}
          onToggleSidebar={onToggleSidebar}
          showLogo={true}
        />
        <View style={styles.emptyContainer}>
          <MaterialIcons name="dashboard-customize" size={64} color={colors.textLight} />
          <Text style={styles.emptyTitle}>You haven’t tracked any internships yet</Text>
          <Text style={styles.emptySubtitle}>
            Use 'Track Application' from an internship details page to start utilizing your personal tracker.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <ScreenHeader
        title="Application Tracker"
        subtitle="Track your internship journey"
        showHamburger={showHamburger}
        onToggleSidebar={onToggleSidebar}
        showLogo={true}
      />

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <MaterialIcons name="info-outline" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          This tracker is for your personal reference only. Updating status here does not affect your actual applications on external sites.
        </Text>
      </View>

      {/* Stats Overview */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
        <TouchableOpacity
          style={[styles.statCard, isMobile && styles.statCardMobile, filterStatus === "all" && styles.statCardActive]}
          onPress={() => setFilterStatus("all")}
        >
          <Text style={styles.statNumber}>{applications.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </TouchableOpacity>
        {STATUSES.map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.statCard, isMobile && styles.statCardMobile, filterStatus === status && styles.statCardActive]}
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
          filteredApps.map((app) => {
            const currentStatusIdx = statusIndex(app.status);
            return (
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
                  {STATUS_ORDER.map((status, idx) => {
                    const isActive = idx <= currentStatusIdx; // Strict sequential logic
                    const isCurrent = app.status === status;

                    return (
                      <TouchableOpacity
                        key={status}
                        style={[styles.timelineItem, isMobile && styles.timelineItemMobile]}
                        onPress={() => handleStatusChange(app.id, status)}
                      >
                        <View style={[
                          styles.timelineDot,
                          isActive && styles.timelineDotActive,
                          isCurrent && styles.timelineDotCurrent,
                          (status === 'rejected' && isActive) && { backgroundColor: '#EF4444' }
                        ]}>
                          <MaterialIcons
                            name={STATUS_CONFIG[status].icon}
                            size={12}
                            color={isActive ? "#fff" : "#9CA3AF"}
                          />
                        </View>
                        {/* Line to next */}
                        {idx < STATUS_ORDER.length - 1 && (
                          <View style={[
                            styles.timelineLine,
                            // Line is active if THIS node is active AND NEXT node is active
                            (isActive && (idx + 1 <= currentStatusIdx)) && styles.timelineLineActive
                          ]} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.statusRow}>
                  {(() => {
                    const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.saved;
                    return (
                      <View style={[styles.statusBadge, { backgroundColor: config.color + "20" }]}>
                        <MaterialIcons name={config.icon} size={14} color={config.color} />
                        <Text style={[styles.statusText, { color: config.color }]}>
                          {config.label}
                        </Text>
                      </View>
                    );
                  })()}
                  {app.deadline && (
                    <View style={styles.deadlineContainer}>
                      <MaterialIcons name="schedule" size={12} color="#F59E0B" />
                      <Text style={styles.deadlineText}>{app.deadline}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.actionButtons}>
                  {app.applyUrl && (
                    <TouchableOpacity
                      style={styles.applyButton}
                      onPress={() => Linking.openURL(app.applyUrl)}
                    >
                      <MaterialIcons name="open-in-new" size={16} color={colors.white} />
                      <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.detailsButton} onPress={() => openDetailsModal(app)}>
                    <MaterialIcons name="edit-note" size={16} color={colors.primary} />
                    <Text style={styles.detailsButtonText}>Notes</Text>
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
            );
          })
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
  containerMobile: { padding: 12 },
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
  statCardMobile: {
    minWidth: 90,
    padding: 14,
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
  timelineItemMobile: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
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
  detailsButton: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1, minHeight: 44, paddingVertical: 8 },
  detailsButtonText: { fontSize: 12, color: colors.primary, fontWeight: "500" },
  deleteButtonNew: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, minHeight: 44, paddingVertical: 8 },
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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.grayLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.textDark,
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 20
  },
  saveButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  toastContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 100,
  },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  }
});
