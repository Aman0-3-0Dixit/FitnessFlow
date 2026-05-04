import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

export default function RadioGroup({ options, value, onChange }) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = value === option.value
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected && <View style={styles.radioDot} />}
            </View>

            <View style={styles.labelBlock}>
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {option.label}
              </Text>
              {option.description ? (
                <Text style={styles.description}>{option.description}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A24',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2A2A38',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 14,
  },
  optionSelected: {
    borderColor: '#7C6EF8',
    backgroundColor: '#1E1B38',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3A3A50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#7C6EF8',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C6EF8',
  },
  labelBlock: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: '#AAAABC',
    fontWeight: '500',
  },
  labelSelected: {
    color: '#F2F2F2',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
})