import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

export default function MultiSelect({ options, values = [], onChange }) {

  const toggle = (val) => {
    if (values.includes(val)) {
      // Deselect
      onChange(values.filter(v => v !== val))
    } else {
      // Select
      onChange([...values, val])
    }
  }

  return (
    <View>
      <Text style={styles.hint}>
        {values.length === 0
          ? 'Tap to select days'
          : `${values.length} day${values.length > 1 ? 's' : ''} selected`}
      </Text>
      <View style={styles.grid}>
        {options.map((option) => {
          const selected = values.includes(option.value)
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => toggle(option.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#2A2A38',
    backgroundColor: '#1A1A24',
    minWidth: 70,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: '#7C6EF8',
    borderColor: '#7C6EF8',
  },
  chipText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
})