import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'

const LABELS = {
  ageRange: {
    under_18: 'Under 18', '18_25': '18–25', '26_35': '26–35',
    '36_50': '36–50', '50_plus': '50+',
  },
  dietPreference: {
    none: 'No preference', vegetarian: 'Vegetarian', vegan: 'Vegan',
    keto: 'Keto', if: 'Intermittent Fasting',
  },
  experienceLevel: {
    beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced',
  },
}

const resolve = (map, val) => map?.[val] ?? val ?? '—'

const STATUS_COLOR = {
  complete: '#50C878',
  done: '#50C878',
}

export default function AdminScreen({ navigation }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const fetchSessions = async () => {
    setLoading(true)
    setError(false)
    try {
      const q = query(collection(db, 'userProgress'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      data.sort((a, b) => new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0))
      setSessions(data)
    } catch (err) {
      console.warn('Fetch failed:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const toggleExpand = (id) => {
    setExpanded(prev => prev === id ? null : id)
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const getStatus = (session) => {
    if (session.currentStep === 'complete' || session.currentStep === 'done') return 'Complete'
    return `Step ${session.currentStep}`
  }

  const getStatusColor = (session) => {
    if (session.currentStep === 'complete' || session.currentStep === 'done') return '#50C878'
    return '#7C6EF8'
  }

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C6EF8" />
          <Text style={styles.loadingText}>Fetching sessions...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Error state with retry
  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Couldn't load sessions</Text>
          <Text style={styles.errorSub}>Check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchSessions}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <Text style={styles.heading}>Saved Sessions</Text>
            <Text style={styles.count}>{sessions.length} total</Text>
          </View>
          <TouchableOpacity onPress={fetchSessions} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* Empty state */}
        {sessions.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptySub}>Complete the flow and data will appear here.</Text>
          </View>
        )}

        {/* Session cards */}
        {sessions.map((session) => {
          const isOpen = expanded === session.id
          const answers = session.answers ?? {}

          return (
            <TouchableOpacity
              key={session.id}
              style={[styles.card, isOpen && styles.cardOpen]}
              onPress={() => toggleExpand(session.id)}
              activeOpacity={0.8}
            >
              {/* Card header row */}
              <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(session) }]}>
                      {getStatus(session)}
                    </Text>
                  </View>
                  <Text style={styles.sessionDate}>{formatDate(session.updatedAt)}</Text>
                </View>
                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
              </View>

              <Text style={styles.sessionId} numberOfLines={1}>
                ID: {session.id}
              </Text>

              {isOpen && (
                <View style={styles.answersBlock}>
                  <View style={styles.divider} />

                  <AnswerRow label="Age Range" value={resolve(LABELS.ageRange, answers.ageRange)} />
                  <AnswerRow label="Goal" value={answers.goal ?? '—'} />

                  {answers.goal === 'Weight Loss' && (
                    <AnswerRow
                      label="Diet Preference"
                      value={resolve(LABELS.dietPreference, answers.dietPreference)}
                      highlight
                    />
                  )}

                  <AnswerRow
                    label="Workout Days"
                    value={Array.isArray(answers.workoutDays) && answers.workoutDays.length > 0
                      ? answers.workoutDays.join(', ')
                      : '—'}
                  />

                  <AnswerRow
                    label="Experience"
                    value={resolve(LABELS.experienceLevel, answers.experienceLevel)}
                  />
                </View>
              )}
            </TouchableOpacity>
          )
        })}

        <Text style={styles.footer}>Fetched live from Firestore</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

function AnswerRow({ label, value, highlight }) {
  return (
    <View style={styles.answerRow}>
      <Text style={styles.answerLabel}>{label}</Text>
      <Text style={[styles.answerValue, highlight && styles.answerValueHighlight]}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0F14',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  errorIcon: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F2F2F2',
  },
  errorSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#7C6EF8',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    color: '#888',
    fontSize: 15,
  },
  headerRight: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F2F2F2',
  },
  count: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  refreshBtn: {
    padding: 4,
  },
  refreshText: {
    color: '#7C6EF8',
    fontSize: 22,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F2F2F2',
  },
  emptySub: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1A1A24',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2A2A38',
    padding: 16,
    marginBottom: 12,
  },
  cardOpen: {
    borderColor: '#7C6EF8',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sessionDate: {
    fontSize: 12,
    color: '#555',
  },
  chevron: {
    color: '#444',
    fontSize: 12,
  },
  sessionId: {
    fontSize: 11,
    color: '#444',
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A38',
    marginVertical: 12,
  },
  answersBlock: {
    gap: 8,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  answerValue: {
    fontSize: 13,
    color: '#F2F2F2',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  answerValueHighlight: {
    color: '#7C6EF8',
  },
  footer: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
  },
})