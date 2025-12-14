import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import { useResponsive } from '../utils/useResponsive';

const FAQItem = ({ question, answer, icon }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.faqItem}>
            <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.7}
            >
                <View style={styles.questionRow}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name={icon} size={20} color={colors.accent} />
                    </View>
                    <Text style={styles.question}>{question}</Text>
                </View>
                <MaterialIcons
                    name={expanded ? "expand-less" : "expand-more"}
                    size={24}
                    color={colors.textLight}
                />
            </TouchableOpacity>
            {expanded && (
                <View style={styles.answerContainer}>
                    <Text style={styles.answer}>{answer}</Text>
                </View>
            )}
        </View>
    );
};

export default function HelpScreen({ showHamburger, onToggleSidebar }) {
    const { isMobile } = useResponsive();

    const faqs = [
        {
            question: "How do I get career recommendations?",
            answer: "Go to the 'Profile' tab and add your skills and interests. The AI analyzes your profile to suggest the best career paths and internships for you. Update your profile regularly for better matches!",
            icon: "lightbulb"
        },
        {
            question: "How does the Application Tracker work?",
            answer: "The tracker is a manual tool to organize your job search. You can save internships from the 'Internships' tab, or add them manually. Update statuses (Applied, Interviewing, Offer) to keep track of your progress. Note: It does not automatically apply for you.",
            icon: "track-changes"
        },
        {
            question: "What are XP and Levels?",
            answer: "You earn XP for exploring careers, applying to jobs, and updating your profile. As you gain XP, you Level Up and earn Badges. It's our way of making your career journey fun and rewarding!",
            icon: "bolt"
        },
        {
            question: "How do I use the AI Resume Analyzer?",
            answer: "Navigate to your Profile and upload a resume (PDF). Once uploaded, click 'Analyze' to get an instant AI score, strengths, and improvement suggestions.",
            icon: "description"
        },
        {
            question: "Can I customize my profile?",
            answer: "Yes! Click the 'Edit' button on your Profile page to update your photo, education, skills, and interests anytime.",
            icon: "person"
        }
    ];

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Help & Guide"
                subtitle="How to use CareerXplore"
                showHamburger={showHamburger}
                onToggleSidebar={onToggleSidebar}
                showLogo={true}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.introBox}>
                    <Text style={styles.introTitle}>Welcome to CareerXplore! 🚀</Text>
                    <Text style={styles.introText}>
                        We're here to help you navigate your career journey. Tap on a topic below to learn more.
                    </Text>
                </View>

                <View style={styles.aboutBox}>
                    <Text style={styles.aboutTitle}>About CareerXplore</Text>
                    <Text style={styles.aboutText}>
                        CareerXplore is a personal career guidance and internship planning platform designed to help students and freshers explore career options, improve their readiness, and stay organized throughout their journey. The app provides curated career recommendations, internship discovery, resume analysis, and AI-driven insights based on your profile and skills. All tracking features within CareerXplore are user-managed and intended for personal reference only, helping you monitor applications and progress without affecting external platforms. By keeping your profile and resume updated, you can make better use of the app’s insights and recommendations to plan your career path more effectively.
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                <View style={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </View>

                <View style={styles.contactContainer}>
                    <Text style={styles.contactTitle}>Still need help?</Text>
                    <Text style={styles.contactText}>
                        Ask our AI Assistant (chat button in the corner) or contact support.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        // Mobile adjustment handled by parent or responsive styles if needed
    },
    content: {
        paddingBottom: 40,
    },
    introBox: {
        backgroundColor: colors.primary,
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
    },
    introTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 8,
    },
    introText: {
        fontSize: 14,
        color: colors.white,
        opacity: 0.9,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 16,
    },
    aboutBox: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.grayBorder,
    },
    aboutTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 8,
    },
    aboutText: {
        fontSize: 14,
        color: colors.textDark,
        lineHeight: 22,
    },
    faqList: {
        gap: 12,
    },
    faqItem: {
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.grayBorder,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.grayLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    question: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textDark,
        flex: 1,
    },
    answerContainer: {
        padding: 16,
        paddingTop: 0,
        backgroundColor: colors.card,
    },
    answer: {
        fontSize: 14,
        color: colors.textLight,
        lineHeight: 20,
    },
    contactContainer: {
        marginTop: 32,
        alignItems: 'center',
        padding: 20,
        // borderTopWidth: 1,
        // borderTopColor: colors.grayBorder,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 6,
    },
    contactText: {
        fontSize: 13,
        color: colors.textLight,
        textAlign: 'center',
    },
});
